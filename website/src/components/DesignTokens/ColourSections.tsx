import React from 'react';
import semanticTokens from '@site/tokens/semantic.json';
import theme from '@site/tokens/theme.json';
import { Section, Subsection, SwatchGrid, useResolvedToken } from './shared';
import styles from './styles.module.css';

const REFERENCE_BRAND = 'foodora';

// --- Per-token usage descriptions, adapted from the Flamingo colour ---
// --- guidelines into our own words. -------------------------------------

const PRIMARY_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'primary-dark02',
    usage:
      'Pressed states for buttons and links. Also used to select prominent elements like tabs or dates, and for progression, e.g. progress circles.',
  },
  {
    name: 'primary-main',
    usage:
      'Actions and active states — buttons and form elements. Also used for vivid accents in illustrations.',
  },
  {
    name: 'primary-light01',
    usage:
      'Less prominent actions and active states, like secondary buttons, and less prominent selection, like chips.',
  },
  {
    name: 'primary-light02',
    usage:
      'Borders or backgrounds of less prominent actions, like a pressed secondary button. Also used for less vivid illustration accents.',
  },
  {
    name: 'primary-light04',
    usage:
      'Borders or backgrounds of the least prominent elements: selection (segmented controls, toggles), progression (progress bars), and indicators (badges).',
  },
];

const SUCCESS_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-success-main',
    usage:
      'Major prominence for positive messages — icons and bold tags. Also used for positive non-interactive text and small illustration accents.',
  },
  {
    name: 'color-success-light',
    usage: 'Light indicator of a positive message — background for pale tags and message banners.',
  },
];

const ALERT_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-alert-main',
    usage:
      'Major prominence for cautious messages — icons and bold tags. Also used for alerting non-interactive text.',
  },
  {
    name: 'color-alert-light',
    usage:
      'Light indicator of a cautious message — background for pale tags, message banners, and message bars.',
  },
];

const ERROR_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-error-dark',
    usage:
      'Pressed state of a destructive interactive element, like a destructive button. This is the only error shade used for interactive purposes.',
  },
  {
    name: 'color-error-main',
    usage:
      'Major prominence for danger messages — icons, bold tags, buttons. Also used for negative non-interactive text and small illustration accents.',
  },
  {
    name: 'color-error-light',
    usage: 'Light indicator of a danger message — background for pale tags and message banners.',
  },
];

const OVERLAY_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-overlay-primary',
    usage:
      "Base colour for overlay interfaces, e.g. a scrim or viewfinder frame. Unlike every other Semantic colour, this stays the same regardless of light/dark mode — so overlay UI doesn't flicker or change when a rider switches modes.",
  },
  {
    name: 'color-overlay-secondary',
    usage: 'Secondary colour for overlay interfaces, for less prominent elements within the same overlay.',
  },
  {
    name: 'color-overlay-tertiary',
    usage: 'Tertiary colour for overlay interfaces, for the least prominent elements within the same overlay.',
  },
];

const SHADOW_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-shadow-light',
    usage: 'Light shadow colour, for subtle elevation on cards and surfaces.',
  },
  {
    name: 'color-shadow-heavy',
    usage: 'Heavy shadow colour, for pronounced elevation, e.g. modals or floating action buttons.',
  },
];

const BACKGROUND_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-background-default',
    usage: 'Default background for the UI. Use this when a screen has no elevated elements on it.',
  },
  {
    name: 'color-background-light',
    usage:
      "Alternative background for the UI. Use it behind elevated elements, to create contrast against their (typically default-coloured) surface.",
  },
  {
    name: 'color-background-brand',
    usage:
      'Heavy branding use only — e.g. a full-screen order number, or the header of the side menu. Not for general UI backgrounds.',
  },
  {
    name: 'color-background-overlay',
    usage: 'Dimming overlay behind modals, sheets, or any content that sits above the base UI.',
  },
];

const NEUTRAL_ITEMS: { name: string; usage: string }[] = [
  {
    name: 'color-neutral100',
    usage:
      'Highest-emphasis neutral. Used for the most prominent text, and as a standalone element or background where a strong neutral is needed.',
  },
  {
    name: 'color-neutral80',
    usage: 'High-emphasis neutral. Used for prominent text, and for un-selected text, e.g. on dropdowns.',
  },
  {
    name: 'color-neutral50',
    usage:
      'Mid-emphasis neutral. Used for secondary text, as inactive text on buttons and inputs, and standalone for un-selected elements.',
  },
  {
    name: 'color-neutral30',
    usage:
      'Used as inactive standalone UI, as a border or placeholder text for un-selected elements, and for less prominent text.',
  },
  {
    name: 'color-neutral20',
    usage: 'Used as an inactive background (paired with neutral50 as text), and as a border for un-selected elements.',
  },
  {
    name: 'color-neutral10',
    usage: 'Used as the background for un-selected elements, like dropdowns and text inputs.',
  },
  {
    name: 'color-neutral05',
    usage: 'Used for minimal, understated neutral surfaces.',
  },
  {
    name: 'color-neutral00',
    usage: 'Lowest-emphasis neutral in the scale — reserved for the most minimal, unobtrusive uses.',
  },
];

function TokenUsageRow({ name, usage }: { name: string; usage: string }) {
  const resolved = useResolvedToken(name);
  return (
    <tr>
      <td className={styles.usageSwatchCell}>
        <div className={styles.usageSwatchWrap}>
          <div className={styles.usageSwatch} style={{ background: `var(--flamingo-${name})` }} />
        </div>
      </td>
      <td>
        <code>--flamingo-{name}</code>
      </td>
      <td className={styles.monoValue}>{resolved}</td>
      <td>{usage}</td>
    </tr>
  );
}

function TokenUsageTable({ items }: { items: { name: string; usage: string }[] }) {
  return (
    <table className={styles.usageTable}>
      <thead>
        <tr>
          <th />
          <th>Token</th>
          <th>Value</th>
          <th>Used for</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <TokenUsageRow key={item.name} {...item} />
        ))}
      </tbody>
    </table>
  );
}

export function ColourPrinciples(): React.ReactElement {
  return (
    <>
      <p className={styles.sectionDescription}>
        Every colour has a meaningful, human-friendly name, so it's easy for anyone — designers or
        developers — to read the name and immediately know what the colour is for.
      </p>

      <div className={styles.calloutBox}>
        <strong>Guidelines</strong>
        <ul>
          <li>
            Use interactive colours (Primary) only for elements a rider can tap. Use Status and
            Neutral colours for static, non-interactive elements — don't swap the two.
          </li>
          <li>
            Keep a consistent set of colours within a single view. Mixing colours in ways that break
            chromatic harmony or accessibility contrast makes a screen harder to read.
          </li>
          <li>
            Don't create one-off colours outside this token set. If nothing here fits, ask the design
            system team to add one.
          </li>
        </ul>
      </div>
    </>
  );
}

export function PrimaryColours(): React.ReactElement {
  const reference = theme[REFERENCE_BRAND];
  const secondaryNames = Object.keys(reference.light).filter((n) => n.startsWith('secondary'));

  return (
    <Section
      title="Primary"
      description="Used primarily for interactive elements — things that can be tapped or interacted with. Secondarily, these shades indicate progression (loading bars, circles, pies), activeness (switches), and selection (segmented controls, toggles)."
    >
      <TokenUsageTable items={PRIMARY_ITEMS} />

      <Subsection title="Secondary">
        <p className={styles.sectionDescription}>
          Where a brand defines a secondary accent colour, it follows the same five-tier pattern as
          Primary above (dark02 → light04, from most to least prominent) and is used the same way,
          as an alternate emphasis colour.
        </p>
        <SwatchGrid names={secondaryNames} />
      </Subsection>
    </Section>
  );
}

export function NeutralColours(): React.ReactElement {
  return (
    <Section
      title="Neutral"
      description="Used primarily for text and for static or inactive elements — things that cannot be tapped or interacted with. Secondarily, these shades indicate progression, inactiveness (buttons, switches, links), and un-selection (checkboxes, radios, switches)."
    >
      <TokenUsageTable items={NEUTRAL_ITEMS} />

      <Subsection title="Text">
        <p>
          For text, use the higher-emphasis neutral shades — neutral100, neutral80, and neutral50 —
          depending on how prominent the text should be. Avoid the lighter shades for text: the
          contrast against most backgrounds won't be high enough for everyone to read comfortably.
        </p>
      </Subsection>

      <Subsection title="Icons">
        <p>
          For icons that simply indicate a state, use a neutral or status colour. Reserve
          interactive (primary) colours for icons that are themselves tappable.
        </p>
      </Subsection>
    </Section>
  );
}

export function StatusColours(): React.ReactElement {
  return (
    <Section
      title="Status"
      description="Used primarily for static UI elements — things that cannot be tapped or interacted with. Mostly seen in tags, message banners, message bars, and icons, to indicate success, caution, or danger."
    >
      <Subsection title="Success">
        <TokenUsageTable items={SUCCESS_ITEMS} />
      </Subsection>
      <Subsection title="Alert">
        <TokenUsageTable items={ALERT_ITEMS} />
      </Subsection>
      <Subsection title="Error">
        <p>
          Error is the one status colour with an interactive exception: it's used for destructive
          actions, like a "Delete" button.
        </p>
        <TokenUsageTable items={ERROR_ITEMS} />
      </Subsection>
    </Section>
  );
}

export function BackgroundColours(): React.ReactElement {
  return (
    <Section
      title="Background"
      description="Used for the background of the UI. These should not be used for the background of UI elements themselves."
    >
      <TokenUsageTable items={BACKGROUND_ITEMS} />

      <Subsection title="Sections">
        <p>
          Combine both background colours when a screen is split into sections: the part of the UI
          with elevated content uses <code>color.background.light</code>, while the other section
          uses <code>color.background.default</code>.
        </p>
      </Subsection>
    </Section>
  );
}

export function OverlayColours(): React.ReactElement {
  return (
    <Section
      title="Overlay"
      description="Used in overlay interfaces where elements need to stay the same colour regardless of the light/dark switch, e.g. a camera viewfinder or map overlay that sits above the rest of the app."
    >
      <TokenUsageTable items={OVERLAY_ITEMS} />
    </Section>
  );
}

export function ShadowColours(): React.ReactElement {
  return (
    <Section
      title="Shadow"
      description="Used for elevation and depth effects, like drop shadows behind cards or floating elements. These follow light/dark mode, unlike Overlay above."
    >
      <TokenUsageTable items={SHADOW_ITEMS} />
    </Section>
  );
}

export function TransparentColours(): React.ReactElement {
  return (
    <Section
      title="Transparent"
      description="Used primarily to highlight elements and areas in layered interfaces, like maps. The less transparent (higher opacity) a shade is, the more prominent the highlighted element or area appears — for example, a heatmap showing high-demand areas. These follow light/dark mode, the same as Semantic colours."
    >
      <Subsection title="Neutral opacity">
        <p>
          The default choice for highlighting layered elements or areas. Use increasing opacity to
          draw more attention to a specific area, e.g. the busiest zone on a map.
        </p>
        <SwatchGrid
          names={Object.keys(semanticTokens.light).filter((n) => n.startsWith('color-neutral-opacity'))}
        />
      </Subsection>
      <Subsection title="Error opacity">
        <p>
          Used to highlight layered areas that carry a warning or danger meaning, e.g. a restricted
          or high-risk zone on a map.
        </p>
        <SwatchGrid
          names={Object.keys(semanticTokens.light).filter((n) => n.startsWith('color-error-opacity'))}
        />
      </Subsection>
      <Subsection title="White opacity">
        <p>
          Used for subtle shading over light surfaces, e.g. dividers or layered cards, to add depth
          without introducing a new colour.
        </p>
        <SwatchGrid
          names={Object.keys(semanticTokens.light).filter((n) => n.startsWith('color-white-opacity'))}
        />
      </Subsection>
    </Section>
  );
}

export function IllustrationColours(): React.ReactElement {
  const reference = theme[REFERENCE_BRAND];
  const illustrationNames = Object.keys(reference.illustration);

  return (
    <Section
      title="Illustration"
      description="Used only for illustration and animation assets — not for UI elements. Unlike every other colour family here, illustration colours don't change between light and dark mode. They do change per brand, matching whichever brand is selected in the navbar switcher."
    >
      <SwatchGrid names={illustrationNames} />
    </Section>
  );
}
