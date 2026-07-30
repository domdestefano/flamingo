import React from 'react';
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
  status?: 'draft' | 'in-review' | 'stable' | 'deprecated';
}) {
  const label = { draft: 'Draft', 'in-review': 'In review', stable: 'Ready', deprecated: 'Deprecated' }[
    status
  ];
  return <span className={styles.statusBadge}>{label}</span>;
}

/**
 * The Figma / Web / iOS / Android / Specs availability row shown at the top
 * of every component's Overview page.
 */
export function AvailabilityTable({
  figma,
  web,
  ios,
  android,
  specs,
}: {
  figma: Availability;
  web: Availability;
  ios: Availability;
  android: Availability;
  specs: Availability;
}) {
  const platforms = [
    { label: 'Figma', value: figma },
    { label: 'Web', value: web },
    { label: 'iOS', value: ios },
    { label: 'Android', value: android },
    { label: 'Specs', value: specs },
  ];
  return (
    <table>
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
              {AVAILABILITY_ICON[p.value]} {AVAILABILITY_LABEL[p.value]}
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
    <table>
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

export type ChangelogRow = {
  date: string;
  version: string;
  description: React.ReactNode;
};

export function ChangelogTable({ rows }: { rows: ChangelogRow[] }) {
  return (
    <table>
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
