import styles from './About.module.css';

export function About() {
  return (
    <article className={styles.page}>
      <h1 className={styles.title}>About Open Hand</h1>
      <p>
        Open Hand exists because better conversations don't happen by accident.
        They need structure, permission, and a little randomness.
      </p>

      <h2>Why This Exists</h2>
      <p>
        Most 1:1s default to status updates. Most feedback conversations never
        happen. Open Hand is a physical tool that makes both easier — not by
        scripting the conversation, but by giving it a starting point worth
        following.
      </p>

      <h2>Design Philosophy</h2>
      <p>
        The deck is intentionally constrained: 57 cards, three tiers, four
        categories. Constraints create safety. The tier system lets users
        calibrate depth. The pairing system rewards repeat use. The rituals
        protect vulnerability.
      </p>
    </article>
  );
}
