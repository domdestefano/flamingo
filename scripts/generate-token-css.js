#!/usr/bin/env node

/**
 * Generate CSS custom properties from website/tokens/global.json and
 * website/tokens/theme.json.
 *
 * Output: website/src/css/tokens.css
 *
 * - Global tokens (spacing, sizing, typography, radius, border, opacity,
 *   blur) are written once to :root, since they don't vary by brand or mode.
 * - Colour tokens are brand + mode specific. Since the docs site doesn't yet
 *   have a brand switcher, one brand is picked as the site default (see
 *   DEFAULT_BRAND below) and wired to :root / [data-theme='dark'], which
 *   Docusaurus already toggles via its built-in light/dark switch.
 * - Every brand is still emitted as [data-brand='<brand>'][data-theme='...']
 *   selectors, so a future brand switcher can just set `data-brand` on
 *   <html> to preview any brand without further changes here.
 *
 * Usage:
 *   node scripts/generate-token-css.js
 */

const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '..', 'website', 'tokens');
const OUTPUT_FILE = path.join(__dirname, '..', 'website', 'src', 'css', 'tokens.css');

// Which brand's colours power the docs site by default (no brand switcher yet).
const DEFAULT_BRAND = 'foodora';

// Unit suffix per global token category.
const UNITS = {
  spacing: 'px',
  'corner-radius': 'px',
  'border-thickness': 'px',
  'font-size': 'px',
  'line-height': 'px',
  'letter-spacing': 'px',
  'paragraph-spacing': 'px',
  'list-spacing': 'px',
  blur: 'px',
  opacity: '%',
};

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function cssVarName(...parts) {
  return `--flamingo-${parts.join('-')}`;
}

function renderGlobalBlock(globalTokens) {
  const lines = [':root {'];

  // Token names already carry their category (e.g. "corner-radius01",
  // "spacing01"), so the variable is just --flamingo-<tokenName> rather than
  // --flamingo-<category>-<tokenName>.
  for (const [category, tokens] of Object.entries(globalTokens)) {
    const unit = UNITS[category] || '';
    lines.push(`  /* ${category} */`);
    for (const [name, value] of Object.entries(tokens)) {
      lines.push(`  ${cssVarName(name)}: ${value}${unit};`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function renderColourVars(colours) {
  return Object.entries(colours)
    .map(([name, hex]) => `  ${cssVarName(name)}: ${hex};`)
    .join('\n');
}

function renderBrandBlocks(theme) {
  const blocks = [];

  for (const [brandSlug, brand] of Object.entries(theme)) {
    const isDefault = brandSlug === DEFAULT_BRAND;

    const lightSelector = isDefault
      ? `:root,\n[data-brand='${brandSlug}']`
      : `[data-brand='${brandSlug}']`;

    const darkSelector = isDefault
      ? `[data-theme='dark'],\n[data-brand='${brandSlug}'][data-theme='dark']`
      : `[data-brand='${brandSlug}'][data-theme='dark']`;

    blocks.push(`/* ${brand.name} — light */\n${lightSelector} {\n${renderColourVars(brand.light)}\n}`);
    blocks.push(`/* ${brand.name} — dark */\n${darkSelector} {\n${renderColourVars(brand.dark)}\n}`);

    if (brand.illustration && Object.keys(brand.illustration).length > 0) {
      blocks.push(
        `/* ${brand.name} — illustration */\n${lightSelector} {\n${renderColourVars(brand.illustration)}\n}`
      );
    }
  }

  return blocks.join('\n\n');
}

function main() {
  const globalPath = path.join(TOKENS_DIR, 'global.json');
  const themePath = path.join(TOKENS_DIR, 'theme.json');

  if (!fs.existsSync(globalPath) || !fs.existsSync(themePath)) {
    console.error('❌ Missing website/tokens/global.json or theme.json.');
    console.error('   Run scripts/transform-figma-tokens.js first.');
    process.exit(1);
  }

  const globalTokens = readJSON(globalPath);
  const theme = readJSON(themePath);

  if (!theme[DEFAULT_BRAND]) {
    console.error(`❌ DEFAULT_BRAND "${DEFAULT_BRAND}" not found in theme.json.`);
    console.error(`   Available brands: ${Object.keys(theme).join(', ')}`);
    process.exit(1);
  }

  const header = `/**
 * AUTO-GENERATED — do not edit directly.
 * Regenerate with: node scripts/generate-token-css.js
 * Source: website/tokens/global.json, website/tokens/theme.json
 *
 * Default brand: ${DEFAULT_BRAND} (see DEFAULT_BRAND in scripts/generate-token-css.js)
 * Light/dark follow Docusaurus's [data-theme] toggle automatically.
 * Other brands are available via [data-brand='<slug>'] for a future brand switcher.
 */\n`;

  const css = [
    header,
    renderGlobalBlock(globalTokens),
    '',
    renderBrandBlocks(theme),
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, css);
  console.log(`✅ Wrote ${OUTPUT_FILE}`);
  console.log(`   Default brand: ${DEFAULT_BRAND}`);
  console.log(`   Brands available via [data-brand]: ${Object.keys(theme).join(', ')}`);
}

main();
