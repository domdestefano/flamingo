import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  to: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'About',
    icon: '🚀',
    description: (
      <>
        Team &amp; comms, contribution process, asset creation — everything you
        need to start working with Flamingo.
      </>
    ),
    to: '/getting-started/team-and-comms',
  },
  {
    title: 'Components',
    icon: '🧩',
    description: (
      <>
        Buttons, form controls, feedback, navigation, overlays, and more — every
        Flamingo component with live examples, guidelines, and code.
      </>
    ),
    to: '/components/about/all-components',
  },
  {
    title: 'Tokens',
    icon: '🎨',
    description: (
      <>
        Color, typography, spacing, and other foundational tokens that keep every
        rider-app brand visually consistent.
      </>
    ),
    to: '/tokens/overview',
  },
];

function Feature({title, icon, description, to}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={to} className={clsx(styles.featureCard, 'flamingo-card')}>
        <span className={styles.featureIcon} aria-hidden="true">
          {icon}
        </span>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
