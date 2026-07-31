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

### 2. Component/token reference images — fully automated

- **Source of truth:** `scripts/figma-images.json` — maps a Figma frame
  (fileKey + nodeId) to a local image path.
- **Sync:** `scripts/sync-figma-images.js`, run by
  `.github/workflows/sync-figma-images.yml`:
  - Daily, automatically.
  - Immediately, when `scripts/figma-images.json` changes on `main`.
  - On demand, via "Run workflow" in the Actions tab.
- Opens a PR only when a registered frame's rendered output actually
  changed — review the visual diff, then merge.
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

## Phase 4: Agentic doc sync — fully automated drift check

`.github/workflows/agentic-doc-sync.yml` runs headless Claude Code nightly
(04:40 UTC, ahead of the image sync), on every PR merged into `main`, and
on demand. It re-checks **every** documented component against its Figma
spec frame — the automated counterpart to the `/flamingo-sync-component`
command in the `rider-design` repo, looped over the whole site instead of
one component at a time.

- **Directly edits**: verifiable/structural drift only — anatomy list
  order (cross-checked against Figma badge positions, never guessed),
  properties tables, stale/missing screenshots (registers them into
  `scripts/figma-images.json` and re-runs `sync-figma-images.js`), missing
  Do/Don't or Caution sections.
- **Never directly edits guideline prose** — instead drafts suggested text
  changes into `DOC_SYNC_SUGGESTIONS.md` at the repo root, included in the
  PR body for a human to review and apply.
- **Never fabricates** the Content or Change log pages, which have no
  Figma source.
- Opens a PR only if something actually changed (same `git diff` gate as
  the image sync) — never pushes to `main` directly. Review the PR like any
  other; there's no separate chat notification, so keep an eye on the repo's
  PR list (or watch the repo/subscribe to the Actions workflow) to notice
  when it runs.
- Full prompt: [`.github/scripts/doc-sync-prompt.md`](.github/scripts/doc-sync-prompt.md).

### Additional setup requirements for Phase 4

- **GitHub secret `ANTHROPIC_API_KEY`** — used to run Claude Code headlessly
  in CI. (The DH internal LiteLLM gateway used by some Figma plugins here
  isn't reachable from a hosted Actions runner — it's a localhost-only
  tunnel — so this workflow authenticates directly against the Anthropic
  API instead.)

---

## Setup requirements

- **GitHub secret `FIGMA_TOKEN`** — a Figma personal access token with
  `File content: Read` scope. Already configured in this repo's Actions
  secrets.
- **Workflow permissions** — Settings → Actions → General → Workflow
  permissions must allow "Read and write" + "Allow GitHub Actions to create
  and approve pull requests", since all three sync workflows open PRs.

---

## Files

```
flamingo/
├── .mcp.json                       # Figma MCP server config for the Phase 4 agent
├── .github/
│   ├── workflows/
│   │   ├── sync-tokens.yml            # Regenerates website/tokens/*.json + tokens.css
│   │   ├── sync-figma-images.yml      # Daily + on-change image sync
│   │   ├── agentic-doc-sync.yml       # Phase 4 — nightly/PR-merge content drift check
│   │   └── deploy.yml                 # Site build & deploy
│   └── scripts/
│       └── doc-sync-prompt.md         # Instructions given to the Phase 4 agent
├── scripts/
│   ├── transform-figma-tokens.js  # tokens-source/** -> website/tokens/*.json
│   ├── generate-token-css.js      # website/tokens/*.json -> tokens.css
│   ├── sync-figma-images.js       # figma-images.json -> static/img/**
│   ├── figma-images.json          # image registry (see README-figma-images.md)
│   ├── README-tokens.md
│   └── README-figma-images.md
└── website/
    ├── tokens/                    # global.json, semantic.json, theme.json
    ├── static/img/                # synced screenshots/diagrams
    └── docs/{tokens,components}/  # pages consuming the above
```
