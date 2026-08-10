import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const logoUrl = useBaseUrl('img/flamingo-logo-white.png');
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img className={styles.heroLogo} src={logoUrl} alt="" aria-hidden="true" />
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <HomepageFeatures />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Flamingo is Delivery Hero's rider-app design system — tokens, components, and guidelines for building consistent rider experiences across brands and platforms.">
      <HomepageHeader />
    </Layout>
  );
}
