import React from 'react';
import styles from './styles.module.css';

// --- Reusable pieces for the Getting Started section ----------------------
// Mirrors the visual pattern used across Zeroheight's Getting Started pages:
// a colored "Last update" banner under the tab bar, and a grid of
// name/role cards for "Team & comms" and "Designers in charge of X" sections.

/**
 * The teal "Last update: <date>" banner shown under the tab bar on every
 * Zeroheight Getting Started page. For pages still in progress, Zeroheight
 * uses an amber "This page is currently WIP" variant instead — use a plain
 * `:::warning` MDX admonition for that rather than a second component, since
 * it's a one-off message, not a repeating date field.
 */
export function UpdateBanner({ date }: { date: string }) {
  return (
    <div className={styles.updateBanner}>
      <strong>Last update:</strong> {date}
    </div>
  );
}

export type Person = { name: string; role?: string };

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Grid of name + role cards for "Team & comms" and "Designers in charge of
 * X" sections. Zeroheight shows real profile photos and links here — this
 * repo has neither (they weren't recoverable from the source screenshots),
 * so this renders an initials avatar instead of fabricating a photo or a
 * link.
 */
export function PeopleList({ people }: { people: Person[] }) {
  return (
    <div className={styles.peopleList}>
      {people.map((person) => (
        <div key={person.name} className={styles.personCard}>
          <div className={styles.personAvatar}>{initials(person.name)}</div>
          <div>
            <div className={styles.personName}>{person.name}</div>
            {person.role && <div className={styles.personRole}>{person.role}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
