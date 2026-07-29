# Design Token Sync (Figma → JSON)

Flamingo's design tokens are exported from Figma Variables and transformed into
JSON files consumed by the docs site (and eventually by the design system
code repo).

## Why this isn't a live API sync

Figma's **Variables REST API** (`file_variables:read` scope) requires an
**Enterprise Figma plan**. This org's Figma seat doesn't have that access, so
we can't pull variables automatically from the API.

Instead, we use Figma's built-in **"Export variables"** feature, which any
editor can run manually from the Variables panel. It produces the exact same
underlying data (resolved colour values, all modes) as JSON files.

## Step 1: Export from Figma

1. Open the [Tokens file](https://www.figma.com/design/SS96QDVedbpCNWbkju1UbI/-Core-library--Tokens)
2. Open the **Variables** panel
3. For the **"Flamingo theme"** collection: click **"..." → Export variables**
   → this produces one `.json` file per brand mode (Foodora, Glovo, Talabat, etc.)
4. For the **"Dark mode"** collection: same steps → produces `Off.tokens.json`
   (light) and `On.tokens.json` (dark)
5. You'll get a `.zip` per collection — unzip both

## Step 2: Drop files into the repo

Place the unzipped files here, matching this exact structure:

```
tokens-source/
├── flamingo-theme/
│   ├── Foodora.tokens.json
│   ├── Glovo.tokens.json
│   ├── Talabat.tokens.json
│   └── ... (one per brand)
└── dark-mode/
    ├── Off.tokens.json
    └── On.tokens.json
```

## Step 3: Run the transform

```bash
node scripts/transform-figma-tokens.js
```

This generates:
- `website/tokens/global.json` — spacing, sizing, typography, radius, border,
  opacity, blur (identical across light/dark, sourced from `dark-mode/Off.tokens.json`)
- `website/tokens/theme.json` — colours, per brand, per light/dark mode

## Step 4: Commit and open a PR

```bash
git add tokens-source/ website/tokens/
git commit -m "chore(tokens): update from Figma export"
git push
```

Open a PR so the design system team can review the diff before merging.

## Automated validation

The GitHub Action `.github/workflows/sync-tokens.yml` runs the transform
automatically whenever `tokens-source/**` changes on a PR or push to `main`,
regenerating `website/tokens/*.json` and committing it if anything changed.
This catches manual mistakes (e.g. forgetting to re-run the script locally)
but does **not** talk to the Figma API — someone still has to do the manual
export in Step 1.

## Token structure reference

**`global.json`:**
```json
{
  "spacing": { "spacing01": 4, "spacing02": 8, ... },
  "opacity": { "opacity00": 0, "opacity01": 4, ... },
  "corner-radius": { "corner-radius01": 8, ... },
  "border-thickness": { "border01": 1, ... },
  "font-size": { "font-size01": 12, ... },
  "line-height": { "line-height01": 16, ... },
  "letter-spacing": { "letter-space01": -0.3, ... },
  "paragraph-spacing": { "paragraph-space01": 4, ... },
  "list-spacing": { "list-space01": 4, ... },
  "blur": { "blur00": 2, ... }
}
```

**`theme.json`:**
```json
{
  "foodora": {
    "name": "Foodora",
    "light": { "primary-main": "#D70F64", ... },
    "dark": { "primary-main": "#FF3D8A", ... },
    "illustration": { "illustration90": "#4B1F00", ... }
  },
  "glovo": { ... },
  ...
}
```

## Future: automating Step 1

If the org upgrades to Figma Enterprise, or a plugin becomes available that
can push variable exports via webhook, Step 1 can be automated and this
workflow can be simplified to fetch directly from Figma. Until then, the
manual export takes under a minute and only needs to happen when tokens
actually change.
