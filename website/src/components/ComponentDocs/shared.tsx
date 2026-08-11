import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// --- Reusable pieces for component documentation pages -------------------
// Used across every component under docs/components/**, so the Overview /
// Guidelines / Content / Change log / Code - Web pages look and behave the
// same regardless of which component they document.

export type Availability = 'available' | 'in-progress' | 'not-available';

const AVAILABILITY_ICON: Record<Availability, string> = {
  available: '✅',
  'in-progress': '🚧',
  'not-available': '⬜',
};

const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available',
  'in-progress': 'In progress',
  'not-available': 'Not available',
};

export function StatusBadge({
  status = 'stable',
}: {
  status?: 'draft' | 'in-review' | 'stable' | 'deprecated' | 'in-progress';
}) {
  const label = {
    draft: 'Draft',
    'in-review': 'In review',
    stable: 'Ready',
    deprecated: 'Deprecated',
    'in-progress': 'In progress',
  }[status];
  const className =
    status === 'in-progress'
      ? `${styles.statusBadge} ${styles.statusBadgeInProgress}`
      : styles.statusBadge;
  return <span className={className}>{label}</span>;
}

/**
 * The Figma / Web / iOS / Android / Specs availability row shown at the top
 * of every component's Overview page. Figma/Web/Specs link out to the real
 * source (Figma Components file, Storybook, Figma Specs file) when a href
 * is supplied — only pass one when the platform is genuinely available;
 * there's nothing useful to link to otherwise.
 */
export function AvailabilityTable({
  figma,
  web,
  ios,
  android,
  specs,
  figmaHref,
  webHref,
  specsHref,
}: {
  figma: Availability;
  web: Availability;
  ios: Availability;
  android: Availability;
  specs: Availability;
  figmaHref?: string;
  webHref?: string;
  specsHref?: string;
}) {
  const platforms = [
    { label: 'Figma', value: figma, href: figmaHref },
    { label: 'Web', value: web, href: webHref },
    { label: 'iOS', value: ios },
    { label: 'Android', value: android },
    { label: 'Specs', value: specs, href: specsHref },
  ];
  return (
    <table className={styles.stretchTable}>
      <thead>
        <tr>
          {platforms.map((p) => (
            <th key={p.label}>{p.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {platforms.map((p) => (
            <td key={p.label}>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  {AVAILABILITY_ICON[p.value]} {AVAILABILITY_LABEL[p.value]}
                </a>
              ) : (
                <>
                  {AVAILABILITY_ICON[p.value]} {AVAILABILITY_LABEL[p.value]}
                </>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export type PropRow = {
  name: string;
  description: string;
  type?: string;
  default?: string;
};

/** Renders a component's API/props table (name, description, type, default). */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className={styles.stretchTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Type</th>
          <th>Default</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>
              <code>{row.name}</code>
            </td>
            <td>{row.description}</td>
            <td>{row.type ? <code>{row.type}</code> : '—'}</td>
            <td>{row.default ? <code>{row.default}</code> : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DoDontImage({ src, alt }: { src: string; alt: string }) {
  const url = useBaseUrl(src);
  return <img src={url} alt={alt} className={styles.doDontImage} />;
}

/**
 * Side-by-side Do / Don't comparison, rendered as a proper two-column table
 * (Docusaurus has no built-in component for this — Admonitions
 * (:::tip / :::danger) only render single stacked callouts, not a
 * comparison layout, so this is a small custom one used across every
 * component's Guidelines page).
 */
export function DoDontTable({
  doImage,
  doText,
  dontImage,
  dontText,
}: {
  doImage?: string;
  doText: React.ReactNode;
  dontImage?: string;
  dontText: React.ReactNode;
}) {
  return (
    <table className={styles.doDontTable}>
      <thead>
        <tr>
          <th className={styles.doHeader}>✅ Do</th>
          <th className={styles.dontHeader}>❌ Don't</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {doImage && <DoDontImage src={doImage} alt="Do example" />}
            <p>{doText}</p>
          </td>
          <td>
            {dontImage && <DoDontImage src={dontImage} alt="Don't example" />}
            <p>{dontText}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/**
 * Single-column callout matching DoDontTable's visual design, for guidance
 * that's neither a clear Do nor a Don't — e.g. "use sparingly" warnings.
 */
export function CautionTable({
  image,
  text,
}: {
  image?: string;
  text: React.ReactNode;
}) {
  return (
    <table className={styles.doDontTable}>
      <thead>
        <tr>
          <th className={styles.cautionHeader}>⚠️ Caution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {image && <DoDontImage src={image} alt="Caution example" />}
            <p>{text}</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export type ChangelogRow = {
  date: string;
  version: string;
  description: React.ReactNode;
};

export function ChangelogTable({ rows }: { rows: ChangelogRow[] }) {
  return (
    <table className={styles.stretchTable}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Version</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.date}-${row.version}`}>
            <td>{row.date}</td>
            <td>{row.version}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
