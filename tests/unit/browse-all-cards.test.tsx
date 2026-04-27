import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

      render(<BrowseAllCards />);

      // The grid container should exist and contain the card articles
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(2);

      // All articles should share the same parent container
      const gridContainer = articles[0].parentElement;
      expect(gridContainer).toBeDefined();
      expect(gridContainer).toBe(articles[1].parentElement);
    });
  });

  describe('US-012: tier filter integration', () => {
    it('renders the tier filter component on the browse page', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ]);

      render(<BrowseAllCards />);

      // Tier filter buttons should be present
      expect(screen.getByRole('button', { name: /open/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /working/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /deep/i })).toBeDefined();
    });

    it('selecting a tier reduces displayed cards to that tier only', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
        makeCard({ cardNumber: 4, tier: 'Open' }),
      ]);

      render(<BrowseAllCards />);

      // Initially shows all 4 cards
      expect(screen.getAllByRole('article')).toHaveLength(4);

      // Click Open tier filter
      fireEvent.click(screen.getByRole('button', { name: /open/i }));

      // Should now show only 2 Open cards
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(2);
      expect(articles.every((a) => a.getAttribute('data-tier') === 'Open')).toBe(true);
    });

    it('multiple tiers can be active simultaneously', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ]);

      render(<BrowseAllCards />);

      // Select Open and Deep
      fireEvent.click(screen.getByRole('button', { name: /open/i }));
      fireEvent.click(screen.getByRole('button', { name: /deep/i }));

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(2);
      const tiers = articles.map((a) => a.getAttribute('data-tier'));
      expect(tiers).toContain('Open');
      expect(tiers).toContain('Deep');
    });

    it('toggling a tier off removes it from the active filter', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ]);

      render(<BrowseAllCards />);

      // Select Open, then toggle it off
      fireEvent.click(screen.getByRole('button', { name: /open/i }));
      expect(screen.getAllByRole('article')).toHaveLength(1);

      fireEvent.click(screen.getByRole('button', { name: /open/i }));
      // All cards should be shown again
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('clearing filters restores all cards', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ]);

      render(<BrowseAllCards />);

      // Select a tier to activate filtering
      fireEvent.click(screen.getByRole('button', { name: /working/i }));
      expect(screen.getAllByRole('article')).toHaveLength(1);

      // Click clear filters
      fireEvent.click(screen.getByRole('button', { name: /clear/i }));

      // All cards should be restored
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('card count updates when tier filter is applied', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ]);

      render(<BrowseAllCards />);

      // Initially shows total count
      expect(screen.getByText('3 cards')).toBeDefined();

      // Filter to Working only
      fireEvent.click(screen.getByRole('button', { name: /working/i }));
      expect(screen.getByText(/1 cards?/)).toBeDefined();
    });
  });

  describe('US-016: pairing references in browse view', () => {
    it('renders a pairing section on cards that have pairsWith references', () => {
      fillMockCards([
        makeCard({ cardNumber: 6, prompt: 'Card Six', pairsWith: 7 }),
        makeCard({ cardNumber: 7, prompt: 'Card Seven' }),
      ]);

      render(<BrowseAllCards />);

      expect(screen.getByText(/pairs with/i)).toBeDefined();
      expect(screen.getByText(/Card Seven/)).toBeDefined();
    });

    it('does not render a pairing section on cards without pairsWith', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'No Pair Card' }),
        makeCard({ cardNumber: 2, prompt: 'Also No Pair' }),
      ]);

      render(<BrowseAllCards />);

      expect(screen.queryByText(/pairs with/i)).toBeNull();
    });

    it('handles missing pair reference gracefully — no pairing section rendered', () => {
      // Card references a pairsWith card that does not exist in the deck
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Orphan Card', pairsWith: 99 }),
      ]);

      render(<BrowseAllCards />);

      // Should not crash, and should not show pairing section
      expect(screen.queryByText(/pairs with/i)).toBeNull();
      // The card itself still renders
      expect(screen.getByText('Orphan Card')).toBeDefined();
    });

    it('renders pairing sections only on cards that have valid pairsWith', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Unpaired One' }),
        makeCard({ cardNumber: 2, prompt: 'Paired Two', pairsWith: 3 }),
        makeCard({ cardNumber: 3, prompt: 'Target Three' }),
      ]);

      render(<BrowseAllCards />);

      // Only one pairing section should exist (on card 2)
      const pairsElements = screen.getAllByText(/pairs with/i);
      expect(pairsElements).toHaveLength(1);
    });

    it('clicking a pair link scrolls the target card into view', () => {
      fillMockCards([
        makeCard({ cardNumber: 6, prompt: 'Source Card', pairsWith: 7 }),
        makeCard({ cardNumber: 7, prompt: 'Target Card' }),
      ]);

      render(<BrowseAllCards />);

      // Find and click the pair link
      const pairLink = screen.getByText(/Target Card/);
      fireEvent.click(pairLink);

      // The target card should have data-card-number attribute for scroll targeting
      const articles = screen.getAllByRole('article');
      const targetArticle = articles.find(
        (a) => a.getAttribute('data-card-number') === '7',
      );
      expect(targetArticle).toBeDefined();
    });

    it('each card article has a data-card-number attribute for scroll targeting', () => {
      fillMockCards([
        makeCard({ cardNumber: 10, prompt: 'Card Ten' }),
        makeCard({ cardNumber: 20, prompt: 'Card Twenty' }),
      ]);

      render(<BrowseAllCards />);

      const articles = screen.getAllByRole('article');
      expect(articles[0].getAttribute('data-card-number')).toBe('10');
      expect(articles[1].getAttribute('data-card-number')).toBe('20');
    });
  });
});
