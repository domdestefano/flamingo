import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import globalTokens from '@site/tokens/global.json';
import { Section, Subsection } from './shared';
import styles from './styles.module.css';

function ExampleImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const url = useBaseUrl(src);
  return (
    <figure className={styles.exampleFigure}>
      <img src={url} alt={alt} className={styles.exampleImage} />
      <figcaption className={styles.exampleCaption}>{caption}</figcaption>
    </figure>
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

const DEPRECATED_SPACING = new Set(['spacing03', 'spacing05', 'spacing07', 'spacing09']);

const SPACING_SIZES: { label: string; tokens: string }[] = [
  { label: 'XS — Extra-small', tokens: 'Absence of spacing' },
  { label: 'S — Small', tokens: 'spacing01 and spacing02' },
  { label: 'M — Medium', tokens: 'spacing03, spacing04 and spacing05' },
  { label: 'L — Large', tokens: 'spacing06 and spacing07' },
  { label: 'XL — Extra-large', tokens: 'spacing08 and spacing09' },
];

export function SpacingTokens(): React.ReactElement {
  return (
    <Section
      title="Spacing"
      description="Used for padding, gaps, and layout spacing throughout the rider app. Tokens marked deprecated below are still supported, but avoid using them in new work — prefer the nearest non-deprecated token instead."
    >
      <SpacingBars tokens={globalTokens.spacing} />

      <Subsection title="Deprecated tokens">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(globalTokens.spacing)
              .filter((name) => DEPRECATED_SPACING.has(name))
              .map((name) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>To be deprecated</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Subsection>

      <Subsection title="Size">
        <p>The tokens can be divided into the following categories:</p>
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {SPACING_SIZES.map((size) => (
              <tr key={size.label}>
                <td>{size.label}</td>
                <td>{size.tokens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Subsection>

      <Subsection title="Usage">
        <p>
          The values listed above represent the spacing tokens one needs to use when creating a
          component for Flamingo. Their usage is based on the principle of proximity and grouping:
          elements that are close to each other represent a group to be scanned together. The further
          apart elements are, the more separated they will look from one another.
        </p>

        <h4>Text</h4>
        <p>
          When grouping text within UI elements, e.g. Title + Description, Flamingo uses smaller
          spacing tokens like <code>spacing01</code> and <code>spacing02</code>, or the absence of
          spacing if all UI elements need to be compact. When text elements need to be separated
          because they refer to different pieces of information, Flamingo uses medium spacing tokens
          like <code>spacing04</code> and <code>spacing05</code>. Larger spacing tokens are used when
          you want to create a distinct section between text areas.
        </p>

        <h4>Icons</h4>
        <p>
          When grouping icons within UI elements, e.g. Icon + Label, Flamingo uses smaller spacing
          tokens like <code>spacing01</code> and <code>spacing02</code>. When icons need to be
          separated, because they refer to different pieces of information, actions, or purposes,
          Flamingo uses medium spacing tokens like <code>spacing04</code> and <code>spacing05</code>.
          This is also used to avoid mis-taps as the icons would be too close.
        </p>

        <h4>Buttons</h4>
        <p>
          Buttons are in a shelf, for instance in a modal or bottom sheet, and use{' '}
          <code>spacing03</code> or <code>spacing04</code> depending on whether you want to give a
          more compact view of the UI elements.
        </p>

        <h4>Cards</h4>
        <p>
          UI elements within cards are always a spacing token as padding between the UI element and the
          card border. The choice between <code>spacing04</code> or <code>spacing05</code> depends on
          whether you want to give a more compact view of the UI elements.
        </p>
      </Subsection>

      <Subsection title="Principles">
        <h4>Proximity and grouping</h4>
        <p>
          Proximity refers to how close elements are to one another. The strongest proximity
          relationships are those between overlapping subjects, but just grouping objects into a
          single area can also have a strong proximity effect.
        </p>
        <p>
          The opposite is true, of course. By putting space between elements, you can add separation
          even when their other characteristics are the same.
        </p>
        <p>
          In UX design, proximity is most often used in order to get users to group certain things
          together without the use of things like hard borders. By putting like things closer
          together, with space in between each group, the viewer will immediately pick up on the
          organisation and structure your team wants them to perceive.
        </p>

        <h4>Legibility and interaction</h4>
        <p>
          This principle refers to accessibility. Elements within components should not be placed too
          unnecessarily close to each other, because this could create problems for the user to scan
          the content or tap the wrong element. As our users interact with our app in a fast and
          mobile-first environment, we should take this into account to avoid mis-taps and issues when
          scanning the interface. This also applies to people with eyesight and motor issues.
        </p>
      </Subsection>

      <Subsection title="Do's and don'ts">
        <h4>Too close</h4>
        <p>
          Putting elements too close together might cause mis-taps or readability problems. Flamingo
          recommends using smaller tokens only when putting together non-interactive elements.
        </p>
        <h4>Too far</h4>
        <p>
          Putting elements too far apart might make them seem unrelated, so they won't be scanned as
          a group. Flamingo recommends using bigger tokens only when you want to create a strong
          separation between sections.
        </p>
      </Subsection>
    </Section>
  );
}

const CORNER_RADIUS_USE_CASES: {
  token: string;
  image: string;
  caption: string;
  description: string;
}[] = [
  {
    token: 'corner-radius01',
    image: '/img/tokens/corner-radius/corner-radius-01.png',
    caption: 'corner-radius01 (8px)',
    description: '8px corners are used for compact rectangular elements, such as tab containers or bar charts.',
  },
  {
    token: 'corner-radius03',
    image: '/img/tokens/corner-radius/corner-radius-03.png',
    caption: 'corner-radius03 (12px)',
    description: '12px corners are used for medium-sized elements such as snackbars or input fields.',
  },
  {
    token: 'corner-radius05',
    image: '/img/tokens/corner-radius/corner-radius-05.png',
    caption: 'corner-radius05 (20px)',
    description:
      '20px corners are used only for containers that are exactly 56px in height and meant to look pill-shaped. The most common example is "small" size buttons.',
  },
  {
    token: 'corner-radius06',
    image: '/img/tokens/corner-radius/corner-radius-06.png',
    caption: 'corner-radius06 (24px)',
    description: '24px corners are used for full-size containers such as cards, sheets, and message box backgrounds.',
  },
  {
    token: 'corner-radius09',
    image: '/img/tokens/corner-radius/corner-radius-09.png',
    caption: 'corner-radius09 (28px)',
    description:
      '28px corners are used only for containers that are exactly 56px in height and meant to look pill-shaped. The most common example is "big" size buttons.',
  },
];

const CORNER_RADIUS_PROPERTIES: { token: string; value: number; available: boolean }[] = [
  { token: 'corner-radius01', value: 8, available: true },
  { token: 'corner-radius02', value: 8, available: false },
  { token: 'corner-radius03', value: 12, available: true },
  { token: 'corner-radius04', value: 12, available: false },
  { token: 'corner-radius05', value: 20, available: true },
  { token: 'corner-radius06', value: 24, available: true },
  { token: 'corner-radius07', value: 24, available: false },
  { token: 'corner-radius08', value: 24, available: false },
  { token: 'corner-radius09', value: 28, available: true },
  { token: 'corner-radius10', value: 32, available: false },
  { token: 'corner-radius11', value: 47, available: false },
  { token: 'corner-radius12', value: 50, available: false },
];

export function CornerRadiusTokens(): React.ReactElement {
  return (
    <Section
      title="Corner radius"
      description={
        <>
          Corner radius tokens define the size of "rounded corners" on rectangular elements. Every
          element of a Flamingo component that has a rounded corner value should use a token, and{' '}
          <strong>not</strong> a custom value. As long as you're using default Flamingo components,
          you don't need to worry about corner radius tokens as they're pre-applied to each element.
          If you're creating a local component, it's important to use corner radius tokens and stay
          consistent with design system standards.
        </>
      }
    >
      <TokenBoxes
        tokens={globalTokens['corner-radius']}
        unit="px"
        boxStyle={(name) => ({
          background: 'var(--flamingo-primary-main)',
          borderRadius: `var(--flamingo-${name})`,
        })}
      />

      <Subsection title="Use cases">
        {CORNER_RADIUS_USE_CASES.map((useCase) => (
          <div key={useCase.token} style={{ marginBottom: '2rem' }}>
            <p>{useCase.description}</p>
            <ExampleImage src={useCase.image} alt={useCase.caption} caption={useCase.caption} />
          </div>
        ))}
      </Subsection>

      <Subsection title="Properties">
        <table>
          <thead>
            <tr>
              <th>Available to use?</th>
              <th>Token</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {CORNER_RADIUS_PROPERTIES.map((prop) => (
              <tr key={prop.token}>
                <td>{prop.available ? '✅' : '❌ DO NOT USE'}</td>
                <td>
                  <code>{prop.token}</code>
                </td>
                <td>{prop.value}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Subsection>
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
