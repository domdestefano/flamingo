# Component Status table

The table on **Components → Component Status** is generated from the real
source code of the four platform libraries, rather than maintained by hand.
It answers three questions per component: does it exist on this platform,
what is it actually called in code, and is it built as separate variants or
as one component with options.

## How it works

```
docs component names ──▶ table rows
                              │
4 sources ──scan──▶ symbols ──match──▶ data.ts ──▶ <ComponentStatusTable />
                              ▲
      component-status-overrides.json
```

- **Rows** come from the component names already documented on this site
  (read out of `website/src/components/ComponentGallery/data.ts`), so the
  table uses the design system's own vocabulary. Adding a docs page for a new
  component automatically adds a row.
- **Symbols** are scanned from four places:

  | Column | Repo | Path |
  | --- | --- | --- |
  | Android – common-ui | `logistics-rider-app-android` (`develop`) | `common-ui/.../widget/` |
  | Android – rrds-compose | `logistics-rider-app-android` (`develop`) | `rrds-compose/.../component/` |
  | iOS | `logistics-rider-app-ios` (`develop`) | `Dependencies/DesignSystem/Sources/Components/` |
  | Web | `rrds-web` (`flamingo`) | `packages/core/src/components/` |

- **Matching** is automatic. A symbol joins a row when the row's words are
  contained in the symbol's words, so *Tag* collects `TagPaleWhite`,
  `TagBoldError` and the rest without anyone listing them.

Previews, private helpers, and support types (`*ViewData`, `*Style`) are
excluded, so the table only shows the public API.

## Reading the table

The two Android libraries and the iOS/Web libraries express variants
differently, and the table shows that difference directly:

- **Several symbols stacked in one cell** — that platform ships each variant
  as its own function. Android rrds-compose does this: *Primary button* is
  four separate composables.
- **One symbol with options underneath** — that platform ships a single
  component parameterised by enums or props. iOS and Web do this: the same
  `DS.Button` covers primary, secondary and tertiary via its `Style` enum.

## Refreshing it

Manual on purpose — there is no schedule. Either:

- **In GitHub** — run the *Scan Component Status* workflow (Actions →
  Run workflow). It opens a PR with the updated table for review.
- **Locally**:

  ```bash
  GH_SCAN_TOKEN=$(gh auth token) node scripts/scan-component-status.js
  ```

Add `--dry-run` to print what the scan finds without writing any files.

## Fixing a wrong or missing entry

Everything the scan couldn't place appears in the **"symbols found in code but
not matched"** section under the table, and in the PR body. Most of those are
components that genuinely have no docs page yet — that list is useful on its
own.

When a symbol *should* belong to a row but the names are too different for
matching to work (`ThrottledButton` is the *Primary button* on the legacy
Android library; iOS calls the *Text Field* `DS.TextInput`), map it in
`scripts/component-status-overrides.json`:

```json
{
  "force": {
    "primary-button": { "androidCommonUi": ["ThrottledButton"] }
  },
  "ignore": ["BadgeStyle"]
}
```

- `force` — attach specific symbols to a row. The key is the row's slug, which
  matches the component's docs folder name.
- `ignore` — drop a symbol entirely. Use for helper classes that aren't
  components and would otherwise clutter the unmatched list.

Re-run the scan afterwards to apply it.

## Caveats

- Matching is heuristic, which is why the output is reviewed in a PR rather
  than committed automatically.
- The scan reads the default working branch of each repo (`develop`, or
  `flamingo` for web), not a release tag — so it reflects what is on those
  branches right now, which may be ahead of what has shipped.
- New variant naming in rrds-compose may need a word adding to
  `KNOWN_SUFFIXES` at the top of the script.
