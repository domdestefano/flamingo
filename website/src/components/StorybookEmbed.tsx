import React from 'react';

// Reusable iframe wrapper for embedding a live Storybook story inside an MDX
// page. Point `baseUrl` at your deployed Storybook, pass the story `id`
// (the slug in the Storybook URL, e.g. "components-button--primary"), and
// it renders the running component in isolation.
//
// Usage in an .mdx file:
//   import StorybookEmbed from '@site/src/components/StorybookEmbed';
//   <StorybookEmbed storyId="components-button--primary" height={240} />

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

export default function StorybookEmbed({
  storyId,
  height = 320,
  baseUrl = DEFAULT_STORYBOOK_URL,
  viewMode = 'story',
}: StorybookEmbedProps): React.ReactElement {
  // `iframe.html` renders a single story with no Storybook chrome around it.
  const src = `${baseUrl}/iframe.html?id=${encodeURIComponent(
    storyId,
  )}&viewMode=${viewMode}`;

  return (
    <div
      style={{
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 8,
        overflow: 'hidden',
        margin: '1.5rem 0',
      }}
    >
      <iframe
        src={src}
        title={`Storybook story: ${storyId}`}
        loading="lazy"
        style={{ width: '100%', height, border: 0, display: 'block' }}
      />
    </div>
  );
}
