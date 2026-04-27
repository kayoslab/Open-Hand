import { cardDeck } from '../../data/loadCardDeck';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import styles from './BrowseAllCards.module.css';

export function BrowseAllCards() {
  if (cardDeck.length === 0) {
    return (
      <div className={styles.page}>
        <h2 className={styles.heading}>Browse All Cards</h2>
        <p className={styles.emptyState}>No cards available</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Browse All Cards</h2>
      <span className={styles.count}>{cardDeck.length} cards</span>
      <div className={styles.grid}>
        {cardDeck.map((card) => (
          <CardVisual key={card.cardNumber} card={card} />
        ))}
      </div>
    </div>
  );
}
