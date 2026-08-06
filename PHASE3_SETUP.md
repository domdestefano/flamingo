# Phase 3: Automated Design Token & Image Sync

Flamingo Phase 3 keeps design tokens and reference screenshots in sync with
Figma, without needing an Enterprise Figma plan.

## Why two different sync strategies

Figma's **Variables API** (used for colours, spacing, typography scale
values) requires an Enterprise plan, which this org's Figma seat doesn't
have. Its **file/image API** (used for screenshots and diagrams) has no such
restriction. That split is why tokens and images are synced differently:

### 1. Design tokens — semi-automated (manual export + automated transform)

- **Source of truth:** `tokens-source/**` — raw JSON exported from Figma's
  Variables panel ("Export variables"), which any editor can do manually in
  under a minute.
- **Transform:** `scripts/transform-figma-tokens.js` and
  `scripts/generate-token-css.js`, run automatically by
  `.github/workflows/sync-tokens.yml` whenever `tokens-source/**` changes.
- **Output:** `website/tokens/*.json`, `website/src/css/tokens.css`.
- Full instructions: [`scripts/README-tokens.md`](scripts/README-tokens.md).

### 2. Component/token reference images — on-demand

- **Source of truth:** `scripts/figma-images.json` — maps a Figma frame
  (fileKey + nodeId) to a local image path.
- **Sync:** `scripts/sync-figma-images.js`, run manually (`node
  scripts/sync-figma-images.js`) whenever screenshots need refreshing.
  Previously ran on a daily cron via `.github/workflows/sync-figma-images.yml`,
  removed to stop unattended daily GitHub Actions runs — re-add that
  workflow if automatic syncing is wanted again.
- Full instructions, including how to register a new screen:
  [`scripts/README-figma-images.md`](scripts/README-figma-images.md).

### 3. Guideline text — intentionally manual (drafted, not auto-applied)

Rule/guideline prose (Do's & Don'ts, usage guidance) is not auto-synced.
Screenshots are mechanical; text needs editorial judgement (rephrasing,
cross-referencing our actual token names). When Figma guideline text
changes, someone (or Claude, pointed at the relevant Figma frame) updates
the corresponding `.mdx` file directly — see the "Adding a new rule" section
in `scripts/README-figma-images.md`. The Phase 4 agent below respects this
too: it only *drafts* prose suggestions for review, never edits them in place.

---

## Phase 4: Agentic doc sync — removed

`.github/workflows/agentic-doc-sync.yml` used to run headless Claude Code
nightly (04:40 UTC) plus on every PR merge into `main`, re-checking every
documented component against its Figma spec frame. It's been removed to stop
unattended nightly GitHub Actions/Anthropic API usage — use the
`/flamingo-sync-component` command in the `rider-design` repo to re-check a
component on demand instead, one at a time.

---

## Setup requirements

- **GitHub secret `FIGMA_TOKEN`** — a Figma personal access token with
  `File content: Read` scope. Already configured in this repo's Actions
  secrets.
- **Workflow permissions** — Settings → Actions → General → Workflow
  permissions must allow "Read and write" + "Allow GitHub Actions to create
  and approve pull requests", since the token-sync workflow opens PRs.

---

## Files

```
flamingo/
├── .mcp.json                       # Figma MCP server config for on-demand doc sync
├── .github/
│   └── workflows/
│       ├── sync-tokens.yml            # Regenerates website/tokens/*.json + tokens.css
│       └── deploy.yml                 # Site build & deploy
├── scripts/
│   ├── transform-figma-tokens.js  # tokens-source/** -> website/tokens/*.json
│   ├── generate-token-css.js      # website/tokens/*.json -> tokens.css
│   ├── sync-figma-images.js       # figma-images.json -> static/img/** (run manually)
│   ├── figma-images.json          # image registry (see README-figma-images.md)
│   ├── README-tokens.md
│   └── README-figma-images.md
└── website/
    ├── tokens/                    # global.json, semantic.json, theme.json
    ├── static/img/                # synced screenshots/diagrams
    └── docs/{tokens,components}/  # pages consuming the above
```
