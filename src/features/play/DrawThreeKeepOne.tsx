import { useCallback, useRef, useState } from 'react';
import type { Card } from '../../domain/card';
import { createDrawPool, drawThree, resetPool } from '../../domain/drawRandom';
import type { DrawPool } from '../../domain/drawRandom';
import { CardVisual } from '../../ui/CardVisual/CardVisual';
import cardStyles from '../../ui/CardVisual/CardVisual.module.css';
import styles from './DrawThreeKeepOne.module.css';

type Phase = 'ready' | 'choosing' | 'kept';

interface DrawThreeKeepOneProps {
  cards: Card[];
}

export function DrawThreeKeepOne({ cards }: DrawThreeKeepOneProps) {
  const poolRef = useRef<DrawPool>(createDrawPool(cards));
  const [phase, setPhase] = useState<Phase>('ready');
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [keptCard, setKeptCard] = useState<Card | null>(null);
  const [remaining, setRemaining] = useState(cards.length);
  const [drawCount, setDrawCount] = useState(0);

  const handleDraw = useCallback(() => {
    const result = drawThree(poolRef.current);
    poolRef.current = result.pool;
    setDrawnCards(result.cards);
    setRemaining(result.pool.available.length);
    setDrawCount((c) => c + 1);
    setPhase('choosing');
  }, []);

  const handleKeep = useCallback((card: Card) => {
    setKeptCard(card);
    setDrawnCards([]);
    setPhase('kept');
  }, []);

  const handleNewRound = useCallback(() => {
    const result = drawThree(poolRef.current);
    poolRef.current = result.pool;
    setDrawnCards(result.cards);
    setKeptCard(null);
    setRemaining(result.pool.available.length);
    setDrawCount((c) => c + 1);
    setPhase('choosing');
  }, []);

  const handleReset = useCallback(() => {
    poolRef.current = resetPool(cards);
    setRemaining(cards.length);
    setDrawnCards([]);
    setKeptCard(null);
    setPhase('ready');
  }, [cards]);

  const canDraw = remaining >= 1;
  const canNewRound = remaining >= 1;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Draw Three, Keep One</h2>
      <p className={styles.remaining}>
        {remaining} of {cards.length} remaining
      </p>

      <div className={styles.actions}>
        {phase === 'ready' && (
          <button
            className={styles.drawButton}
            onClick={handleDraw}
            disabled={!canDraw}
          >
            Draw
          </button>
        )}
        {phase === 'kept' && (
          <button
            className={styles.newRoundButton}
            onClick={handleNewRound}
            disabled={!canNewRound}
          >
            New Round
          </button>
        )}
        <button className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>

      {phase === 'choosing' && drawnCards.length > 0 && (
        <div className={styles.cardGrid} key={drawCount}>
          {drawnCards.map((card) => (
            <button
              key={card.cardNumber}
              className={styles.cardButton}
              onClick={() => handleKeep(card)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleKeep(card);
                }
              }}
              aria-label={`Keep card: ${card.prompt}`}
            >
              <CardVisual card={card} />
            </button>
          ))}
        </div>
      )}

      {phase === 'kept' && keptCard && (
        <div className={styles.keptArea} key={keptCard.cardNumber}>
          <CardVisual card={keptCard} className={cardStyles.cardEnter} />
        </div>
      )}
    </div>
  );
}
