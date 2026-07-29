import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import globalTokens from '@site/tokens/global.json';
import { Section, Subsection } from './shared';
import ColourTabs from './ColourTabs';
import styles from './styles.module.css';

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
  return (
    <div className={styles.root}>
      <Tabs groupId="design-tokens" queryString>
        <TabItem value="colours" label="Colours" default>
          <ColourTabs />
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
