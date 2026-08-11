import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { galleryCategories } from './data';
import { componentIcons, componentIconImages } from './icons';
import styles from './styles.module.css';

function Thumbnail({ item }: { item: (typeof galleryCategories)[number]['items'][number] }) {
  const iconImage = componentIconImages[item.slug];
  const iconImageUrl = useBaseUrl(iconImage ?? '');
  return (
    <Link to={item.href} className={`${styles.card} flamingo-card`}>
      {iconImage ? (
        <span className={styles.iconTile}>
          <img src={iconImageUrl} alt="" className={styles.iconImage} />
        </span>
      ) : (
        <span className={styles.icon} aria-hidden="true">
          {componentIcons[item.slug] ?? '🧩'}
        </span>
      )}
      <span className={styles.cardTitle}>{item.title}</span>
    </Link>
  );
}

/** Full grid of every component, grouped by category, each linking straight
 * to its Overview page — the landing page shown when clicking "Components"
 * in the navbar, for quick visual browsing instead of hunting through the
 * sidebar tree. Icons are emoji placeholders until a proper icon set is
 * designed for this gallery, except for slugs in `componentIconImages`,
 * which use real Material Rounded icons on a secondary.main tile. */
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
