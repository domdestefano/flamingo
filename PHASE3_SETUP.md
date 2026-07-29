# Phase 3: Automated Documentation & Token Sync

Flamingo Phase 3 automates the generation of component documentation, design token syncing, and image exports from Figma.

## Architecture

Three GitHub Actions work together:

### 1. Sync Tokens (`.github/workflows/sync-tokens.yml`)
- **Trigger:** Every Monday at 9am, or manual `workflow_dispatch`
- **Source:** Figma Tokens file (SS96QDVedbpCNWbkju1UbI)
- **Output:** `website/tokens/global.json`, `website/tokens/theme.json`
- **Result:** Creates PR with token updates (for review before merge)

### 2. Export Component Images (`.github/workflows/export-component-images.yml`)
- **Trigger:** Every Monday at 10am, or manual with component input
- **Source:** Figma Component Specs file (VuBl4ugiWKRiGROf3zglzb)
- **Output:** `website/static/img/components/{component}/`
- **Currently:** Button only (testing phase)
- **Result:** Creates PR with updated images

### 3. Generate Component Docs (`.github/workflows/generate-component-docs.yml`)
- **Trigger:** Manual via `workflow_dispatch` or PR labeled `docs-gen`
- **Input:** Component name (e.g., `button`, `badge`)
- **Source:** Figma Spec + Code repo + Storybook
- **Output:** `website/docs/components/{component}.mdx`
- **Process:** Uses agent prompt to intelligently generate docs
- **Result:** Auto-commits .mdx file with approval

---

## Setup Requirements

### 1. Add GitHub Secret: FIGMA_TOKEN

Go to **GitHub Repo Settings → Secrets and variables → Actions** and add:

- **Name:** `FIGMA_TOKEN`
- **Value:** (the token you provided)

This allows the workflows to authenticate with Figma API.

### 2. Verify Token Files Exist

Ensure you have Figma access to:
- **Tokens file:** `SS96QDVedbpCNWbkju1UbI` (core library)
- **Spec file:** `VuBl4ugiWKRiGROf3zglzb` (component specs)

---

## Usage

### Sync Tokens (Manual)

```bash
# Trigger via GitHub Actions UI
# Go to Actions → "Sync Design Tokens from Figma" → Run workflow
```

Or wait for Monday 9am (automatic).

This will:
1. Fetch token definitions from Figma
2. Transform to JSON matching logistics DS structure
3. Create PR for review
4. Merge to update `website/tokens/`

### Export Component Images (Manual)

```bash
# Via GitHub Actions UI
# Go to Actions → "Export Component Images from Figma"
# Run workflow → Enter component name (e.g., "button")
```

Or wait for Monday 10am (automatic, button only).

### Generate Component Docs (Manual)

```bash
# Via workflow_dispatch
gh workflow run generate-component-docs.yml \
  -f component=button
```

Or:
1. Create a PR
2. Add label `docs-gen` to trigger on push
3. Workflow generates .mdx and commits

---

## Implementation Status

| Workflow | Status | Notes |
| --- | --- | --- |
| **sync-tokens.yml** | 🟡 Framework ready | Token parsing from Figma needs `script/sync-tokens-from-figma.js` implementation |
| **export-component-images.yml** | 🟡 Framework ready | Image export needs Figma frame ID mapping |
| **generate-component-docs.yml** | 🟡 Framework ready | Needs agent integration (Claude API calls) |

Each workflow has a placeholder `.js` script in `scripts/` directory that needs full implementation.

---

## Next Steps

### Immediate (Testing Phase)
1. Add `FIGMA_TOKEN` secret to GitHub
2. Test token sync workflow manually
3. Verify JSON output in `website/tokens/`
4. Test image export for button component
5. Test doc generation agent integration

### Future
- [ ] Full Figma variable parsing (currently placeholder)
- [ ] Image export for all components
- [ ] Agent integration for doc generation
- [ ] Multi-platform variants (iOS, Android)
- [ ] Design token CSS variable generation
- [ ] Automatic spec frame discovery

---

## Files Structure

```
flamingo/
├── .github/workflows/
│   ├── sync-tokens.yml                    # Token sync workflow
│   ├── export-component-images.yml        # Image export workflow
│   └── generate-component-docs.yml        # Doc generation workflow
├── scripts/
│   ├── sync-tokens-from-figma.js          # Token fetch & transform
│   ├── export-component-images.js         # Image export implementation
│   └── generate-component-docs.js         # Doc generation implementation
├── website/
│   ├── tokens/                            # Output: global.json, theme.json
│   ├── static/img/components/             # Output: component images
│   └── docs/components/                   # Output: .mdx files
└── PHASE3_SETUP.md                        # This file
```

---

## Troubleshooting

### Workflow fails with "FIGMA_TOKEN not found"
- Ensure secret is added to GitHub repo settings
- Secret name must be exactly `FIGMA_TOKEN`
- Workflows must use `secrets.FIGMA_TOKEN`

### Token sync creates empty JSON
- Figma variables API might need different parsing
- Check Figma file structure (is data in variables or component props?)
- Verify file key is correct: `SS96QDVedbpCNWbkju1UbI`

### Image export doesn't find components
- Figma frame IDs must be mapped in script
- Component specs file structure needs to be parsed
- File key might be incorrect: `VuBl4ugiWKRiGROf3zglzb`

---

## Questions?

Refer to:
- `website/scripts/agent-generate-component-mdx.md` — Agent prompt for doc generation
- `website/scripts/generate-component-mdx-template.md` — Documentation template
- GitHub Actions logs for each workflow run
