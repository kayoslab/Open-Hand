import { useCallback, useRef, useState } from 'react';
import type { Card } from '../../domain/card';
import { createDrawPool, drawOne, resetPool } from '../../domain/drawRandom';
import type { DrawPool } from '../../domain/drawRandom';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import cardStyles from '../../ui/CardVisual/CardVisual.module.css';
import styles from './SingleDraw.module.css';

interface SingleDrawProps {
  cards: Card[];
}

export function SingleDraw({ cards }: SingleDrawProps) {
  const poolRef = useRef<DrawPool>(createDrawPool(cards));
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [remaining, setRemaining] = useState(cards.length);

  const exhausted = remaining === 0;

  const handleDraw = useCallback(() => {
    const result = drawOne(poolRef.current);
    poolRef.current = result.pool;
    setRemaining(result.pool.available.length);
    if (result.card) {
      setCurrentCard(result.card);
    }
  }, []);

  const handleReset = useCallback(() => {
    poolRef.current = resetPool(cards);
    setRemaining(cards.length);
    setCurrentCard(null);
  }, [cards]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Random Draw</h2>
      <p className={styles.remaining}>
        {remaining} of {cards.length} remaining
      </p>
      <div className={styles.actions}>
        <button
          className={styles.drawButton}
          onClick={handleDraw}
          disabled={exhausted}
        >
          Draw
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
      {currentCard && (
        <div className={styles.cardArea} key={currentCard.cardNumber}>
          <CardVisual card={currentCard} className={cardStyles.cardEnter} />
        </div>
      )}
    </div>
  );
}
