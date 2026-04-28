import styles from './HomePage.module.css';

const features = [
  {
    title: 'Strengthen relationships',
    description: 'Build trust and understanding.',
  },
  {
    title: 'Drive growth',
    description: 'Ask better questions. Get better answers.',
  },
  {
    title: 'Designed for 1:1s',
    description: 'Low stakes. Powerful. Human.',
  },
  {
    title: 'Safe by design',
    description: 'Permission-led. Respectful.',
  },
];

export function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heading}>
              Better conversations start with the right questions.
            </h1>
            <p className={styles.subtext}>
              Open Hand is a 57-card conversation deck for better 1:1s.
              <br />
              Build trust. Drive growth.
              <br />
              Have conversations that matter.
            </p>
            <div className={styles.tierIndicators}>
              <span className={styles.tierDot} data-tier="open">
                <span className={styles.dot} style={{ background: 'var(--color-tier-open)' }} />
                Open
              </span>
              <span className={styles.tierDot} data-tier="working">
                <span className={styles.dot} style={{ background: 'var(--color-tier-working)' }} />
                Working
              </span>
              <span className={styles.tierDot} data-tier="deep">
                <span className={styles.dot} style={{ background: 'var(--color-tier-deep)' }} />
                Deep
              </span>
            </div>
            <div className={styles.heroCtas}>
              <a href="#/browse" className={styles.ctaPrimary}>
                Explore the Deck <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="#/guide" className={styles.ctaSecondary}>
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
