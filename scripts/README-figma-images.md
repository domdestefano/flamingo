# Figma Image Sync

Every screenshot/diagram pulled from Figma into this site (corner radius use
cases, typography examples, component anatomy diagrams, etc.) is tracked in
`scripts/figma-images.json` and kept up to date automatically.

## How the automation works

- **`scripts/figma-images.json`** — the source of truth. Each entry maps one
  Figma frame (`fileKey` + `nodeId`) to one local file path.
- **`scripts/sync-figma-images.js`** — reads that mapping and calls Figma's
  standard image-rendering API (`GET /v1/images/:file_key`) to re-download
  each frame as a PNG. This is the regular file API, not the Variables API,
  so — unlike design tokens — it works without an Enterprise Figma plan and
  needs no manual export step.
- **`.github/workflows/sync-figma-images.yml`** — runs the script:
  - **Daily**, automatically, so screenshots never drift far from Figma.
  - **Immediately**, whenever `scripts/figma-images.json` changes on `main`
    (see below).
  - **On demand**, via "Run workflow" in the Actions tab.

  If the re-rendered image differs from what's committed, it opens a PR so
  a human reviews the visual diff before it goes live — nothing publishes
  silently.

## Adding a new screen

1. In Figma, select the exact frame you want (usually the coloured
   Do/Don't-bordered box, not its surrounding label — see the note below).
2. Get its `fileKey` (from the Figma URL) and `nodeId` (right-click the
   layer → Copy link, or ask Claude to look it up given the file and a
   description of what you want).
3. Add an entry to `scripts/figma-images.json`:
   ```json
   {
     "fileKey": "VuBl4ugiWKRiGROf3zglzb",
     "nodeId": "1234:5678",
     "output": "website/static/img/components/secondary-button/secondary-button-anatomy.png",
     "description": "Secondary button anatomy"
   }
   ```
4. Commit and push to `main`. The workflow triggers immediately (via the
   `paths` filter on this file) and opens a PR with the downloaded image —
   merge it once you've checked it looks right.
5. Reference the image in the relevant `.mdx` page:
   ```mdx
   import ComponentImage from '@site/src/components/ComponentDocs/ComponentImage';

   <ComponentImage src="/img/components/secondary-button/secondary-button-anatomy.png" alt="..." />
   ```

From then on, that frame is included in the daily sync automatically — if
someone edits it in Figma, the change shows up here (via PR) within a day
without anyone needing to touch this repo.

**Caveat:** the mapping is keyed by node ID, not by name. If a frame gets
deleted and recreated in Figma (rather than edited in place), it gets a new
node ID and the entry above needs a manual update.

## Adding a new rule (guideline text)

Rule text is **not** auto-synced, on purpose. Unlike images, guideline
prose usually needs editorial judgement — rephrasing awkward source
wording, cross-referencing our actual token names, deciding what's worth
including — the same treatment already applied to every page in
`docs/components/**` and `docs/tokens/**`. Blindly re-scraping Figma text
layers would undo that each time it ran.

Instead, when a rule changes or is added in Figma:

1. Point Claude (or whoever's updating the docs) at the specific Figma
   frame/section.
2. It gets read, adapted into our own words, and added to the relevant
   `.mdx` file directly — the same process used to build every guideline
   page so far.

This keeps rule text deliberate and reviewed, while screenshots stay
mechanically fresh without anyone remembering to re-export them.

`.github/workflows/agentic-doc-sync.yml` (see `PHASE3_SETUP.md`) respects
this too: its nightly/PR-merge run only *drafts* suggested prose changes
into `DOC_SYNC_SUGGESTIONS.md` for human review — it never edits guideline
text in place. It does directly fix things that don't need editorial
judgement (anatomy order, properties tables, stale screenshots), the same
category of change this file already automates for images.
