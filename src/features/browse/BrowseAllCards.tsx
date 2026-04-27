import { useMemo, useState } from 'react';
import type { Card, Tier } from '../../domain/card';
import { filterByTier, filterByText } from '../../domain/filterCards';
import { cardDeck } from '../../data/loadCardDeck';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import { TierFilter } from '../../ui/TierFilter/TierFilter';
import { SearchInput } from '../../ui/SearchInput/SearchInput';
import styles from './BrowseAllCards.module.css';

export function BrowseAllCards() {
  const [activeTiers, setActiveTiers] = useState<Set<Tier>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const cardLookup = useMemo(() => {
    const map = new Map<number, Card>();
    for (const card of cardDeck) {
      map.set(card.cardNumber, card);
    }
    return map;
  }, []);

  const handlePairClick = (cardNumber: number) => {
    const target = document.querySelector(`[data-card-number="${cardNumber}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

  const filteredCards = filterByText(filterByTier(cardDeck, activeTiers), searchQuery);
  const hasActiveSearch = searchQuery.trim() !== '';

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Browse All Cards</h2>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <TierFilter activeTiers={activeTiers} onToggle={handleToggle} onClear={handleClear} />
      <span className={styles.count}>{filteredCards.length} cards</span>
      {filteredCards.length === 0 && hasActiveSearch ? (
        <p className={styles.emptyState}>No cards match your search.</p>
      ) : (
        <div className={styles.grid}>
          {filteredCards.map((card) => {
            const paired = card.pairsWith != null
              ? cardLookup.get(card.pairsWith)
              : undefined;
            return (
              <CardVisual key={card.cardNumber} card={card}>
                {paired && (
                  <div className={styles.pairing}>
                    <button
                      type="button"
                      className={styles.pairingLink}
                      onClick={() => handlePairClick(paired.cardNumber)}
                    >
                      Pairs with
                    </button>
                  </div>
                )}
              </CardVisual>
            );
          })}
        </div>
      )}
    </div>
  );
}
