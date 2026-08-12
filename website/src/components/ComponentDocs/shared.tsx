import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

// --- Reusable pieces for component documentation pages -------------------
// Used across every component under docs/components/**, so the Overview /
// Guidelines / Content / Change log / Code - Web pages look and behave the
// same regardless of which component they document.

export type Availability = 'available' | 'in-progress' | 'not-available';

const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available',
  'in-progress': 'In progress',
  'not-available': 'Not available',
};

const AVAILABILITY_STYLE: Record<Availability, string> = {
  available: styles.availabilityAvailable,
  'in-progress': styles.availabilityInProgress,
  'not-available': styles.availabilityNotAvailable,
};

/**
 * Replaces the old hand-set StatusBadge ("Ready" / "In progress") next to a
 * page's H1 — that went stale the moment someone edited the page without
 * remembering to bump it. This reads the real git commit date for the
 * current file instead (`docs.showLastUpdateTime: true` in
 * docusaurus.config.ts populates `metadata.lastUpdatedAt`), so it updates
 * itself. Renders nothing if the date isn't available yet (e.g. a brand
 * new, uncommitted file in local dev).
 */
export function LastUpdatedBadge() {
  const { metadata } = useDoc();
  if (!metadata.lastUpdatedAt) return null;
  const formatted = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(metadata.lastUpdatedAt));
  return <span className={styles.lastUpdatedBadge}>Updated {formatted}</span>;
}

const PLATFORM_ICON: Record<string, string> = {
  Figma: 'img/availability-icons/figma.svg',
  Web: 'img/availability-icons/web.svg',
  iOS: 'img/availability-icons/ios.svg',
  Android: 'img/availability-icons/android.svg',
  Specs: 'img/availability-icons/specs.svg',
};

function AvailabilityPill({
  label,
  value,
  href,
}: {
  label: string;
  value: Availability;
  href?: string;
}) {
  const iconUrl = useBaseUrl(PLATFORM_ICON[label]);
  const content = (
    <>
      <span
        className={styles.availabilityIcon}
        style={{ ['--icon-mask-url' as string]: `url(${iconUrl})` }}
        role="img"
        aria-label=""
      />
      <span className={styles.availabilityText}>
        <span className={styles.availabilityLabel}>{label}</span>
        <span className={styles.availabilityStatus}>{AVAILABILITY_LABEL[value]}</span>
      </span>
    </>
  );
  const className = `${styles.availabilityPill} ${AVAILABILITY_STYLE[value]}`;
  return href ? (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
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
    <div className={styles.availabilityRow}>
      {platforms.map((p) => (
        <AvailabilityPill key={p.label} label={p.label} value={p.value} href={p.href} />
      ))}
    </div>
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
