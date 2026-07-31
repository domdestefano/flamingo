# Agentic doc sync — instructions

You are running unattended in CI. There is no human to ask clarifying questions —
if something is ambiguous, skip that item rather than guessing, and note it in
your final summary.

## Goal

Check every documented component's `.mdx` pages against its Figma spec frame,
and fix anything that has drifted. This is the automated counterpart to the
`/flamingo-sync-component` command in the `rider-design` repo — same rules,
looped over every existing component instead of one human-supplied link.

## Scope: what you may edit directly vs. what you may only draft

This repo has a deliberate rule (see `scripts/README-figma-images.md`):
screenshots are mechanical, but guideline **prose** needs editorial judgement
and must not be blindly re-scraped from Figma text layers.

- **Edit directly** (verifiable, structural, no editorial judgement involved):
  - Anatomy numbered lists — cross-check every badge against its Figma
    `componentId`/`componentProperties` and x/y position, never against a
    similar component's list. Fix ordering/count only if it's factually wrong.
  - Properties tables (name/type/default columns).
  - Which screenshot is referenced and whether it's stale — register any
    new/changed frame in `scripts/figma-images.json` (node IDs in colon form,
    e.g. `12:34`, never hyphen or URL-encoded) and run
    `node scripts/sync-figma-images.js` to fetch it.
  - Adding a missing structural section (e.g. a Do/Don't pair or Caution block
    that exists in Figma but has no page section at all) using the existing
    `<DoDontTable>` / `<CautionTable>` / `<ChangelogTable>` components — never
    invent your own markup.
- **Never edit directly — draft only**: any guideline/usage prose, Placement
  sections, Do/Don't or Caution `text` props, anything that's rephrased rather
  than copied. If Figma's source text has changed in a way that seems to
  warrant an update, do **not** touch the `.mdx` file. Instead add a clearly
  marked entry to `DOC_SYNC_SUGGESTIONS.md` (create it at the repo root if it
  doesn't exist) with: file path, current text, the new Figma source text, and
  why you think it changed. This file's contents become part of the PR body —
  never delete or edit existing entries left by a prior run, only append.
- **Never fabricate**: the "Content" and "Change log" pages have no Figma
  source. Do not invent copy for them. A `<ChangelogTable>` with only a
  placeholder row is fine and expected if there's nothing to log.
- Always branch + PR — this step never pushes directly to `main`. (You don't
  need to do this yourself; leave your edits in the working tree uncommitted.
  The workflow that invoked you handles committing, branching, and opening
  the PR based on what you've changed on disk.)

## Steps

1. Enumerate every `website/docs/components/**/overview.mdx`. Read each one's
   frontmatter for `figma_node` and `category`.
2. For each component, fetch its Figma frame via the `figma` MCP server
   (`mcp__figma__get_figma_data`), the same file key(s) already referenced in
   `scripts/figma-images.json` for that component.
3. Compare against the current Overview/Guidelines/Content/Change log/Code-Web
   `.mdx` files for that component. Apply the direct-edit vs. draft-only rules
   above.
4. If you added or changed any screenshot registrations, run
   `node scripts/sync-figma-images.js` (uses `FIGMA_TOKEN` from the
   environment) so the new images are actually present on disk.
5. Run `cd website && npm run build` to confirm nothing you changed breaks the
   site build. If it fails, revert just the change that broke it and note why
   in your summary — never leave a broken build in the working tree.
6. Finish by printing a short plain-text summary: which components you
   checked, what you changed directly, and how many draft suggestions you
   left in `DOC_SYNC_SUGGESTIONS.md` (if any). The workflow uses `git diff` to
   detect changes — it does not parse your summary, so this is for the PR
   description/logs only.
