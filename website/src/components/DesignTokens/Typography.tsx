import React from 'react';
import globalTokens from '@site/tokens/global.json';
import { Section } from './shared';
import styles from './styles.module.css';

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

export function FontSizeTokens(): React.ReactElement {
  return (
    <Section title="Font size">
      <FontSizeSamples tokens={globalTokens['font-size']} />
    </Section>
  );
}

export function LineHeightTokens(): React.ReactElement {
  return (
    <Section title="Line height">
      <TokenTable tokens={globalTokens['line-height']} unit="px" />
    </Section>
  );
}

export function LetterSpacingTokens(): React.ReactElement {
  return (
    <Section title="Letter spacing">
      <TokenTable tokens={globalTokens['letter-spacing']} unit="px" />
    </Section>
  );
}

export function ParagraphSpacingTokens(): React.ReactElement {
  return (
    <Section title="Paragraph spacing">
      <TokenTable tokens={globalTokens['paragraph-spacing']} unit="px" />
    </Section>
  );
}

export function ListSpacingTokens(): React.ReactElement {
  return (
    <Section title="List spacing">
      <TokenTable tokens={globalTokens['list-spacing']} unit="px" />
    </Section>
  );
}
