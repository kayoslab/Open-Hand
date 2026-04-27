import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Card } from '../../src/domain/card';

// Mock the card deck data module so we can control what BrowseAllCards receives
const mockCards: Card[] = [];
vi.mock('../../src/data/loadCardDeck', () => ({
  get cardDeck() {
    return mockCards;
  },
}));

// Dynamic import after mock is set up
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

describe('BrowseAllCards', () => {
  describe('rendering all cards', () => {
    it('renders all cards from the dataset', () => {
      const cards = Array.from({ length: 57 }, (_, i) =>
        makeCard({ cardNumber: i + 1, prompt: `Card ${i + 1}` })
      );
      fillMockCards(cards);

      render(<BrowseAllCards />);

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(57);
    });

    it('renders each card using CardVisual with correct props', () => {
      const cards = [
        makeCard({ cardNumber: 1, prompt: 'First Card', tier: 'Open', category: 'Infrastructure' }),
        makeCard({ cardNumber: 57, prompt: 'Last Card', tier: 'Deep', category: 'Feedback and Repair' }),
      ];
      fillMockCards(cards);

      render(<BrowseAllCards />);

      // First card props rendered correctly
      expect(screen.getByText('First Card')).toBeDefined();
      expect(screen.getByText('Last Card')).toBeDefined();

      const articles = screen.getAllByRole('article');
      expect(articles[0].getAttribute('data-tier')).toBe('Open');
      expect(articles[1].getAttribute('data-tier')).toBe('Deep');
    });

    it('displays a heading for the page', () => {
      fillMockCards([makeCard()]);

      render(<BrowseAllCards />);

      const heading = screen.getByRole('heading', { name: /browse/i });
      expect(heading).toBeDefined();
    });
  });

  describe('empty state', () => {
    it('shows empty state message when card deck is empty', () => {
      fillMockCards([]);

      render(<BrowseAllCards />);

      expect(screen.getByText(/no cards/i)).toBeDefined();
    });

    it('does not render any card articles when deck is empty', () => {
      fillMockCards([]);

      render(<BrowseAllCards />);

      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });
  });

  describe('card grid container', () => {
    it('renders cards inside a grid container element', () => {
      const cards = [makeCard({ cardNumber: 1 }), makeCard({ cardNumber: 2 })];
      fillMockCards(cards);

      const { container } = render(<BrowseAllCards />);

      // The grid container should exist and contain the card articles
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(2);

      // All articles should share the same parent container
      const gridContainer = articles[0].parentElement;
      expect(gridContainer).toBeDefined();
      expect(gridContainer).toBe(articles[1].parentElement);
    });
  });
});
