import { describe, it, expect, beforeAll } from 'vitest';
import type { Card } from '../../src/domain/card';
import {
  createDrawPool,
  drawOne,
  resetPool,
  type DrawPool,
} from '../../src/domain/drawRandom';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCard(n: number): Card {
  return {
    cardNumber: n,
    category: 'Working Together',
    tier: 'Open',
    prompt: `Prompt ${n}`,
    guidance: `Guidance ${n}`,
    flavourText: `Flavour ${n}`,
  };
}

function makeCards(count: number): Card[] {
  return Array.from({ length: count }, (_, i) => makeCard(i + 1));
}

// ---------------------------------------------------------------------------
// drawThree
// ---------------------------------------------------------------------------

describe('drawThree', () => {
  // Dynamic import so the test file compiles before drawThree is implemented
  let drawThree: (pool: DrawPool) => { cards: Card[]; pool: DrawPool };

  beforeAll(async () => {
    const mod = await import('../../src/domain/drawRandom');
    drawThree = mod.drawThree;
  });

  it('returns exactly 3 unique cards from a standard pool', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    expect(result.cards.length).toBe(3);
    const numbers = result.cards.map((c) => c.cardNumber);
    expect(new Set(numbers).size).toBe(3);
  });

  it('returned cards are all valid cards from the deck', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    for (const card of result.cards) {
      expect(cards).toContainEqual(card);
    }
  });

  it('updates pool correctly: available decremented by 3, drawn incremented by 3', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    expect(result.pool.available.length).toBe(7);
    expect(result.pool.drawn.length).toBe(3);
  });

  it('drawn card numbers appear in the pool drawn list', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    for (const card of result.cards) {
      expect(result.pool.drawn).toContain(card.cardNumber);
    }
  });

  it('drawn cards are no longer in the available list', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    for (const card of result.cards) {
      expect(result.pool.available).not.toContain(card.cardNumber);
    }
  });

  it('does not mutate the original pool (pure function)', () => {
    const cards = makeCards(10);
    const pool = createDrawPool(cards);
    const originalAvailableLength = pool.available.length;
    const originalDrawnLength = pool.drawn.length;

    drawThree(pool);

    expect(pool.available.length).toBe(originalAvailableLength);
    expect(pool.drawn.length).toBe(originalDrawnLength);
  });

  it('handles pool with exactly 3 cards', () => {
    const cards = makeCards(3);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    expect(result.cards.length).toBe(3);
    expect(result.pool.available.length).toBe(0);
    expect(result.pool.drawn.length).toBe(3);
  });

  it('handles pool with 2 remaining cards (returns fewer than 3)', () => {
    const cards = makeCards(2);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    expect(result.cards.length).toBe(2);
    expect(result.pool.available.length).toBe(0);
    expect(result.pool.drawn.length).toBe(2);
  });

  it('handles pool with 1 remaining card (returns fewer than 3)', () => {
    const cards = makeCards(1);
    const pool = createDrawPool(cards);
    const result = drawThree(pool);

    expect(result.cards.length).toBe(1);
    expect(result.pool.available.length).toBe(0);
  });

  it('returns empty array on exhausted pool', () => {
    const cards = makeCards(3);
    let pool: DrawPool = createDrawPool(cards);

    // Exhaust the pool
    for (let i = 0; i < 3; i++) {
      const result = drawOne(pool);
      pool = result.pool;
    }

    const result = drawThree(pool);
    expect(result.cards.length).toBe(0);
    expect(result.pool.available.length).toBe(0);
  });

  it('sequential drawThree calls never produce duplicate cards', () => {
    const cards = makeCards(57);
    let pool: DrawPool = createDrawPool(cards);
    const allDrawnNumbers: number[] = [];

    // Draw 19 rounds of 3 = 57 cards total
    for (let i = 0; i < 19; i++) {
      const result = drawThree(pool);
      expect(result.cards.length).toBe(3);
      allDrawnNumbers.push(...result.cards.map((c) => c.cardNumber));
      pool = result.pool;
    }

    expect(new Set(allDrawnNumbers).size).toBe(57);
    expect(pool.available.length).toBe(0);
  });

  it('works correctly after a pool reset', () => {
    const cards = makeCards(10);
    let pool: DrawPool = createDrawPool(cards);

    // Draw once
    drawThree(pool);

    // Reset and draw again
    pool = resetPool(cards);
    const result = drawThree(pool);

    expect(result.cards.length).toBe(3);
    expect(result.pool.available.length).toBe(7);
  });
});
