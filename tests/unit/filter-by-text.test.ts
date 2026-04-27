import { describe, it, expect } from 'vitest';
import type { Card } from '../../src/domain/card';

/**
 * US-013: Add text search
 *
 * Tests for the filterByText pure function that filters a Card array
 * by a search query string. Matches against card.prompt (title) and
 * card.guidance (question text). Case-insensitive. Returns all cards
 * when query is empty or whitespace-only.
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

describe('US-013: filterByText', () => {
  async function loadFilter(): Promise<(cards: Card[], query: string) => Card[]> {
    const mod = await import('../../src/domain/filterCards');
    return mod.filterByText;
  }

  describe('matches on prompt (title)', () => {
    it('returns cards whose prompt contains the query', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Check In', guidance: 'How are you?' }),
        makeCard({ cardNumber: 2, prompt: 'Feedback Loop', guidance: 'What went well?' }),
        makeCard({ cardNumber: 3, prompt: 'Growth Plan', guidance: 'Where next?' }),
      ];

      const result = filterByText(cards, 'Feedback');
      expect(result).toHaveLength(1);
      expect(result[0].cardNumber).toBe(2);
    });

    it('returns multiple cards when several prompts match', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Check In' }),
        makeCard({ cardNumber: 2, prompt: 'Check Out' }),
        makeCard({ cardNumber: 3, prompt: 'Growth Plan' }),
      ];

      const result = filterByText(cards, 'Check');
      expect(result).toHaveLength(2);
      expect(result[0].cardNumber).toBe(1);
      expect(result[1].cardNumber).toBe(2);
    });
  });

  describe('matches on guidance (question text)', () => {
    it('returns cards whose guidance contains the query', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Card A', guidance: 'How are you arriving today?' }),
        makeCard({ cardNumber: 2, prompt: 'Card B', guidance: 'What feedback do you need?' }),
        makeCard({ cardNumber: 3, prompt: 'Card C', guidance: 'Where do you want to grow?' }),
      ];

      const result = filterByText(cards, 'feedback');
      expect(result).toHaveLength(1);
      expect(result[0].cardNumber).toBe(2);
    });
  });

  describe('case-insensitive matching', () => {
    it('matches uppercase query against lowercase prompt', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'feedback session' }),
      ];

      const result = filterByText(cards, 'FEEDBACK');
      expect(result).toHaveLength(1);
      expect(result[0].cardNumber).toBe(1);
    });

    it('matches lowercase query against uppercase guidance', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, guidance: 'IMPORTANT QUESTION' }),
      ];

      const result = filterByText(cards, 'important');
      expect(result).toHaveLength(1);
    });

    it('matches mixed-case query against mixed-case content', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Growth Direction' }),
      ];

      const result = filterByText(cards, 'gRoWtH');
      expect(result).toHaveLength(1);
    });
  });

  describe('empty and whitespace queries', () => {
    it('returns all cards when query is an empty string', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1 }),
        makeCard({ cardNumber: 2 }),
        makeCard({ cardNumber: 3 }),
      ];

      const result = filterByText(cards, '');
      expect(result).toEqual(cards);
    });

    it('returns all cards when query is whitespace only', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1 }),
        makeCard({ cardNumber: 2 }),
      ];

      const result = filterByText(cards, '   ');
      expect(result).toEqual(cards);
    });
  });

  describe('no matches', () => {
    it('returns empty array when no cards match the query', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Check In', guidance: 'How are you?' }),
        makeCard({ cardNumber: 2, prompt: 'Feedback', guidance: 'What went well?' }),
      ];

      const result = filterByText(cards, 'zzzzxyz');
      expect(result).toHaveLength(0);
    });
  });

  describe('matches across both fields', () => {
    it('returns a card that matches in prompt but not guidance', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop', guidance: 'Unrelated guidance' }),
      ];

      const result = filterByText(cards, 'Feedback');
      expect(result).toHaveLength(1);
    });

    it('returns a card that matches in guidance but not prompt', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Card Title', guidance: 'Give feedback here' }),
      ];

      const result = filterByText(cards, 'feedback');
      expect(result).toHaveLength(1);
    });

    it('does not duplicate a card that matches in both fields', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop', guidance: 'Give feedback regularly' }),
      ];

      const result = filterByText(cards, 'feedback');
      expect(result).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('handles empty input array', async () => {
      const filterByText = await loadFilter();

      const result = filterByText([], 'test');
      expect(result).toHaveLength(0);
    });

    it('preserves original card order', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 5, prompt: 'Check In' }),
        makeCard({ cardNumber: 1, prompt: 'Check Out' }),
        makeCard({ cardNumber: 3, prompt: 'Check Up' }),
      ];

      const result = filterByText(cards, 'Check');
      expect(result[0].cardNumber).toBe(5);
      expect(result[1].cardNumber).toBe(1);
      expect(result[2].cardNumber).toBe(3);
    });

    it('does not mutate the original array', async () => {
      const filterByText = await loadFilter();
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'Match this' }),
        makeCard({ cardNumber: 2, prompt: 'Not this' }),
      ];
      const originalLength = cards.length;

      filterByText(cards, 'Match');
      expect(cards).toHaveLength(originalLength);
    });
  });

  describe('filter composition with filterByTier', () => {
    it('correctly narrows results through both tier and text filters', async () => {
      const mod = await import('../../src/domain/filterCards');
      const cards = [
        makeCard({ cardNumber: 1, tier: 'Open', prompt: 'Feedback Start' }),
        makeCard({ cardNumber: 2, tier: 'Working', prompt: 'Feedback Deep Dive' }),
        makeCard({ cardNumber: 3, tier: 'Open', prompt: 'Growth Plan' }),
        makeCard({ cardNumber: 4, tier: 'Deep', prompt: 'Feedback Repair' }),
      ];

      const tierFiltered = mod.filterByTier(cards, new Set(['Open'] as const));
      const result = mod.filterByText(tierFiltered, 'Feedback');

      expect(result).toHaveLength(1);
      expect(result[0].cardNumber).toBe(1);
      expect(result[0].tier).toBe('Open');
      expect(result[0].prompt).toContain('Feedback');
    });
  });
});
