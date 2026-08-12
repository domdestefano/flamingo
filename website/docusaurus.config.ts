import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// ---------------------------------------------------------------------------
// Flamingo Design System — Docusaurus configuration
//
// Update the four values marked TODO to match wherever this repo lives.
// If you deploy at https://<org>.github.io/<repo>/ then:
//   url     = 'https://<org>.github.io'
//   baseUrl = '/<repo>/'
// If you later use a custom domain, set url to that domain and baseUrl to '/'.
// ---------------------------------------------------------------------------

const config: Config = {
  title: 'Flamingo',
  tagline: 'Delivery Hero rider-app design system',
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // opt in to Docusaurus v4 compatibility behaviours early
  },

  url: 'https://deliveryhero.github.io',
  baseUrl: '/flamingo/',

  organizationName: 'deliveryhero',
  projectName: 'flamingo',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    // Flamingo's typeface is Noto Sans (see Tokens > Typography). Loaded
    // site-wide so every page — not just the type-scale samples — renders
    // in the real brand font instead of Docusaurus's default.
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,700;0,800;0,900&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // serve docs at the site root (no /docs prefix)
          sidebarPath: './sidebars.ts',
          // No editUrl: content changes go through the Claude interface, not
          // GitHub's inline editor — omitting this removes the "Edit this
          // page" link sitewide.
             exclude: ['**/admin/**'],
          breadcrumbs: false,
          // Powers the header's LastUpdatedBadge (ComponentDocs/shared.tsx)
          // via each file's git history, replacing the old hand-set
          // StatusBadge. The default theme's own EditMetaRow would also
          // start showing this in the page footer once enabled — that's
          // suppressed by ejecting theme/LastUpdated to return null.
          showLastUpdateTime: true,
          // Collapses every "tab group" folder — a component's Overview/
          // Guidelines/Content/Change log/Code-Web docs, or a Getting
          // Started process's docs (Contribution, Asset creation and
          // implementation, Flamingo support) — down to a single visible
          // sidebar link, landing on the first tab (already sorted by
          // sidebar_position by defaultSidebarItemsGenerator, so item[0] is
          // always the right one regardless of what it's named). The rest
          // of the tabs stay reachable via the inline <ComponentTabs> bar
          // on the page itself.
          //
          // Rather than dropping the other docs from the sidebar tree
          // entirely (which was tried first and broke navigation — once a
          // doc isn't present anywhere in a sidebar, Docusaurus can't tell
          // which sidebar it belongs to, so visiting e.g. a Guidelines page
          // rendered with no sidebar at all), this keeps a real category
          // with all the original docs as `items` — every one of them
          // still resolves to this sidebar — and only *visually* hides the
          // children via the `flamingo-tabGroupCategory` class (see
          // theme-refresh.css). `collapsible: false` also drops the caret/
          // sublist styling, so it reads as a single plain link either way.
          //
          // Only fires for category nodes whose children are ALL docs
          // (no nested subcategories) — so Assets itself (whose children
          // are Icons/Graphic blocks/Animations, categories, not docs)
          // still expands normally — and skips the two folders that
          // legitimately are separate standalone pages rather than tabs of
          // one page: components/about (All components / Component status
          // / Component gallery apps) and every docs/tokens/** subfolder.
          sidebarItemsGenerator: async ({ defaultSidebarItemsGenerator, ...args }) => {
            const items = await defaultSidebarItemsGenerator(args);
            const EXCLUDED_ID_PREFIXES = ['components/about/', 'tokens/'];
            function collapse(items: typeof items): typeof items {
              return items.map((item) => {
                if (item.type !== 'category') return item;
                const allDocs = item.items.every((c) => c.type === 'doc');
                const isExcluded = item.items.some(
                  (c) =>
                    c.type === 'doc' &&
                    EXCLUDED_ID_PREFIXES.some((prefix) => c.id.startsWith(prefix)),
                );
                const [entryDoc] = item.items;
                if (allDocs && entryDoc?.type === 'doc' && !isExcluded) {
                  return {
                    ...item,
                    link: { type: 'doc' as const, id: entryDoc.id },
                    collapsible: false,
                    className: 'flamingo-tabGroupCategory',
                  };
                }
                return { ...item, items: collapse(item.items) };
              });
            }
            return collapse(items);
          },
        },
        blog: false, // a design system doesn't need the blog preset
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/flamingo-social-card.jpg',
    navbar: {
      logo: {
        alt: 'Flamingo Design System',
        src: 'img/flamingo-logo.png',
        height: 56,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gettingStartedSidebar',
          position: 'left',
          label: 'About',
        },
        {
          type: 'docSidebar',
          sidebarId: 'componentsSidebar',
          position: 'left',
          label: 'Components',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tokensSidebar',
          position: 'left',
          label: 'Tokens',
        },
        {
          href: 'https://deliveryhero.atlassian.net/servicedesk/customer/portal/899',
          label: 'Make a request',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      // Adds syntax highlighting for the languages a rider-app DS is likely to use.
      additionalLanguages: ['bash', 'json', 'tsx', 'kotlin', 'swift'],
    },
    colorMode: {
      respectPrefersColorScheme: true, // honour the reader's OS light/dark setting
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
