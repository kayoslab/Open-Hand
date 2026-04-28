import type { ReactNode } from 'react';
import type { Card } from '../../domain/card';
import styles from './CardVisual.module.css';

interface CardVisualProps {
  card: Card;
  pairedCard?: Card;
  onPairClick?: (cardNumber: number) => void;
  children?: ReactNode;
  className?: string;
}

const tierClass: Record<Card['tier'], string> = {
  Open: styles.tierOpen,
  Working: styles.tierWorking,
  Deep: styles.tierDeep,
};

export function CardVisual({ card, pairedCard, onPairClick, children, className }: CardVisualProps) {
  return (
    <article
      className={`${styles.card} ${tierClass[card.tier]}${className ? ` ${className}` : ''}`}
      data-tier={card.tier}
      data-card-number={card.cardNumber}
    >
      <div className={styles.tierMarker}>{card.tier}</div>
      <h3 className={styles.title}>{card.prompt}</h3>
      <p className={styles.question}>{card.guidance}</p>
      <span className={styles.category}>{card.category}</span>
      {card.flavourText !== '' && (
        <p className={styles.flavourText}>{card.flavourText}</p>
      )}
      {pairedCard && (
        <div className={styles.pairing}>
          <button
            type="button"
            className={`${styles.pairingLink} ${tierClass[pairedCard.tier]}`}
            onClick={() => onPairClick?.(pairedCard.cardNumber)}
          >
            Pairs with {pairedCard.prompt}
          </button>
        </div>
      )}
      {children}
    </article>
  );
}
