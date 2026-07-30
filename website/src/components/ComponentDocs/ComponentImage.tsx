import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/** Renders a static component reference image (anatomy, states, etc.) pulled from Figma. */
export default function ComponentImage({ src, alt }: { src: string; alt: string }) {
  const url = useBaseUrl(src);
  return <img src={url} alt={alt} className={styles.componentImage} />;
}
