import { describe, it, expect } from 'vitest';
import type { Card, Tier } from '../../src/domain/card';

/**
 * US-012: Add tier filters
 *
 * Tests for the filterByTier pure function that filters a Card array
 * by a set of active tiers. When no tiers are selected, all cards
 * are returned (no filter active).
 */

function makeCard(overrides: Partial<Card> & { cardNumber: number }): Card {
  return {
    category: 'Infrastructure',
    tier: 'Open',
    prompt: 'Test prompt',
    guidance: 'Test guidance',
    flavourText: '',
    ...overrides,
  };
}

describe('US-012: filterByTier', () => {
  async function loadFilter(): Promise<(cards: Card[], tiers: Set<Tier>) => Card[]> {
    const mod = await import('../../src/domain/filterCards');
    return mod.filterByTier;
  }

  describe('no filter active (empty tier set)', () => {
    it('returns all cards when no tiers are selected', async () => {
      const filterByTier = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ];

      const result = filterByTier(cards, new Set());
      expect(result).toEqual(cards);
    });

    it('returns all cards for a large deck when no tiers are selected', async () => {
      const filterByTier = await loadFilter();
      const cards = Array.from({ length: 57 }, (_, i) =>
        makeCard({
          cardNumber: i + 1,
          tier: (['Open', 'Working', 'Deep'] as const)[i % 3],
        })
      );

      const result = filterByTier(cards, new Set());
      expect(result).toHaveLength(57);
    });
  });

  describe('single tier filters', () => {
    const allCards = [
      makeCard({ cardNumber: 1, tier: 'Open' }),
      makeCard({ cardNumber: 2, tier: 'Working' }),
      makeCard({ cardNumber: 3, tier: 'Deep' }),
      makeCard({ cardNumber: 4, tier: 'Open' }),
      makeCard({ cardNumber: 5, tier: 'Working' }),
    ];

    it('filters to Open cards only', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Open']));
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.tier === 'Open')).toBe(true);
    });

    it('filters to Working cards only', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Working']));
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.tier === 'Working')).toBe(true);
    });

    it('filters to Deep cards only', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Deep']));
      expect(result).toHaveLength(1);
      expect(result[0].tier).toBe('Deep');
      expect(result[0].cardNumber).toBe(3);
    });
  });

  describe('multiple tier filters', () => {
    const allCards = [
      makeCard({ cardNumber: 1, tier: 'Open' }),
      makeCard({ cardNumber: 2, tier: 'Working' }),
      makeCard({ cardNumber: 3, tier: 'Deep' }),
      makeCard({ cardNumber: 4, tier: 'Open' }),
    ];

    it('filters to Open and Deep when both are active', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Open', 'Deep']));
      expect(result).toHaveLength(3);
      expect(result.every((c) => c.tier === 'Open' || c.tier === 'Deep')).toBe(true);
    });

    it('filters to Working and Deep when both are active', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Working', 'Deep']));
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.tier === 'Working' || c.tier === 'Deep')).toBe(true);
    });

    it('returns all cards when all three tiers are active', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier(allCards, new Set<Tier>(['Open', 'Working', 'Deep']));
      expect(result).toEqual(allCards);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when no cards match the selected tier', async () => {
      const filterByTier = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Open' }),
      ];

      const result = filterByTier(cards, new Set<Tier>(['Deep']));
      expect(result).toHaveLength(0);
    });

    it('handles empty input array', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier([], new Set<Tier>(['Open']));
      expect(result).toHaveLength(0);
    });

    it('handles empty input array with no tiers selected', async () => {
      const filterByTier = await loadFilter();

      const result = filterByTier([], new Set());
      expect(result).toHaveLength(0);
    });

    it('preserves original card order', async () => {
      const filterByTier = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 5, tier: 'Open' }),
        makeCard({ cardNumber: 1, tier: 'Deep' }),
        makeCard({ cardNumber: 3, tier: 'Open' }),
      ];

      const result = filterByTier(cards, new Set<Tier>(['Open']));
      expect(result[0].cardNumber).toBe(5);
      expect(result[1].cardNumber).toBe(3);
    });

    it('does not mutate the original array', async () => {
      const filterByTier = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ];
      const originalLength = cards.length;

      filterByTier(cards, new Set<Tier>(['Open']));
      expect(cards).toHaveLength(originalLength);
    });
  });
});
