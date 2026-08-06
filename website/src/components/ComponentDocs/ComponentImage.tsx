import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/** Renders a static component reference image (anatomy, states, etc.) pulled from Figma. */
export default function ComponentImage({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  /** Max width in px — use for full-screen phone mockups shown side by side (Do/Don't pairs). */
  width?: number;
}) {
  const url = useBaseUrl(src);
  return (
    <div className={`${styles.componentImageFrame} flamingo-card flamingo-checkerboard`}>
      <img
        src={url}
        alt={alt}
        className={styles.componentImage}
        style={width ? { maxWidth: width } : undefined}
      />
    </div>
  );
}
