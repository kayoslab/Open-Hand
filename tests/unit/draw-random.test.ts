import { describe, it, expect } from 'vitest';
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
// createDrawPool
// ---------------------------------------------------------------------------

describe('createDrawPool', () => {
  it('creates a pool with all cards available', () => {
    const cards = makeCards(5);
    const pool = createDrawPool(cards);
    expect(pool.available.length).toBe(5);
    expect(pool.drawn.length).toBe(0);
  });

  it('works with a single-card deck', () => {
    const pool = createDrawPool([makeCard(1)]);
    expect(pool.available.length).toBe(1);
  });

  it('works with the full 57-card deck', () => {
    const pool = createDrawPool(makeCards(57));
    expect(pool.available.length).toBe(57);
    expect(pool.drawn.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// drawOne
// ---------------------------------------------------------------------------

describe('drawOne', () => {
  it('returns a valid card from the deck', () => {
    const cards = makeCards(5);
    const pool = createDrawPool(cards);
    const result = drawOne(pool);

    expect(result.card).toBeDefined();
    expect(result.card).not.toBeNull();
    expect(cards).toContainEqual(result.card);
  });

  it('removes the drawn card from the available pool', () => {
    const cards = makeCards(5);
    const pool = createDrawPool(cards);
    const result = drawOne(pool);

    expect(result.pool.available.length).toBe(4);
    expect(result.pool.drawn.length).toBe(1);
  });

  it('moves the drawn card into the drawn list', () => {
    const cards = makeCards(3);
    const pool = createDrawPool(cards);
    const result = drawOne(pool);

    expect(result.pool.drawn).toContain(result.card!.cardNumber);
  });

  it('does not mutate the original pool (pure function)', () => {
    const cards = makeCards(5);
    const pool = createDrawPool(cards);
    const originalAvailableLength = pool.available.length;

    drawOne(pool);

    expect(pool.available.length).toBe(originalAvailableLength);
  });

  it('draws all cards before any repeat (full cycle guarantee)', () => {
    const cards = makeCards(57);
    let pool: DrawPool = createDrawPool(cards);
    const drawnNumbers: number[] = [];

    for (let i = 0; i < 57; i++) {
      const result = drawOne(pool);
      expect(result.card).not.toBeNull();
      drawnNumbers.push(result.card!.cardNumber);
      pool = result.pool;
    }

    const uniqueNumbers = new Set(drawnNumbers);
    expect(uniqueNumbers.size).toBe(57);
  });

  it('signals exhaustion when pool is empty', () => {
    const cards = makeCards(3);
    let pool: DrawPool = createDrawPool(cards);

    // Draw all 3
    for (let i = 0; i < 3; i++) {
      const result = drawOne(pool);
      pool = result.pool;
    }

    // Next draw should signal exhaustion
    const result = drawOne(pool);
    expect(result.card).toBeNull();
    expect(result.pool.available.length).toBe(0);
  });

  it('handles single-card pool: draws that card then exhausts', () => {
    const cards = [makeCard(42)];
    let pool: DrawPool = createDrawPool(cards);

    const first = drawOne(pool);
    expect(first.card).not.toBeNull();
    expect(first.card!.cardNumber).toBe(42);
    pool = first.pool;

    const second = drawOne(pool);
    expect(second.card).toBeNull();
  });

  it('handles two-card pool correctly', () => {
    const cards = makeCards(2);
    let pool: DrawPool = createDrawPool(cards);
    const drawn: number[] = [];

    const r1 = drawOne(pool);
    expect(r1.card).not.toBeNull();
    drawn.push(r1.card!.cardNumber);
    pool = r1.pool;

    const r2 = drawOne(pool);
    expect(r2.card).not.toBeNull();
    drawn.push(r2.card!.cardNumber);
    pool = r2.pool;

    // Both cards drawn, no duplicates
    expect(new Set(drawn).size).toBe(2);

    // Now exhausted
    const r3 = drawOne(pool);
    expect(r3.card).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// resetPool
// ---------------------------------------------------------------------------

describe('resetPool', () => {
  it('restores all cards to the available pool', () => {
    const cards = makeCards(57);
    let pool: DrawPool = createDrawPool(cards);

    // Draw some cards
    for (let i = 0; i < 10; i++) {
      const result = drawOne(pool);
      pool = result.pool;
    }
    expect(pool.available.length).toBe(47);

    // Reset
    const fresh = resetPool(cards);
    expect(fresh.available.length).toBe(57);
    expect(fresh.drawn.length).toBe(0);
  });

  it('allows full draw cycle after reset', () => {
    const cards = makeCards(5);
    let pool: DrawPool = createDrawPool(cards);

    // Exhaust the pool
    for (let i = 0; i < 5; i++) {
      const result = drawOne(pool);
      pool = result.pool;
    }
    expect(drawOne(pool).card).toBeNull();

    // Reset and draw again
    pool = resetPool(cards);
    const drawn: number[] = [];
    for (let i = 0; i < 5; i++) {
      const result = drawOne(pool);
      expect(result.card).not.toBeNull();
      drawn.push(result.card!.cardNumber);
      pool = result.pool;
    }

    expect(new Set(drawn).size).toBe(5);
  });

  it('produces the same result as createDrawPool', () => {
    const cards = makeCards(10);
    const created = createDrawPool(cards);
    const reset = resetPool(cards);

    expect(reset.available.length).toBe(created.available.length);
    expect(reset.drawn.length).toBe(created.drawn.length);
  });
});
