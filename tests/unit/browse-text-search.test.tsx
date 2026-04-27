import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Card } from '../../src/domain/card';

/**
 * US-013: Add text search — component integration tests
 *
 * Tests that the BrowseAllCards component integrates the search input
 * and filterByText logic correctly: results update without page reload,
 * no-results message is displayed, and search composes with tier filters.
 */

const mockCards: Card[] = [];
vi.mock('../../src/data/loadCardDeck', () => ({
  get cardDeck() {
    return mockCards;
  },
}));

const { BrowseAllCards } = await import('../../src/features/browse');

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    cardNumber: 1,
    category: 'Working Together',
    tier: 'Open',
    prompt: 'Check In',
    guidance: 'How are you arriving today?',
    flavourText: 'Start with presence.',
    ...overrides,
  };
}

function fillMockCards(cards: Card[]) {
  mockCards.length = 0;
  mockCards.push(...cards);
}

describe('US-013: BrowseAllCards text search', () => {
  describe('search input rendering', () => {
    it('renders a search input on the browse page', () => {
      fillMockCards([makeCard()]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeDefined();
    });

    it('search input has an accessible label', () => {
      fillMockCards([makeCard()]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      expect(
        searchInput.getAttribute('aria-label') ||
        searchInput.getAttribute('aria-labelledby')
      ).toBeTruthy();
    });
  });

  describe('results update without page reload', () => {
    it('typing in search input filters displayed cards immediately', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
        makeCard({ cardNumber: 2, prompt: 'Check In' }),
        makeCard({ cardNumber: 3, prompt: 'Growth Plan' }),
      ]);

      render(<BrowseAllCards />);

      expect(screen.getAllByRole('article')).toHaveLength(3);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Feedback' } });

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
    });

    it('search matches on guidance text', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Card A', guidance: 'What feedback do you need?' }),
        makeCard({ cardNumber: 2, prompt: 'Card B', guidance: 'Where do you want to grow?' }),
      ]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'feedback' } });

      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.getByText('Card A')).toBeDefined();
    });

    it('search is case-insensitive', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
        makeCard({ cardNumber: 2, prompt: 'Growth Plan' }),
      ]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'FEEDBACK' } });

      expect(screen.getAllByRole('article')).toHaveLength(1);
    });

    it('clearing search input restores all cards', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
        makeCard({ cardNumber: 2, prompt: 'Check In' }),
      ]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Feedback' } });
      expect(screen.getAllByRole('article')).toHaveLength(1);

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });
  });

  describe('no-results message', () => {
    it('displays a no-results message when search matches nothing', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
        makeCard({ cardNumber: 2, prompt: 'Check In' }),
      ]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'zzzzxyz' } });

      expect(screen.queryAllByRole('article')).toHaveLength(0);
      expect(screen.getByText(/no cards match/i)).toBeDefined();
    });

    it('no-results message is not shown when there are matching cards', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
      ]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Feedback' } });

      expect(screen.getAllByRole('article')).toHaveLength(1);
      expect(screen.queryByText(/no cards match/i)).toBeNull();
    });
  });

  describe('search composes with tier filter', () => {
    it('applies both text search and tier filter together', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open', prompt: 'Feedback Start' }),
        makeCard({ cardNumber: 2, tier: 'Working', prompt: 'Feedback Deep Dive' }),
        makeCard({ cardNumber: 3, tier: 'Open', prompt: 'Growth Plan' }),
        makeCard({ cardNumber: 4, tier: 'Deep', prompt: 'Feedback Repair' }),
      ]);

      render(<BrowseAllCards />);

      // Filter by Open tier
      fireEvent.click(screen.getByRole('button', { name: /open/i }));
      expect(screen.getAllByRole('article')).toHaveLength(2);

      // Also search for "Feedback"
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Feedback' } });

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
      expect(screen.getByText('Feedback Start')).toBeDefined();
    });
  });

  describe('card count updates with search', () => {
    it('card count reflects the filtered results', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Feedback Loop' }),
        makeCard({ cardNumber: 2, prompt: 'Check In' }),
        makeCard({ cardNumber: 3, prompt: 'Growth Plan' }),
      ]);

      render(<BrowseAllCards />);

      expect(screen.getByText('3 cards')).toBeDefined();

      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Feedback' } });

      expect(screen.getByText(/1 cards?/)).toBeDefined();
    });
  });
});
