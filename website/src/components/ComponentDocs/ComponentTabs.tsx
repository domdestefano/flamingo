import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

const TABS = [
  { label: 'Overview', slug: 'overview' },
  { label: 'Guidelines', slug: 'guidelines' },
  { label: 'Content', slug: 'content' },
  { label: 'Change log', slug: 'change-log' },
  { label: 'Code - Web', slug: 'code-web' },
];

/**
 * Inline tab bar linking to a component's sibling pages (Overview,
 * Guidelines, Content, Change log, Code - Web), so you can switch between
 * them without going back to the sidebar — mirrors the tab bar on the
 * published Flamingo site. Each "tab" is a real page/route, not a
 * client-side content swap, since these pages can be heavy (Storybook
 * embeds, images).
 *
 * Usage: <ComponentTabs basePath="/components/buttons/primary-button" />
 */
export default function ComponentTabs({ basePath }: { basePath: string }): React.ReactElement {
  const location = useLocation();

  return (
    <div className={styles.componentTabs} role="tablist">
      {TABS.map((tab) => {
        const href = `${basePath}/${tab.slug}`;
        const isActive = location.pathname.replace(/\/$/, '') === href;
        return (
          <Link
            key={tab.slug}
            to={href}
            role="tab"
            aria-selected={isActive}
            className={isActive ? styles.componentTabActive : styles.componentTab}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
