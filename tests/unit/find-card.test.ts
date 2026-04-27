import { describe, it, expect } from 'vitest';
import type { Card } from '../../src/domain/card';

/**
 * US-016: findCardByNumber
 *
 * Pure helper that resolves a card number to a Card object.
 * Used for resolving pairsWith references.
 */

function makeCard(overrides: Partial<Card> & { cardNumber: number }): Card {
  return {
    category: 'Working Together',
    tier: 'Open',
    prompt: 'Test prompt',
    guidance: 'Test guidance',
    flavourText: '',
    ...overrides,
  };
}

describe('US-016: findCardByNumber', () => {
  async function loadFinder(): Promise<
    (cards: Card[], cardNumber: number) => Card | undefined
  > {
    const mod = await import('../../src/domain/findCard');
    return mod.findCardByNumber;
  }

  it('returns the card when a matching card number exists', async () => {
    const findCardByNumber = await loadFinder();
    const cards = [
      makeCard({ cardNumber: 1, prompt: 'First' }),
      makeCard({ cardNumber: 2, prompt: 'Second' }),
      makeCard({ cardNumber: 3, prompt: 'Third' }),
    ];

    const result = findCardByNumber(cards, 2);

    expect(result).toBeDefined();
    expect(result!.cardNumber).toBe(2);
    expect(result!.prompt).toBe('Second');
  });

  it('returns undefined when no card matches the given number', async () => {
    const findCardByNumber = await loadFinder();
    const cards = [
      makeCard({ cardNumber: 1 }),
      makeCard({ cardNumber: 2 }),
    ];

    const result = findCardByNumber(cards, 99);

    expect(result).toBeUndefined();
  });

  it('returns undefined when the cards array is empty', async () => {
    const findCardByNumber = await loadFinder();

    const result = findCardByNumber([], 1);

    expect(result).toBeUndefined();
  });

  it('returns the first card in a single-element array', async () => {
    const findCardByNumber = await loadFinder();
    const cards = [makeCard({ cardNumber: 42, prompt: 'Only card' })];

    const result = findCardByNumber(cards, 42);

    expect(result).toBeDefined();
    expect(result!.prompt).toBe('Only card');
  });

  it('returns the correct card when multiple cards exist', async () => {
    const findCardByNumber = await loadFinder();
    const cards = Array.from({ length: 57 }, (_, i) =>
      makeCard({ cardNumber: i + 1, prompt: `Card ${i + 1}` }),
    );

    const result = findCardByNumber(cards, 57);

    expect(result).toBeDefined();
    expect(result!.cardNumber).toBe(57);
    expect(result!.prompt).toBe('Card 57');
  });
});
