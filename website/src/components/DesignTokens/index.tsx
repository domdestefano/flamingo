import React from 'react';
import globalTokens from '@site/tokens/global.json';
import semanticTokens from '@site/tokens/semantic.json';
import theme from '@site/tokens/theme.json';

const REFERENCE_BRAND = 'foodora';

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
    <section style={{ marginBottom: '3rem' }}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}

function SwatchGrid({ names }: { names: string[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
      }}
    >
      {names.map((name) => (
        <div key={name}>
          <div
            style={{
              height: 56,
              borderRadius: 8,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: `var(--flamingo-${name})`,
            }}
          />
          <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
            --flamingo-{name}
          </code>
        </div>
      ))}
    </div>
  );
}

function TokenTable({
  tokens,
  unit,
}: {
  tokens: Record<string, number>;
  unit: string;
}) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <code style={{ width: 140, fontSize: '0.8rem' }}>--flamingo-{name}</code>
          <div
            style={{
              height: 16,
              width: `var(--flamingo-${name})`,
              background: 'var(--flamingo-primary-main)',
              borderRadius: 2,
            }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}px
          </span>
        </div>
      ))}
    </div>
  );
}

function RadiusBoxes({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: 'var(--flamingo-primary-main)',
              borderRadius: `var(--flamingo-${name})`,
            }}
          />
          <code style={{ fontSize: '0.75rem' }}>{name}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}px
          </div>
        </div>
      ))}
    </div>
  );
}

function BorderBoxes({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              borderStyle: 'solid',
              borderColor: 'var(--flamingo-primary-main)',
              borderWidth: `var(--flamingo-${name})`,
            }}
          />
          <code style={{ fontSize: '0.75rem' }}>{name}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}px
          </div>
        </div>
      ))}
    </div>
  );
}

function OpacityBoxes({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              background: 'var(--flamingo-primary-main)',
              opacity: `var(--flamingo-${name})`,
            }}
          />
          <code style={{ fontSize: '0.75rem' }}>{name}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}%
          </div>
        </div>
      ))}
    </div>
  );
}

function BlurBoxes({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              background: 'var(--flamingo-primary-main)',
              filter: `blur(var(--flamingo-${name}))`,
            }}
          />
          <code style={{ fontSize: '0.75rem' }}>{name}</code>
          <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}px
          </div>
        </div>
      ))}
    </div>
  );
}

function FontSizeSamples({ tokens }: { tokens: Record<string, number> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Object.entries(tokens).map(([name, value]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <code style={{ width: 120, fontSize: '0.8rem', flexShrink: 0 }}>--flamingo-{name}</code>
          <span style={{ fontSize: `var(--flamingo-${name})` }}>Rider app text</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
            {value}px
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DesignTokens(): React.ReactElement {
  const reference = theme[REFERENCE_BRAND];

  return (
    <div>
      <Section
        title="Semantic colours"
        description="Brand-independent — background, alert, error, success, neutral, overlay, and shadow colours used everywhere regardless of brand. These follow light/dark mode only."
      >
        <SwatchGrid names={Object.keys(semanticTokens.light)} />
      </Section>

      <Section
        title="Brand colours"
        description="Primary, secondary, and illustration colours for whichever brand is currently selected in the navbar switcher — these swatches update live when you change it."
      >
        <h3>Primary &amp; secondary</h3>
        <SwatchGrid names={Object.keys(reference.light)} />
        <h3>Illustration</h3>
        <SwatchGrid names={Object.keys(reference.illustration)} />
      </Section>

      <Section
        title="Spacing"
        description="Used for padding, gaps, and layout spacing throughout the rider app."
      >
        <SpacingBars tokens={globalTokens.spacing} />
      </Section>

      <Section title="Corner radius">
        <RadiusBoxes tokens={globalTokens['corner-radius']} />
      </Section>

      <Section title="Border thickness">
        <BorderBoxes tokens={globalTokens['border-thickness']} />
      </Section>

      <Section title="Opacity">
        <OpacityBoxes tokens={globalTokens.opacity} />
      </Section>

      <Section title="Blur">
        <BlurBoxes tokens={globalTokens.blur} />
      </Section>

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
    </div>
  );
}
