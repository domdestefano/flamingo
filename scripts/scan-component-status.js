#!/usr/bin/env node

/**
 * Scan the four platform source trees and generate the Component Status table
 * data used by website/docs/components/component-status.mdx.
 *
 * Rows come from the canonical component names already documented in
 * website/src/components/ComponentGallery/data.ts — so the table speaks the
 * design system's own vocabulary rather than inventing names from code.
 * Code symbols are auto-matched onto those rows; anything that doesn't match
 * is reported rather than silently dropped.
 *
 * The two Android sources build variants differently from iOS/Web, and the
 * table is meant to show that: rrds-compose exposes one function per variant
 * (ButtonPrimaryBig, ButtonPrimarySmall, ...), while iOS and Web expose a
 * single symbol parameterised by enums/props. Both shapes are captured.
 *
 * Usage:
 *   node scripts/scan-component-status.js [--dry-run]
 *
 * Environment variables required:
 * - GH_SCAN_TOKEN: GitHub token with read access to the three source repos.
 *   Locally you can reuse your gh login: export GH_SCAN_TOKEN=$(gh auth token)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GH_TOKEN = process.env.GH_SCAN_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const REPO_ROOT = path.join(__dirname, '..');
const OVERRIDES_FILE = path.join(__dirname, 'component-status-overrides.json');
const GALLERY_DATA = path.join(
  REPO_ROOT,
  'website/src/components/ComponentGallery/data.ts'
);
const OUT_DATA = path.join(
  REPO_ROOT,
  'website/src/components/ComponentStatusTable/data.ts'
);
const OUT_PR_BODY = path.join(REPO_ROOT, 'component-status-pr-body.md');

// Minimum match confidence. A symbol carrying an extra unrelated word scores
// 50, so requiring more than that keeps "Floating button" from claiming
// FloatingIconButton, and "Badge" from claiming BadgeStyle.
const MIN_SCORE = 50;

if (!GH_TOKEN) {
  console.error('❌ GH_SCAN_TOKEN environment variable is required');
  console.error('   Locally: export GH_SCAN_TOKEN=$(gh auth token)');
  process.exit(1);
}

// --- Source definitions -----------------------------------------------------

const SOURCES = {
  androidCommonUi: {
    label: 'Android – common-ui',
    repo: 'deliveryhero/logistics-rider-app-android',
    ref: 'develop',
    root: 'common-ui/src/main/java/com/ui/common/widget',
    ext: '.kt',
  },
  androidCompose: {
    label: 'Android – rrds-compose',
    repo: 'deliveryhero/logistics-rider-app-android',
    ref: 'develop',
    root: 'rrds-compose/src/main/java/com/roadrunner/rrds/compose/component',
    ext: '.kt',
  },
  ios: {
    label: 'iOS',
    repo: 'deliveryhero/logistics-rider-app-ios',
    ref: 'develop',
    root: 'Dependencies/DesignSystem/Sources/Components',
    ext: '.swift',
  },
  web: {
    label: 'Web',
    repo: 'deliveryhero/rrds-web',
    ref: 'flamingo',
    root: 'packages/core/src/components',
    ext: '.ts',
  },
};

// Variant suffixes used by rrds-compose function names. Stacked suffixes are
// stripped repeatedly, so ButtonPrimaryDestructiveBig -> ButtonPrimary.
// Extend this list when new variant words show up in the compose library.
const KNOWN_SUFFIXES = [
  'Big',
  'Small',
  'Medium',
  'Large',
  'Destructive',
  'Inverse',
  'Inverted',
  'WithCountDown',
  'WithText',
  'WithIcon',
  'WithAction',
  'WithSuffix',
  'Filled',
  'Outlined',
  'Centered',
  'Default',
  'FullScreen',
  'Removable',
  'V2',
];

// Files that describe data/state/styling rather than a component surface.
const SUPPORT_FILE_RE = /(ViewData|ViewEntity|Style|Styles|Factory|Factories|State|Type|Types|Constants|Manager|Provider|Behavior|Decoration|Modifier|Extensions?)\.(kt|swift|ts|tsx)$/;

// --- GitHub API -------------------------------------------------------------

function ghGet(urlPath) {
  const url = `https://api.github.com${urlPath}`;
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Authorization: `Bearer ${GH_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'flamingo-component-status-scanner',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(
                new Error(`GitHub API ${res.statusCode} for ${url}: ${data.slice(0, 200)}`)
              );
              return;
            }
            resolve(JSON.parse(data));
          });
        }
      )
      .on('error', reject);
  });
}

async function listTree(source) {
  const tree = await ghGet(
    `/repos/${source.repo}/git/trees/${source.ref}?recursive=1`
  );
  if (tree.truncated) {
    console.warn(`⚠️  Tree for ${source.repo} was truncated by GitHub — results may be incomplete`);
  }
  return tree.tree
    .filter((n) => n.type === 'blob')
    .map((n) => n.path)
    .filter((p) => p.startsWith(source.root + '/'));
}

async function readFile(source, filePath) {
  const res = await ghGet(
    `/repos/${source.repo}/contents/${encodeURI(filePath)}?ref=${source.ref}`
  );
  return Buffer.from(res.content, 'base64').toString('utf8');
}

// Bounded concurrency so we don't fire hundreds of parallel API calls.
async function mapLimit(items, limit, fn) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

// --- Name normalisation + matching -----------------------------------------

function splitWords(name) {
  return name
    .replace(/[-_/.]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function singularize(word) {
  if (word.length > 3 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 3 && word.endsWith('es') && /(x|s|ch|sh)es$/.test(word)) {
    return word.slice(0, -2);
  }
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) {
    return word.slice(0, -1);
  }
  return word;
}

// Words that carry no identity — dropping them lets "Drop Down" match
// "Dropdown" and "ButtonPrimary" match "Primary button".
const NOISE_WORDS = new Set(['view', 'component', 'screen', 'ds', 'rrds', 'the', 'a']);

function nameKeySet(name) {
  const words = splitWords(name)
    .map(singularize)
    .filter((w) => w && !NOISE_WORDS.has(w));
  return new Set(words);
}

function keyOf(name) {
  return [...nameKeySet(name)].sort().join(' ');
}

// Same words, different spacing: the docs say "Drop Down", the code says
// `Dropdown`. Comparing the de-spaced form catches those. Word order is
// preserved here (unlike keyOf) — sorting would turn "Drop Down" into
// "downdrop" and never match.
function squashedKey(name) {
  return squashedWords(name).join('');
}

function squashedWords(name) {
  return splitWords(name)
    .map(singularize)
    .filter((w) => w && !NOISE_WORDS.has(w));
}

/**
 * Does `rowKey` match a whole-word prefix of this symbol? Comparing raw string
 * prefixes is not enough — "link" is a string prefix of "linkifyphonenumber"
 * but a different component, so only complete leading words count.
 */
function matchesWordPrefix(rowKey, symbolName) {
  const words = squashedWords(symbolName);
  let prefix = '';
  for (const word of words) {
    prefix += word;
    if (prefix === rowKey) return true;
    if (prefix.length > rowKey.length) return false;
  }
  return false;
}

function stripSuffixes(name) {
  let base = name;
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of KNOWN_SUFFIXES) {
      if (base.length > suffix.length && base.endsWith(suffix)) {
        base = base.slice(0, -suffix.length);
        changed = true;
      }
    }
  }
  return base || name;
}

/**
 * Score for the Android sources, where each variant is its own symbol.
 *
 * A symbol belongs to a row when the row's words are all contained in the
 * symbol's words — "Tag" claims TagPaleWhite/TagBoldError, "Icon button"
 * claims CircleOutlinedIconButtonBig. This avoids having to enumerate every
 * variant word the library uses. More row words matched wins, so
 * ContentHeaderDefault goes to "Content header" rather than "Header".
 */
function subsetScore(rowName, symbolName) {
  const rowWords = nameKeySet(rowName);
  const symbolWords = nameKeySet(symbolName);
  if (rowWords.size === 0 || symbolWords.size === 0) return 0;
  const rowSquashed = squashedKey(rowName);
  const symbolSquashed = squashedKey(symbolName);
  if (rowSquashed === symbolSquashed) return 1000;

  const extra = [...symbolWords].filter((w) => !rowWords.has(w)).length;

  for (const word of rowWords) {
    if (!symbolWords.has(word)) {
      // Fall back to the de-spaced form so "Drop Down" also claims
      // DropdownBig. Scored below a clean word-subset match so a more
      // specific row still wins.
      if (matchesWordPrefix(rowSquashed, symbolName)) {
        return rowWords.size * 100 - 50 - extra;
      }
      return 0;
    }
  }
  return rowWords.size * 100 - extra;
}

/**
 * Score how well a code symbol matches a documented row name.
 * Returns 0 for no match. Higher is better.
 *
 * Exact key equality wins. Otherwise the row's words must all be present in
 * the symbol's vocabulary (symbol name + any variant values it exposes), so
 * "Primary button" matches iOS `DS.Button` whose Style enum includes
 * `primary`, while "Secondary button" matches the same struct via `secondary`.
 */
function matchScore(rowName, symbolName, variantValues = []) {
  const rowWords = nameKeySet(rowName);
  const symbolWords = nameKeySet(symbolName);
  if (rowWords.size === 0 || symbolWords.size === 0) return 0;

  if (keyOf(rowName) === keyOf(symbolName)) return 100;
  if (squashedKey(rowName) === squashedKey(symbolName)) return 100;

  const variantWords = new Set();
  for (const value of variantValues) {
    for (const word of nameKeySet(value)) variantWords.add(word);
  }

  let fromSymbol = 0;
  let fromVariant = 0;
  for (const word of rowWords) {
    if (symbolWords.has(word)) fromSymbol++;
    else if (variantWords.has(word)) fromVariant++;
    else return 0; // every row word must be accounted for somewhere
  }

  // Require at least one word to come from the symbol name itself, so a row
  // doesn't attach to a component purely because of an enum case collision.
  if (fromSymbol === 0) return 0;

  // Prefer tighter symbols. Extra unrelated words are penalised heavily so
  // "Primary button" picks DS.Button (whose Style enum has .primary) over
  // DS.IconButton (which also has a .primary case but is a different thing).
  const extra = [...symbolWords].filter((w) => !rowWords.has(w)).length;
  return 50 + fromSymbol * 5 + fromVariant * 2 - extra * 10;
}

// --- Per-platform extraction ------------------------------------------------

function extractAndroidCommonUi(content, filePath) {
  const results = [];
  const classRe = /^(?:open\s+|abstract\s+|sealed\s+)?class\s+(\w+)/gm;
  let match;
  while ((match = classRe.exec(content)) !== null) {
    results.push({ symbol: match[1], sourcePath: filePath, variants: [] });
  }

  // A paired enum/sealed class in the same file is how this legacy library
  // expresses variants (e.g. TagView + TagViewState).
  if (results.length > 0) {
    const enumRe = /(?:enum\s+class|sealed\s+class)\s+(\w+)\s*\{([\s\S]*?)\n\}/g;
    let enumMatch;
    while ((enumMatch = enumRe.exec(content)) !== null) {
      const values = [...enumMatch[2].matchAll(/^\s*(?:object\s+)?([A-Z][A-Z0-9_]*|[A-Z]\w*)\s*[,;({]?\s*$/gm)]
        .map((m) => m[1])
        .filter(Boolean);
      if (values.length > 0) {
        results[0].variants.push({ group: enumMatch[1], values: values.slice(0, 8) });
      }
    }
  }
  return results;
}

function extractAndroidCompose(content, filePath) {
  const results = [];
  // Capture the annotation block preceding each fun so @Preview functions and
  // private helpers can be excluded — both would otherwise pollute the table.
  const funRe = /((?:^[ \t]*@\w+(?:\([^)]*\))?[ \t]*\r?\n)+)[ \t]*(public\s+|internal\s+|private\s+)?fun\s+(\w+)\s*\(/gm;
  let match;
  while ((match = funRe.exec(content)) !== null) {
    const [, annotations, visibility, name] = match;
    if (!/@Composable/.test(annotations)) continue;
    if (/@Preview/.test(annotations)) continue;
    if (visibility && visibility.trim() !== 'public') continue;
    // Composable property getters and helpers (backgroundColor, tint, ...)
    // are lowercase by convention; components are PascalCase.
    if (!/^[A-Z]/.test(name)) continue;
    results.push({ symbol: name, sourcePath: filePath, variants: [] });
  }
  return results;
}

function extractIos(content, filePath) {
  const results = [];
  // Components are declared as `struct Name: ComponentView` (or `: View`)
  // inside `public extension DS`, so the public API reads as DS.Name.
  const structRe = /struct\s+(\w+)\s*:\s*(?:ComponentView|View)\b/g;
  let match;
  while ((match = structRe.exec(content)) !== null) {
    const name = match[1];
    // SwiftUI preview scaffolding lives beside the real component; it is not
    // part of the public API (the equivalent of @Preview on Android).
    if (/Preview/.test(name)) continue;

    // Variants on iOS are enum cases inside the struct, not separate symbols.
    const variants = [];
    const enumRe = /enum\s+(\w+)\s*:?[^{]*\{([\s\S]*?)\n\s*\}/g;
    let enumMatch;
    while ((enumMatch = enumRe.exec(content)) !== null) {
      if (/Preview/.test(enumMatch[1])) continue;
      const values = [...enumMatch[2].matchAll(/case\s+([a-zA-Z]\w*)/g)].map((m) => m[1]);
      if (values.length > 0) {
        variants.push({ group: enumMatch[1], values: values.slice(0, 8) });
      }
    }
    results.push({ symbol: `DS.${name}`, sourcePath: filePath, variants });
  }
  return results;
}

function extractWebExports(content) {
  const names = [];
  const namedRe = /export\s*\{\s*([^}]+)\}\s*from/g;
  let match;
  while ((match = namedRe.exec(content)) !== null) {
    for (const part of match[1].split(',')) {
      const cleaned = part.trim().split(/\s+as\s+/).pop().trim();
      // Skip type-only re-exports; they're props, not components.
      if (cleaned && /^[A-Z]/.test(cleaned) && !part.includes('type ')) {
        names.push(cleaned);
      }
    }
  }
  return names;
}

function extractWebVariants(typesContent) {
  const variants = [];
  if (!typesContent) return variants;
  // Variant props are string unions: variant?: 'primary' | 'secondary';
  const propRe = /^\s*(\w+)\??:\s*((?:'[^']+'\s*\|\s*)+'[^']+')\s*;/gm;
  let match;
  while ((match = propRe.exec(typesContent)) !== null) {
    const group = match[1];
    if (!/^(variant|size|color|kind|type|appearance|status|severity|tone)$/i.test(group)) {
      continue;
    }
    const values = [...match[2].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    if (values.length > 0) variants.push({ group, values: values.slice(0, 8) });
  }
  return variants;
}

// --- Scanning ---------------------------------------------------------------

/**
 * Collapse overloads of the same symbol into one entry (Kotlin allows several
 * functions with the same name and different signatures), keeping whichever
 * occurrence carried variant information.
 */
function dedupe(symbols) {
  const byName = new Map();
  for (const symbol of symbols) {
    const existing = byName.get(symbol.symbol);
    if (!existing) {
      byName.set(symbol.symbol, symbol);
    } else if (existing.variants.length === 0 && symbol.variants.length > 0) {
      byName.set(symbol.symbol, symbol);
    }
  }
  return [...byName.values()];
}

async function scanKotlin(key, extractor) {
  const source = SOURCES[key];
  const paths = (await listTree(source)).filter(
    (p) => p.endsWith('.kt') && !SUPPORT_FILE_RE.test(p)
  );
  const found = await mapLimit(paths, 8, async (filePath) => {
    const content = await readFile(source, filePath);
    return extractor(content, filePath);
  });
  return dedupe(found.flat());
}

async function scanIos() {
  const source = SOURCES.ios;
  const paths = (await listTree(source)).filter(
    (p) => p.endsWith('.swift') && !SUPPORT_FILE_RE.test(p) && !/\/(Tests?|Mocks?)\//.test(p)
  );
  const found = await mapLimit(paths, 8, async (filePath) => {
    const content = await readFile(source, filePath);
    return extractIos(content, filePath);
  });
  return dedupe(found.flat());
}

async function scanWeb() {
  const source = SOURCES.web;
  const allPaths = await listTree(source);
  const folders = [
    ...new Set(
      allPaths
        .map((p) => p.slice(source.root.length + 1).split('/')[0])
        .filter(Boolean)
    ),
  ];
  const found = await mapLimit(folders, 8, async (folder) => {
    const indexPath = `${source.root}/${folder}/index.ts`;
    if (!allPaths.includes(indexPath)) return [];
    let indexContent;
    try {
      indexContent = await readFile(source, indexPath);
    } catch {
      return [];
    }
    const exports = extractWebExports(indexContent);
    if (exports.length === 0) return [];

    let variants = [];
    const typesPath = `${source.root}/${folder}/types.ts`;
    if (allPaths.includes(typesPath)) {
      try {
        variants = extractWebVariants(await readFile(source, typesPath));
      } catch {
        /* types file is optional context, not fatal */
      }
    }
    // The folder's primary export is the component; extras are subcomponents.
    return exports.map((symbol, i) => ({
      symbol,
      sourcePath: `${source.root}/${folder}/`,
      variants: i === 0 ? variants : [],
    }));
  });
  return dedupe(found.flat());
}

// --- Canonical rows ---------------------------------------------------------

/**
 * Read the documented components out of the gallery data, keeping the
 * category each one belongs to so the page can show a table per category
 * (Assets, Buttons, Form, ...) rather than one long list.
 */
function loadCanonicalRows() {
  const src = fs.readFileSync(GALLERY_DATA, 'utf8');
  const tokenRe =
    /"label":\s*"([^"]+)"|"slug":\s*"([^"]+)",\s*\n\s*"title":\s*"([^"]+)"/g;

  const rows = [];
  let category = 'Other';
  let match;
  while ((match = tokenRe.exec(src)) !== null) {
    if (match[1]) {
      category = match[1];
    } else {
      rows.push({ id: match[2], displayName: match[3], category });
    }
  }
  return rows;
}

function loadOverrides() {
  if (!fs.existsSync(OVERRIDES_FILE)) {
    return { force: {}, ignore: [], extraRows: [] };
  }
  const parsed = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  return {
    force: parsed.force || {},
    ignore: parsed.ignore || [],
    extraRows: parsed.extraRows || [],
  };
}

/**
 * Rows for components that exist in code but have no docs page yet, so they
 * can still be placed in the right category table. Their symbols are listed
 * explicitly (there is no documented name to match against), which is folded
 * into `force` so the normal assignment path claims them.
 */
function applyExtraRows(rows, overrides) {
  const PLATFORM_KEYS = ['androidCommonUi', 'androidCompose', 'ios', 'web'];

  for (const extra of overrides.extraRows) {
    rows.push({
      id: extra.id,
      displayName: extra.displayName,
      category: extra.category,
      undocumented: true,
    });

    const forced = (overrides.force[extra.id] ||= {});
    for (const key of PLATFORM_KEYS) {
      if (extra[key]) forced[key] = [...(forced[key] || []), ...extra[key]];
    }
  }
  return rows;
}

// --- Assembly ---------------------------------------------------------------

/**
 * Attach scanned symbols to documented rows.
 *
 * The two Android sources expose one symbol per variant, so a symbol belongs
 * to exactly one row (exclusive assignment). iOS and Web expose a single
 * symbol parameterised by enums/props, so one symbol legitimately serves
 * several rows — DS.Button covers Primary, Secondary and Tertiary button via
 * its Style enum — and is therefore allowed to be reused (shared assignment).
 *
 * Returns the symbols that matched nothing.
 */
function assign(rows, symbols, platformKey, overrides) {
  const ignore = new Set(overrides.ignore);
  const exclusive = platformKey === 'androidCommonUi' || platformKey === 'androidCompose';
  const claimed = new Set();

  // Explicit overrides win outright.
  for (const row of rows) {
    const forced = overrides.force?.[row.id]?.[platformKey];
    if (!forced) continue;
    for (const symbol of symbols) {
      if (forced.includes(symbol.symbol)) {
        row[platformKey].push(symbol);
        claimed.add(symbol);
      }
    }
  }

  const candidates = symbols.filter((s) => !claimed.has(s) && !ignore.has(s.symbol));

  // Compose exposes one function per variant, so match on the suffix-stripped
  // base name; the full function name is still what gets displayed.
  const matchNameOf = (symbol) =>
    platformKey === 'androidCompose' ? stripSuffixes(symbol.symbol) : symbol.symbol;

  if (exclusive) {
    for (const symbol of candidates) {
      let best = null;
      let bestScore = 0;
      for (const row of rows) {
        const score = subsetScore(row.displayName, symbol.symbol);
        if (score > bestScore) {
          bestScore = score;
          best = row;
        }
      }
      if (best) {
        best[platformKey].push(symbol);
        claimed.add(symbol);
      }
    }
  } else {
    // Shared: for each row take only its single best-scoring symbol, but let
    // that symbol also serve other rows it scores well against.
    for (const row of rows) {
      let best = null;
      let bestScore = MIN_SCORE;
      for (const symbol of candidates) {
        const score = matchScore(
          row.displayName,
          matchNameOf(symbol),
          symbol.variants.flatMap((v) => v.values)
        );
        if (score > bestScore) {
          bestScore = score;
          best = symbol;
        }
      }
      if (best) {
        row[platformKey].push(best);
        claimed.add(best);
      }
    }
  }

  return candidates.filter((s) => !claimed.has(s));
}

function serialize(rows, unmatched, generatedAt) {
  const cell = (entries) =>
    entries.map((e) => ({
      symbol: e.symbol,
      ...(e.variants.length > 0 ? { variants: e.variants } : {}),
    }));

  // Grouped into the same categories the docs sidebar and gallery use, so the
  // page renders one table per category instead of one 42-row list.
  const categories = [];
  for (const row of rows) {
    let group = categories.find((c) => c.label === row.category);
    if (!group) {
      group = { label: row.category, rows: [] };
      categories.push(group);
    }
    group.rows.push({
      id: row.id,
      displayName: row.displayName,
      ...(row.undocumented ? { undocumented: true } : {}),
      androidCommonUi: cell(row.androidCommonUi),
      androidCompose: cell(row.androidCompose),
      ios: cell(row.ios),
      web: cell(row.web),
    });
  }

  return `// Auto-generated by scripts/scan-component-status.js — do not edit by hand.
// Regenerate: GH_SCAN_TOKEN=$(gh auth token) node scripts/scan-component-status.js
// Rows come from the documented component names in ComponentGallery/data.ts;
// symbols are scanned from the Android, iOS and Web source repos.

export type VariantGroup = { group: string; values: string[] };
export type CodeSymbol = { symbol: string; variants?: VariantGroup[] };

export type ComponentStatusRow = {
  id: string;
  displayName: string;
  /** Exists in code but has no docs page yet. */
  undocumented?: boolean;
  androidCommonUi: CodeSymbol[];
  androidCompose: CodeSymbol[];
  ios: CodeSymbol[];
  web: CodeSymbol[];
};

export type ComponentStatusCategory = {
  label: string;
  rows: ComponentStatusRow[];
};

export type UnmatchedSymbol = {
  platform: string;
  symbol: string;
  sourcePath: string;
};

export const componentStatusCategories: ComponentStatusCategory[] = ${JSON.stringify(categories, null, 2)};

/** Flat view of every row, for totals and lookups. */
export const componentStatusRows: ComponentStatusRow[] =
  componentStatusCategories.flatMap((category) => category.rows);

export const unmatchedSymbols: UnmatchedSymbol[] = ${JSON.stringify(unmatched, null, 2)};

export const generatedAt = ${JSON.stringify(generatedAt)};
`;
}

function prBody(rows, unmatched, generatedAt) {
  const counts = ['androidCommonUi', 'androidCompose', 'ios', 'web'].map((key) => {
    const filled = rows.filter((r) => r[key].length > 0).length;
    return `| ${SOURCES[key].label} | ${filled} / ${rows.length} |`;
  });

  let body = `## Component status refresh

Generated ${generatedAt} by \`scripts/scan-component-status.js\`.

| Platform | Rows with code found |
| --- | --- |
${counts.join('\n')}
`;

  if (unmatched.length > 0) {
    const byPlatform = {};
    for (const u of unmatched) {
      (byPlatform[u.platform] ||= []).push(u);
    }
    body += `
### ⚠️ ${unmatched.length} symbol(s) found in code but not matched to a documented component

These are either undocumented components, or a name the matcher couldn't
resolve. Fix a bad match by adding an entry to
\`scripts/component-status-overrides.json\`.

`;
    for (const [platform, items] of Object.entries(byPlatform)) {
      body += `**${platform}** (${items.length})\n\n`;
      for (const item of items.slice(0, 40)) {
        body += `- \`${item.symbol}\` — \`${item.sourcePath}\`\n`;
      }
      if (items.length > 40) body += `- …and ${items.length - 40} more\n`;
      body += '\n';
    }
  }
  return body;
}

// --- Main -------------------------------------------------------------------

async function main() {
  console.log('🔍 Scanning component sources...\n');

  const [commonUi, compose, ios, web] = await Promise.all([
    scanKotlin('androidCommonUi', extractAndroidCommonUi),
    scanKotlin('androidCompose', extractAndroidCompose),
    scanIos(),
    scanWeb(),
  ]);

  const scanned = { androidCommonUi: commonUi, androidCompose: compose, ios, web };
  for (const [key, symbols] of Object.entries(scanned)) {
    console.log(`  ${SOURCES[key].label}: ${symbols.length} symbols`);
  }

  if (DRY_RUN) {
    console.log('\n--- dry run: extracted symbols ---');
    for (const [key, symbols] of Object.entries(scanned)) {
      console.log(`\n### ${SOURCES[key].label}`);
      for (const s of symbols) {
        const base = key === 'androidCompose' ? ` (base: ${stripSuffixes(s.symbol)})` : '';
        const variants = s.variants
          .map((v) => `${v.group}: ${v.values.join('|')}`)
          .join('; ');
        console.log(`  ${s.symbol}${base}${variants ? ` [${variants}]` : ''}`);
      }
    }
    console.log('\n(no files written)');
    return;
  }

  const overrides = loadOverrides();
  const rows = applyExtraRows(loadCanonicalRows(), overrides).map((r) => ({
    ...r,
    androidCommonUi: [],
    androidCompose: [],
    ios: [],
    web: [],
  }));

  const unmatched = [];
  for (const [key, symbols] of Object.entries(scanned)) {
    for (const leftover of assign(rows, symbols, key, overrides)) {
      unmatched.push({
        platform: SOURCES[key].label,
        symbol: leftover.symbol,
        sourcePath: leftover.sourcePath,
      });
    }
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(path.dirname(OUT_DATA), { recursive: true });
  fs.writeFileSync(OUT_DATA, serialize(rows, unmatched, generatedAt));
  fs.writeFileSync(OUT_PR_BODY, prBody(rows, unmatched, generatedAt));

  console.log(`\n✅ Wrote ${path.relative(REPO_ROOT, OUT_DATA)}`);
  console.log(`   ${rows.length} rows, ${unmatched.length} unmatched symbols`);
}

main().catch((error) => {
  console.error('❌ Scan failed:', error.message);
  process.exit(1);
});
