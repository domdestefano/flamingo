import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

/**
 * Reads the resolved value of --flamingo-<name> from the DOM, re-reading
 * whenever the brand or light/dark mode changes (both are plain attributes
 * on <html>, so a MutationObserver is enough — no context/store needed).
 */
export function useResolvedToken(name: string): string {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      const resolved = getComputedStyle(document.documentElement)
        .getPropertyValue(`--flamingo-${name}`)
        .trim();
      setValue(resolved);
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-brand'],
    });
    return () => observer.disconnect();
  }, [name]);

  return value;
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
      {children}
    </section>
  );
}

export function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.subsection}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

export function Swatch({ name }: { name: string }) {
  const resolved = useResolvedToken(name);
  return (
    <div className={styles.swatchCard}>
      <div className={styles.swatchCheckerboard}>
        <div className={styles.swatchColor} style={{ background: `var(--flamingo-${name})` }} />
      </div>
      <code className={styles.swatchName}>--flamingo-{name}</code>
      <span className={styles.swatchValue}>{resolved}</span>
    </div>
  );
}

export function SwatchGrid({ names }: { names: string[] }) {
  return (
    <div className={styles.swatchGrid}>
      {names.map((name) => (
        <Swatch key={name} name={name} />
      ))}
    </div>
  );
}
