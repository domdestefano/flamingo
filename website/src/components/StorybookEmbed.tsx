import React, { useEffect, useState } from 'react';
import BrandSwitcher from '@site/src/components/BrandSwitcher';

// Reusable iframe wrapper for embedding a live Storybook story inside an MDX
// page. Point `baseUrl` at your deployed Storybook, pass the story `id`
// (the slug in the Storybook URL, e.g. "components-button--primary"), and
// it renders the running component in isolation.
//
// Usage in an .mdx file:
//   import StorybookEmbed from '@site/src/components/StorybookEmbed';
//   <StorybookEmbed storyId="components-button--primary" height={240} />
//
// Brand awareness: the site's BrandSwitcher sets `data-brand` on <html> (and
// Docusaurus itself sets `data-theme` for light/dark). rrds-web's Storybook
// exposes the same two concepts as globals (`themeName`, `themeMode`), so we
// read both attributes and pass them through the iframe URL — switching
// brand on the docs site re-renders this embed in that brand's real colors,
// not just a screenshot.

type StorybookEmbedProps = {
  /** The story ID from the Storybook URL (?path=/story/<id> or ?id=<id>). */
  storyId: string;
  /** Iframe height in px. Default 320. */
  height?: number;
  /** Override the deployed Storybook base URL if it differs per environment. */
  baseUrl?: string;
  /**
   * 'story' embeds a single isolated story. 'docs' embeds the component's
   * full autodocs page (all variants/states in one render) — use this when
   * the component doesn't have separate per-variant story IDs, e.g.
   * "components-buttons-button--docs".
   */
  viewMode?: 'story' | 'docs';
};

const DEFAULT_STORYBOOK_URL =
  'https://deliveryhero.github.io/rrds-web';

// Maps the docs site's brand slugs (website/tokens/theme.json) to rrds-web's
// Storybook `themeName` global. Most match 1:1; a few don't:
// - baemin is a Woowa Brothers brand — rrds-web calls the theme "woowa".
// - hunger-station drops the hyphen in rrds-web ("hungerstation").
// - roadrunner has no corresponding Storybook theme yet, so it falls back
//   to Storybook's own "default" rather than silently rendering the wrong
//   brand's colors.
const BRAND_TO_STORYBOOK_THEME: Record<string, string> = {
  baemin: 'woowa',
  efood: 'efood',
  foodora: 'foodora',
  foodpanda: 'foodpanda',
  foody: 'foody',
  glovo: 'glovo',
  'hunger-station': 'hungerstation',
  pedidosya: 'pedidosya',
  roadrunner: 'default',
  talabat: 'talabat',
  yemeksepeti: 'yemeksepeti',
};

/**
 * Reads the current brand + light/dark mode from <html>'s data-brand /
 * data-theme attributes, re-reading whenever either changes. Both are plain
 * attributes (set by BrandSwitcher and Docusaurus respectively), so a
 * MutationObserver is enough — no context/store needed. Mirrors
 * DesignTokens/shared.tsx's useResolvedToken.
 */
function useBrandAndMode(): { themeName: string; themeMode: 'light' | 'dark' } {
  const [state, setState] = useState<{ themeName: string; themeMode: 'light' | 'dark' }>({
    themeName: BRAND_TO_STORYBOOK_THEME.foodora,
    themeMode: 'light',
  });

  useEffect(() => {
    const read = () => {
      const brand = document.documentElement.getAttribute('data-brand') || 'foodora';
      const mode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setState({
        themeName: BRAND_TO_STORYBOOK_THEME[brand] ?? 'default',
        themeMode: mode,
      });
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-brand', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return state;
}

export default function StorybookEmbed({
  storyId,
  height = 320,
  baseUrl = DEFAULT_STORYBOOK_URL,
  viewMode = 'story',
}: StorybookEmbedProps): React.ReactElement {
  const { themeName, themeMode } = useBrandAndMode();

  // `iframe.html` renders a single story with no Storybook chrome around it.
  // `globals` sets the same themeName/themeMode toolbar globals a user would
  // otherwise pick by hand inside Storybook.
  const src = `${baseUrl}/iframe.html?id=${encodeURIComponent(
    storyId,
  )}&viewMode=${viewMode}&globals=themeName:${themeName};themeMode:${themeMode}`;

  return (
    <div
      style={{
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 8,
        overflow: 'hidden',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0.5rem',
          borderBottom: '1px solid var(--ifm-color-emphasis-300)',
          background: 'var(--ifm-background-surface-color)',
        }}
      >
        <BrandSwitcher />
      </div>
      <iframe
        src={src}
        title={`Storybook story: ${storyId}`}
        loading="lazy"
        style={{ width: '100%', height, border: 0, display: 'block' }}
      />
    </div>
  );
}
