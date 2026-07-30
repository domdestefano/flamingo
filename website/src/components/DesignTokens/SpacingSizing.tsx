import React from 'react';
import globalTokens from '@site/tokens/global.json';
import { Section } from './shared';
import styles from './styles.module.css';

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

export function SpacingTokens(): React.ReactElement {
  return (
    <Section
      title="Spacing"
      description="Used for padding, gaps, and layout spacing throughout the rider app."
    >
      <SpacingBars tokens={globalTokens.spacing} />
    </Section>
  );
}

export function CornerRadiusTokens(): React.ReactElement {
  return (
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
  );
}

export function BorderThicknessTokens(): React.ReactElement {
  return (
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
  );
}

export function OpacityTokens(): React.ReactElement {
  return (
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
  );
}

export function BlurTokens(): React.ReactElement {
  return (
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
  );
}
