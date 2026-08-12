import type {ReactNode} from 'react';

// Ejected from @docusaurus/theme-classic and reduced to a no-op — the page
// footer's own "Last updated on ..." line would otherwise duplicate the
// LastUpdatedBadge shown next to the title (ComponentDocs/shared.tsx).
export default function LastUpdated(): ReactNode {
  return null;
}
