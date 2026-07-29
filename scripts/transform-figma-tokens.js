#!/usr/bin/env node

/**
 * Transform Figma-exported design token JSON (DTCG format) into
 * website/tokens/global.json and website/tokens/theme.json.
 *
 * Background:
 * Figma's Variables REST API requires an Enterprise plan, which this org's
 * Figma seat does not have. Instead, designers use Figma's built-in
 * "Export variables" feature (Variables panel > ... > Export), which produces
 * one JSON file per collection mode. This script consumes that raw export.
 *
 * Expected input layout (drop the unzipped Figma export here):
 *
 *   tokens-source/
 *     flamingo-theme/          <- one file per brand mode, e.g. "Foodora.tokens.json"
 *       Foodora.tokens.json
 *       Glovo.tokens.json
 *       ...
 *     dark-mode/                <- "Off.tokens.json" (light) and "On.tokens.json" (dark)
 *       Off.tokens.json
 *       On.tokens.json
 *
 * Output:
 *   website/tokens/global.json  <- spacing, sizing, typography, radius, etc.
 *                                  (identical across light/dark, so sourced
 *                                  once from dark-mode/Off.tokens.json)
 *   website/tokens/theme.json   <- colours, per brand, per light/dark mode
 *
 * Usage:
 *   node scripts/transform-figma-tokens.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'tokens-source');
const OUTPUT_DIR = path.join(__dirname, '..', 'website', 'tokens');

const FLAMINGO_THEME_DIR = path.join(SOURCE_DIR, 'flamingo-theme');
const DARK_MODE_DIR = path.join(SOURCE_DIR, 'dark-mode');

// Non-colour categories live in the Dark mode collection but do not vary
// between Off/On, so we treat Off as the canonical source for these.
const GLOBAL_CATEGORIES = [
  'Spacing',
  'Opacity',
  'Corner radius',
  'Border thickness',
  'Font size',
  'Line height',
  'Letter spacing',
  'Paragraph spacing',
  'List spacing',
  'Blur',
];

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve a single token's $value into a plain literal.
 * - Colour values are objects with a `.hex` field once resolved.
 * - Numbers are already plain numbers.
 * - Internal references look like "{Group Name.tokenName}" and must be
 *   resolved by looking up that group/token within the same file.
 */
function resolveValue(value, fileTokensByGroup, seen = new Set()) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'hex' in value) {
    return value.hex;
  }

  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const refKey = value.slice(1, -1); // "Group Name.tokenName"
    if (seen.has(refKey)) {
      throw new Error(`Circular token reference detected: ${refKey}`);
    }
    seen.add(refKey);

    const dotIndex = refKey.lastIndexOf('.');
    const groupName = refKey.slice(0, dotIndex);
    const tokenName = refKey.slice(dotIndex + 1);

    const group = fileTokensByGroup[groupName];
    if (!group || !group[tokenName]) {
      throw new Error(`Unresolvable token reference: ${refKey}`);
    }

    return resolveValue(group[tokenName].$value, fileTokensByGroup, seen);
  }

  return value;
}

/**
 * Flatten a single group's tokens into { tokenName: resolvedValue }
 */
function flattenGroup(groupName, fileTokensByGroup) {
  const group = fileTokensByGroup[groupName];
  if (!group) return {};

  const result = {};
  for (const [tokenName, token] of Object.entries(group)) {
    if (!token || typeof token !== 'object' || !('$value' in token)) continue;
    // Strip parenthetical annotations designers add in Figma, e.g.
    // "opacity00 (transparent)" -> "opacity00"
    const cleanName = tokenName.replace(/\s*\([^)]*\)\s*$/, '').trim();
    result[cleanName] = resolveValue(token.$value, fileTokensByGroup);
  }
  return result;
}

/**
 * Build website/tokens/global.json from dark-mode/Off.tokens.json
 */
function buildGlobalTokens() {
  const offFile = path.join(DARK_MODE_DIR, 'Off.tokens.json');
  if (!fs.existsSync(offFile)) {
    throw new Error(`Missing source file: ${offFile}`);
  }

  const data = readJSON(offFile);
  const global = {};

  for (const category of GLOBAL_CATEGORIES) {
    if (!data[category]) continue;
    const key = toKebabCase(category);
    global[key] = flattenGroup(category, data);
  }

  return global;
}

/**
 * Build website/tokens/theme.json from every brand file in flamingo-theme/,
 * combined with light/dark semantic colours resolved against that brand's
 * own Global Colours group.
 */
function buildThemeTokens() {
  if (!fs.existsSync(FLAMINGO_THEME_DIR)) {
    throw new Error(`Missing source directory: ${FLAMINGO_THEME_DIR}`);
  }

  const brandFiles = fs
    .readdirSync(FLAMINGO_THEME_DIR)
    .filter((f) => f.endsWith('.tokens.json'));

  const theme = {};

  for (const file of brandFiles) {
    const brandName = file.replace('.tokens.json', '');
    const brandSlug = toKebabCase(brandName);
    const data = readJSON(path.join(FLAMINGO_THEME_DIR, file));

    theme[brandSlug] = {
      name: brandName,
      light: flattenGroup('Semantic light colours', data),
      dark: flattenGroup('Semantic dark colours', data),
      illustration: flattenGroup('Illustration colours', data),
    };
  }

  return theme;
}

function writeOutput(filename, contents) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const outPath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(outPath, JSON.stringify(contents, null, 2) + '\n');
  console.log(`✅ Wrote ${outPath}`);
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Missing tokens-source/ directory at ${SOURCE_DIR}`);
    console.error('   Export variables from Figma and place them there first.');
    console.error('   See scripts/README-tokens.md for instructions.');
    process.exit(1);
  }

  console.log('🔗 Transforming Figma token export...\n');

  const global = buildGlobalTokens();
  writeOutput('global.json', global);
  console.log(`   Categories: ${Object.keys(global).join(', ')}\n`);

  const theme = buildThemeTokens();
  writeOutput('theme.json', theme);
  console.log(`   Brands: ${Object.keys(theme).join(', ')}\n`);

  console.log('✨ Token transform complete!');
}

try {
  main();
} catch (error) {
  console.error('❌ Transform failed:', error.message);
  process.exit(1);
}
