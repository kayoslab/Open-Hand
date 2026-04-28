import { useMemo } from 'react';
import type { Card, Tier } from '../../domain/card';
import { filterByTier, filterByText } from '../../domain/filterCards';
import { cardDeck } from '../../data/loadCardDeck';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import { TierFilter } from '../../ui/TierFilter/TierFilter';
import { SearchInput } from '../../ui/SearchInput/SearchInput';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { validateTierArray, validateSearchQuery } from '../../domain/preferences';
import styles from './BrowseAllCards.module.css';

export function BrowseAllCards() {
  const [tierArray, setTierArray] = useLocalStorage<Tier[]>('openhand:activeTiers', [], validateTierArray);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('openhand:searchQuery', '', validateSearchQuery);
  const activeTiers = useMemo(() => new Set(tierArray), [tierArray]);

  const cardLookup = useMemo(() => {
    const map = new Map<number, Card>();
    for (const card of cardDeck) {
      map.set(card.cardNumber, card);
    }
    return map;
  }, []);

  const handlePairClick = (cardNumber: number) => {
    const target = document.querySelector(`[data-card-number="${cardNumber}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('card-highlight');
    // Force reflow so re-adding the class restarts the animation
    void (target as HTMLElement).offsetWidth;
    target.classList.add('card-highlight');
    const cleanup = () => target.classList.remove('card-highlight');
    target.addEventListener('animationend', cleanup, { once: true });
    // Fallback for reduced-motion (animationend won't fire)
    setTimeout(cleanup, 1000);
  };

  const handleToggle = (tier: Tier) => {
    const set = new Set(tierArray);
    if (set.has(tier)) {
      set.delete(tier);
    } else {
      set.add(tier);
    }
    setTierArray([...set]);
  };

  const handleClear = () => setTierArray([]);

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
  const infraCards = filteredCards.filter((c) => c.category === 'Infrastructure');
  const questionCards = filteredCards.filter((c) => c.category !== 'Infrastructure');

  const renderCard = (card: Card) => {
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
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Browse All Cards</h2>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <TierFilter activeTiers={activeTiers} onToggle={handleToggle} onClear={handleClear} />
      <span className={styles.count}>{filteredCards.length} cards</span>
      {filteredCards.length === 0 && hasActiveSearch ? (
        <p className={styles.emptyState}>No cards match your search.</p>
      ) : (
        <>
          {infraCards.length > 0 && (
            <section className={styles.ritualSection}>
              <h3 className={styles.sectionHeading}>Ritual Cards</h3>
              <p className={styles.sectionDesc}>
                Bookends and rules of play. Used every conversation.
              </p>
              <div className={styles.ritualGrid}>
                {infraCards.map(renderCard)}
              </div>
            </section>
          )}
          {questionCards.length > 0 && (
            <div className={styles.grid}>
              {questionCards.map(renderCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
