import type { Card } from '../../domain/card';
import styles from './CardVisual.module.css';

interface CardVisualProps {
  card: Card;
}

const tierClass: Record<Card['tier'], string> = {
  Open: styles.tierOpen,
  Working: styles.tierWorking,
  Deep: styles.tierDeep,
};

export function CardVisual({ card }: CardVisualProps) {
  return (
    <article className={`${styles.card} ${tierClass[card.tier]}`} data-tier={card.tier}>
      <div className={styles.tierMarker}>{card.tier}</div>
      <h3 className={styles.title}>{card.prompt}</h3>
      <p className={styles.question}>{card.guidance}</p>
      <span className={styles.category}>{card.category}</span>
      {card.flavourText !== '' && (
        <p className={styles.flavourText}>{card.flavourText}</p>
      )}
    </article>
  );
}
