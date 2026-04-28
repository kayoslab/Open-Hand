import styles from './Resources.module.css';

export function Resources() {
  return (
    <article className={styles.page}>
      <h1 className={styles.title}>Resources</h1>
      <p>
        Everything you need to get the most out of Open Hand.
      </p>

      <h2>Play Guide</h2>
      <p>
        The printable play guide covers deck structure, the three-tier system,
        and three ways to play. It fits on an A6 card — print double-sided and
        keep it with your deck.
      </p>

      <h2>Facilitation Tips</h2>
      <p>
        Permission is a deck rule, not a card type. Always preface Deep cards
        with an opt-out. Use "And what else?" after every answer. End every
        conversation with the closer card.
      </p>

      <h2>Further Reading</h2>
      <p>
        Articles and thought pieces on conversations, feedback, and building
        trust in teams. Coming soon.
      </p>
    </article>
  );
}
