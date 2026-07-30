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

export function FontFamilyTokens(): React.ReactElement {
  return (
    <Section
      title="Font family"
      description="Flamingo's typeface across the rider app and this site is Noto Sans, used at five weights."
    >
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Family</th>
            <th>Sample</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>font-family-01</td>
            <td>Noto Sans</td>
            <td style={{ fontFamily: "'Noto Sans', sans-serif" }}>The quick brown fox jumps over the lazy dog</td>
          </tr>
        </tbody>
      </table>

      <table style={{ marginTop: '1.5rem' }}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Weight</th>
            <th>Sample</th>
          </tr>
        </thead>
        <tbody>
          {[
            { token: 'font-weight-01', name: 'Regular', weight: 400 },
            { token: 'font-weight-02', name: 'Medium', weight: 500 },
            { token: 'font-weight-03', name: 'Bold', weight: 700 },
            { token: 'font-weight-04', name: 'Extra-bold', weight: 800 },
            { token: 'font-weight-05', name: 'Black', weight: 900 },
          ].map((w) => (
            <tr key={w.token}>
              <td>{w.token}</td>
              <td>
                {w.name} ({w.weight})
              </td>
              <td style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: w.weight }}>
                The quick brown fox jumps over the lazy dog
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

type TextStyle = {
  name: string;
  usage: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: number;
  letterSpacing?: number;
  uppercase?: boolean;
  paragraphSpacing: number;
  listSpacing: number;
};

const TEXT_STYLES: TextStyle[] = [
  {
    name: 'display',
    usage: 'Only used to highlight a main number on a page or component.',
    fontSize: 48,
    lineHeight: 48,
    fontWeight: 800,
    paragraphSpacing: 16,
    listSpacing: 8,
  },
  {
    name: 'headline 1',
    usage: 'Used for page titles.',
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 900,
    paragraphSpacing: 8,
    listSpacing: 8,
  },
  {
    name: 'headline 2',
    usage: 'Used for section titles or component titles, e.g. on bottom sheets.',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 900,
    paragraphSpacing: 8,
    listSpacing: 8,
  },
  {
    name: 'subtitle 1',
    usage: 'Used for subsection headers.',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
    letterSpacing: -0.3,
    paragraphSpacing: 8,
    listSpacing: 4,
  },
  {
    name: 'subtitle 2',
    usage: 'Used for headers of lists containing different kinds of items.',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 700,
    paragraphSpacing: 8,
    listSpacing: 4,
  },
  {
    name: 'body 1',
    usage:
      'Main content text. Usually longer than headlines and subtitles — explains information clearly rather than drawing attention.',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
    paragraphSpacing: 4,
    listSpacing: 4,
  },
  {
    name: 'caption',
    usage:
      'Used underneath or beside photos, illustrations, or charts to briefly explain them. Also used for fine details and footnotes.',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    paragraphSpacing: 4,
    listSpacing: 4,
  },
  {
    name: 'tag',
    usage:
      'Used for identification fields and inventory labels, to give a glimpse of what the referenced element is about. Keep it to 2 words max.',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 800,
    uppercase: true,
    paragraphSpacing: 4,
    listSpacing: 4,
  },
];

export function TextStylesTokens(): React.ReactElement {
  return (
    <Section
      title="Text styles"
      description="Named combinations of font size, line height, weight, and spacing — the styles actually applied to text in the rider app, rather than individual tokens picked separately."
    >
      <table>
        <thead>
          <tr>
            <th>Style</th>
            <th>Sample</th>
            <th>Weight</th>
            <th>Size / line height</th>
            <th>Used for</th>
          </tr>
        </thead>
        <tbody>
          {TEXT_STYLES.map((style) => (
            <tr key={style.name}>
              <td>
                <code>{style.name}</code>
              </td>
              <td
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: style.fontSize,
                  lineHeight: `${style.lineHeight}px`,
                  fontWeight: style.fontWeight,
                  letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
                  textTransform: style.uppercase ? 'uppercase' : undefined,
                  whiteSpace: 'nowrap',
                }}
              >
                Rider app text
              </td>
              <td>{style.fontWeight}</td>
              <td>
                {style.fontSize}px / {style.lineHeight}px
              </td>
              <td>{style.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
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
