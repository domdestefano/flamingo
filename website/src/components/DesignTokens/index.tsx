import React, { useEffect, useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import globalTokens from '@site/tokens/global.json';
import semanticTokens from '@site/tokens/semantic.json';
import theme from '@site/tokens/theme.json';
import styles from './styles.module.css';

const REFERENCE_BRAND = 'foodora';

/**
 * Reads the resolved value of --flamingo-<name> from the DOM, re-reading
 * whenever the brand or light/dark mode changes (both are plain attributes
 * on <html>, so a MutationObserver is enough — no context/store needed).
 */
function useResolvedToken(name: string): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      const resolved = getComputedStyle(document.documentElement)
        .getPropertyValue(`--flamingo-${name}`)
        .trim();
      setValue(resolved);
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-brand'],
    });
    return () => observer.disconnect();
  }, [name]);

  return value;
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.subsection}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Swatch({ name }: { name: string }) {
  const resolved = useResolvedToken(name);
  return (
    <div className={styles.swatchCard}>
      <div className={styles.swatchCheckerboard}>
        <div className={styles.swatchColor} style={{ background: `var(--flamingo-${name})` }} />
      </div>
      <code className={styles.swatchName}>--flamingo-{name}</code>
      <span className={styles.swatchValue}>{resolved}</span>
    </div>
  );
}

function SwatchGrid({ names }: { names: string[] }) {
  return (
    <div className={styles.swatchGrid}>
      {names.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  );
}

// --- Semantic colour categorisation -----------------------------------

const SEMANTIC_GROUPS: { label: string; match: (name: string) => boolean }[] = [
  { label: 'Neutral', match: (n) => n.startsWith('color-neutral') && !n.includes('opacity') },
  { label: 'Primary', match: (n) => n.startsWith('color-primary') },
  { label: 'Secondary', match: (n) => n.startsWith('color-secondary') },
  {
    label: 'Status',
    match: (n) =>
      n.startsWith('color-success') || n.startsWith('color-error') || n.startsWith('color-alert'),
  },
  { label: 'Background', match: (n) => n.startsWith('color-background') },
  { label: 'Overlay', match: (n) => n.startsWith('color-overlay') },
  { label: 'Shadow', match: (n) => n.startsWith('color-shadow') },
  { label: 'Opacity variants', match: (n) => n.includes('opacity') },
];

function groupTokenNames(names: string[]) {
  const groups: { label: string; names: string[] }[] = SEMANTIC_GROUPS.map((g) => ({
    label: g.label,
    names: [],
  }));

  for (const name of names) {
    // First matching group wins; "Opacity variants" is checked last in
    // SEMANTIC_GROUPS but should win over Neutral/Status for e.g.
    // "color-neutral-opacity03", so we check it explicitly first here.
    const opacityGroup = groups.find((g) => g.label === 'Opacity variants')!;
    if (name.includes('opacity')) {
      opacityGroup.names.push(name);
      continue;
    }
    const group = SEMANTIC_GROUPS.find((g) => g.label !== 'Opacity variants' && g.match(name));
    if (group) {
      groups.find((g) => g.label === group.label)!.names.push(name);
    }
  }

  return groups.filter((g) => g.names.length > 0);
}

function SemanticColourGroups({ names }: { names: string[] }) {
  const groups = groupTokenNames(names);
  return (
    <>
      {groups.map((group) => (
        <Subsection key={group.label} title={group.label}>
          <SwatchGrid names={group.names} />
        </Subsection>
      ))}
    </>
  );
}

// --- Numeric token visualisations ---------------------------------------

function TokenTable({ tokens, unit }: { tokens: Record<string, number>; unit: string }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>CSS variable</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokens).map(([name, value]) => (
          <tr key={name}>
            <td>{name}</td>
            <td>
              <code>--flamingo-{name}</code>
            </td>
            <td>
              {value}
              {unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SpacingBars({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div className={styles.barList}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} className={styles.barRow}>
          <code className={styles.barLabel}>--flamingo-{name}</code>
          <div className={styles.bar} style={{ width: `var(--flamingo-${name})` }} />
          <span className={styles.barValue}>{value}px</span>
        </div>
      ))}
    </div>
  );
}

function TokenBoxes({
  tokens,
  unit,
  boxStyle,
}: {
  tokens: Record<string, number>;
  unit: string;
  boxStyle: (name: string) => React.CSSProperties;
}) {
  return (
    <div className={styles.boxGrid}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} className={styles.boxCard}>
          <div className={styles.box} style={boxStyle(name)} />
          <code className={styles.boxName}>{name}</code>
          <div className={styles.boxValue}>
            {value}
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

function FontSizeSamples({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div className={styles.fontSizeList}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} className={styles.fontSizeRow}>
          <code className={styles.fontSizeLabel}>--flamingo-{name}</code>
          <span style={{ fontSize: `var(--flamingo-${name})` }}>Rider app text</span>
          <span className={styles.fontSizeValue}>{value}px</span>
        </div>
      ))}
    </div>
  );
}

export default function DesignTokens(): React.ReactElement {
  const reference = theme[REFERENCE_BRAND];
  const primaryNames = Object.keys(reference.light).filter((n) => n.startsWith('primary'));
  const secondaryNames = Object.keys(reference.light).filter((n) => n.startsWith('secondary'));

  return (
    <div className={styles.root}>
      <Tabs groupId="design-tokens" queryString>
        <TabItem value="colours" label="Colours" default>
          <Section
            title="Semantic colours"
            description="Brand-independent — used everywhere regardless of brand. These follow light/dark mode only."
          >
            <SemanticColourGroups names={Object.keys(semanticTokens.light)} />
          </Section>

          <Section
            title="Brand colours"
            description="Primary, secondary, and illustration colours for whichever brand is currently selected in the navbar switcher — these swatches update live when you change it."
          >
            <Subsection title="Primary">
              <SwatchGrid names={primaryNames} />
            </Subsection>
            <Subsection title="Secondary">
              <SwatchGrid names={secondaryNames} />
            </Subsection>
            <Subsection title="Illustration">
              <SwatchGrid names={Object.keys(reference.illustration)} />
            </Subsection>
          </Section>
        </TabItem>

        <TabItem value="spacing-sizing" label="Spacing & sizing">
          <Section
            title="Spacing"
            description="Used for padding, gaps, and layout spacing throughout the rider app."
          >
            <SpacingBars tokens={globalTokens.spacing} />
          </Section>

          <Section title="Corner radius">
            <TokenBoxes
              tokens={globalTokens['corner-radius']}
              unit="px"
              boxStyle={(name) => ({
                background: 'var(--flamingo-primary-main)',
                borderRadius: `var(--flamingo-${name})`,
              })}
            />
          </Section>

          <Section title="Border thickness">
            <TokenBoxes
              tokens={globalTokens['border-thickness']}
              unit="px"
              boxStyle={(name) => ({
                borderRadius: 8,
                borderStyle: 'solid',
                borderColor: 'var(--flamingo-primary-main)',
                borderWidth: `var(--flamingo-${name})`,
              })}
            />
          </Section>

          <Section title="Opacity">
            <TokenBoxes
              tokens={globalTokens.opacity}
              unit="%"
              boxStyle={(name) => ({
                borderRadius: 8,
                background: 'var(--flamingo-primary-main)',
                opacity: `var(--flamingo-${name})`,
              })}
            />
          </Section>

          <Section title="Blur">
            <TokenBoxes
              tokens={globalTokens.blur}
              unit="px"
              boxStyle={(name) => ({
                borderRadius: 8,
                background: 'var(--flamingo-primary-main)',
                filter: `blur(var(--flamingo-${name}))`,
              })}
            />
          </Section>
        </TabItem>

        <TabItem value="typography" label="Typography">
          <Section title="Font size">
            <FontSizeSamples tokens={globalTokens['font-size']} />
          </Section>

          <Section title="Line height">
            <TokenTable tokens={globalTokens['line-height']} unit="px" />
          </Section>

          <Section title="Letter spacing">
            <TokenTable tokens={globalTokens['letter-spacing']} unit="px" />
          </Section>

          <Section title="Paragraph spacing">
            <TokenTable tokens={globalTokens['paragraph-spacing']} unit="px" />
          </Section>

          <Section title="List spacing">
            <TokenTable tokens={globalTokens['list-spacing']} unit="px" />
          </Section>
        </TabItem>
      </Tabs>
    </div>
  );
}
