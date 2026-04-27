import { useState } from 'react';
import type { Tier } from '../../domain/card';
import { filterByTier } from '../../domain/filterCards';
import { cardDeck } from '../../data/loadCardDeck';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import { TierFilter } from '../../ui/TierFilter/TierFilter';
import styles from './BrowseAllCards.module.css';

export function BrowseAllCards() {
  const [activeTiers, setActiveTiers] = useState<Set<Tier>>(new Set());

  const handleToggle = (tier: Tier) => {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const handleClear = () => setActiveTiers(new Set());

  if (cardDeck.length === 0) {
    return (
      <div className={styles.page}>
        <h2 className={styles.heading}>Browse All Cards</h2>
        <p className={styles.emptyState}>No cards available</p>
      </div>
    );
  }

  const filteredCards = filterByTier(cardDeck, activeTiers);

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Browse All Cards</h2>
      <TierFilter activeTiers={activeTiers} onToggle={handleToggle} onClear={handleClear} />
      <span className={styles.count}>{filteredCards.length} cards</span>
      <div className={styles.grid}>
        {filteredCards.map((card) => (
          <CardVisual key={card.cardNumber} card={card} />
        ))}
      </div>
    </div>
  );
}
