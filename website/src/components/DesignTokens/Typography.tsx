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

function TokenTable({ tokens, unit }: { tokens: Record<string, number>; unit: string }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(tokens).map(([name, value]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
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
          <code className={styles.fontSizeLabel}>{name}</code>
          <span style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: `var(--flamingo-${name})` }}>
            Rider app text
          </span>
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

      <div className={styles.subsection}>
        <h3 className={styles.subsectionTitle}>Why Noto Sans</h3>
        <dl>
          <dt>
            <strong>International</strong>
          </dt>
          <dd>Flamingo's text styles were designed to be accessible in all languages. Noto is "a typeface for the world" and supports every language the rider app ships in.</dd>
          <dt>
            <strong>Bold</strong>
          </dt>
          <dd>
            The rider app uses bold UI elements to prioritise the most important elements, so a rider
            can easily scan what's necessary for their work, on the go.
          </dd>
          <dt>
            <strong>Accessible</strong>
          </dt>
          <dd>
            Our text styles comply with the highest accessibility standards and settings, to make the
            experience enjoyable for every possible rider.
          </dd>
        </dl>
      </div>
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

export function TypographyGuidelines(): React.ReactElement {
  return (
    <>
      <Section
        title="Hierarchy"
        description="Use different text styles based on the level of importance and prominence the text has within the interface you're designing. Mix text sizes based on typographic harmony, especially if your UI is rich in text and needs hierarchy to let the reader understand what's most important and what can be skipped."
      >
        <div className={styles.exampleGrid}>
          <ExampleImage
            src="/img/tokens/typography/typography-page-with-content.png"
            alt="Page with content example"
            caption="Page with content"
          />
          <ExampleImage
            src="/img/tokens/typography/typography-data-on-top.png"
            alt="Data on top example"
            caption="Data on top"
          />
        </div>
        <p>
          Use headlines and subtitles to create hierarchy in a parent-child scenario: headlines,
          subtitles, body = parent, child, grandchild. Use headlines and subtitles for page and
          section titles, body for description.
        </p>
        <p>
          The <code>display</code> style should only be used to highlight a main number on a page or
          component. This style takes a lot of screen space, so use it sparingly.
        </p>

        <div className={styles.exampleGrid}>
          <ExampleImage src="/img/tokens/typography/typography-lists.png" alt="Lists example" caption="Lists" />
          <ExampleImage src="/img/tokens/typography/typography-cards.png" alt="Cards example" caption="Cards" />
        </div>
        <p>Make sure to highlight the important element of lists, and choose styles accordingly.</p>
        <p>Think of cards as sections wrapped in containers — they should follow the same rules of hierarchy.</p>
      </Section>

      <Section
        title="Tags"
        description={
          <>
            The <code>tag</code> style is usually used for identification components. As this style is
            all caps, avoid using it for texts that have several words.
          </>
        }
      >
        <div className={styles.exampleGrid}>
          <ExampleImage
            src="/img/tokens/typography/typography-tags-do.png"
            alt="Tags Do example"
            caption="Do"
          />
          <ExampleImage
            src="/img/tokens/typography/typography-tags-dont.png"
            alt="Tags Don't example"
            caption="Don't"
          />
        </div>
        <Subsection title="Do">
          <p>Use the Tag style for component items that use 1 to max. 3 words, which describe the content briefly.</p>
        </Subsection>
        <Subsection title="Don't">
          <p>
            Don't use tags for longer texts. Readability is reduced with all caps, because all-caps
            words have a uniform rectangular shape, meaning readers can't identify words by their
            shape.
          </p>
        </Subsection>
      </Section>
    </>
  );
}
