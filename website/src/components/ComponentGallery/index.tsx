import React from 'react';
import Link from '@docusaurus/Link';
import { galleryCategories } from './data';
import { componentIcons } from './icons';
import styles from './styles.module.css';

function Thumbnail({ item }: { item: (typeof galleryCategories)[number]['items'][number] }) {
  return (
    <Link to={item.href} className={`${styles.card} flamingo-card`}>
      <span className={styles.icon} aria-hidden="true">
        {componentIcons[item.slug] ?? '🧩'}
      </span>
      <span className={styles.cardTitle}>{item.title}</span>
    </Link>
  );
}

/** Full grid of every component, grouped by category, each linking straight
 * to its Overview page — the landing page shown when clicking "Components"
 * in the navbar, for quick visual browsing instead of hunting through the
 * sidebar tree. Icons are placeholders until a proper icon set is designed
 * for this gallery. */
export default function ComponentGallery(): React.ReactElement {
  return (
    <div className={styles.gallery}>
      {galleryCategories.map((category) => (
        <section key={category.label} className={styles.categorySection}>
          <h2>{category.label}</h2>
          <div className={styles.grid}>
            {category.items.map((item) => (
              <Thumbnail key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
