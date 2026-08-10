import React from 'react';
import Heading from '@theme/Heading';
import BrandSwitcher from '@site/src/components/BrandSwitcher';
import styles from './styles.module.css';

/**
 * Renders the page's H1 alongside the brand switcher on the same row (the
 * switcher right-aligned to the title). Requires `hide_title: true` in the
 * page's frontmatter, since Docusaurus otherwise renders its own H1 above
 * the MDX body content — there's no way to inject into that from below.
 */
export default function PageHeaderWithBrandSwitcher({ title }: { title: string }): React.ReactElement {
  return (
    <div className={styles.header}>
      <Heading as="h1">{title}</Heading>
      <BrandSwitcher />
    </div>
  );
}
