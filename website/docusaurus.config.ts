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

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/', // serve docs at the site root (no /docs prefix)
          sidebarPath: './sidebars.ts',
          // Points the "Edit this page" link at the repo. Update the branch/path
          // once you know where this site sits inside the repo.
          editUrl:
            'https://github.com/deliveryhero/flamingo/tree/main/website/',
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
      title: 'Flamingo',
      logo: {
        alt: 'Flamingo Design System',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'componentsSidebar',
          position: 'left',
          label: 'Components',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidelinesSidebar',
          position: 'left',
          label: 'Guidelines',
        },
        {
          href: 'https://github.com/deliveryhero/flamingo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Design System',
          items: [
            { label: 'Components', to: '/components/button' },
            { label: 'Guidelines', to: '/guidelines/getting-started' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Delivery Hero SE — Flamingo Design System.`,
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
