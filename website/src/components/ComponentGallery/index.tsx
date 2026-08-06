import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { galleryCategories } from './data';
import styles from './styles.module.css';

function Thumbnail({ item }: { item: (typeof galleryCategories)[number]['items'][number] }) {
  const imageUrl = useBaseUrl(item.image ?? '');
  return (
    <Link to={item.href} className={styles.card}>
      <div className={`${styles.thumbnail} flamingo-checkerboard`}>
        {item.image ? (
          <img src={imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <span className={styles.thumbnailFallback}>{item.title}</span>
        )}
      </div>
      <span className={styles.cardTitle}>{item.title}</span>
    </Link>
  );
}

/** Full grid of every component, grouped by category, each linking straight
 * to its Overview page — the landing page shown when clicking "Components"
 * in the navbar, for quick visual browsing instead of hunting through the
 * sidebar tree. */
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
