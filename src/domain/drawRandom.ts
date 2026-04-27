import type { Card } from './card';

export interface DrawPool {
  available: number[];
  drawn: number[];
  cards: Card[];
}

export function createDrawPool(cards: Card[]): DrawPool {
  return {
    available: cards.map((c) => c.cardNumber),
    drawn: [],
    cards,
  };
}

export function drawOne(pool: DrawPool): { card: Card | null; pool: DrawPool } {
  if (pool.available.length === 0) {
    return { card: null, pool };
  }

  const index = Math.floor(Math.random() * pool.available.length);
  const cardNumber = pool.available[index];
  const card = pool.cards.find((c) => c.cardNumber === cardNumber)!;

  return {
    card,
    pool: {
      ...pool,
      available: pool.available.filter((_, i) => i !== index),
      drawn: [...pool.drawn, cardNumber],
    },
  };
}

export function resetPool(cards: Card[]): DrawPool {
  return createDrawPool(cards);
}
