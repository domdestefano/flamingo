import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export type TabDef = { label: string; slug: string };

const TABS: TabDef[] = [
  { label: 'Overview', slug: 'overview' },
  { label: 'Guidelines', slug: 'guidelines' },
  { label: 'Content', slug: 'content' },
  { label: 'Change log', slug: 'change-log' },
  { label: 'Code - Web', slug: 'code-web' },
];

/**
 * Inline tab bar linking to a page's sibling routes, so you can switch
 * between them without going back to the sidebar — mirrors the tab bar on
 * the published Flamingo site. Each "tab" is a real page/route, not a
 * client-side content swap, since these pages can be heavy (Storybook
 * embeds, images).
 *
 * Defaults to the standard component doc tabs (Overview / Guidelines /
 * Content / Change log / Code - Web). Pass `tabs` to reuse this same bar for
 * a different tab set, e.g. Getting Started's multi-tab process pages.
 *
 * Usage: <ComponentTabs basePath="/components/buttons/primary-button" />
 *        <ComponentTabs basePath="/getting-started/processes/contribution"
 *          tabs={[{ label: 'Process', slug: 'process' }, ...]} />
 */
export default function ComponentTabs({
  basePath,
  tabs = TABS,
}: {
  basePath: string;
  tabs?: TabDef[];
}): React.ReactElement {
  const location = useLocation();
  const { siteConfig } = useDocusaurusContext();
  // location.pathname includes the site's baseUrl (e.g. "/flamingo/"), but
  // basePath is written baseUrl-relative in every call site, so it must be
  // prefixed here before comparing — otherwise isActive is always false.
  const baseUrl = siteConfig.baseUrl.replace(/\/$/, '');

  return (
    <div className={styles.componentTabs} role="tablist">
      {tabs.map((tab) => {
        const href = `${basePath}/${tab.slug}`;
        const isActive = location.pathname.replace(/\/$/, '') === `${baseUrl}${href}`;
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
