import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { Card } from '../../src/domain/card';

// Provide a localStorage polyfill for the jsdom environment
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, value: string) => { storageMap.set(key, value); },
  removeItem: (key: string) => { storageMap.delete(key); },
  clear: () => { storageMap.clear(); },
  get length() { return storageMap.size; },
  key: (index: number) => [...storageMap.keys()][index] ?? null,
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// Mock the card deck data module
const mockCards: Card[] = [];
vi.mock('../../src/data/loadCardDeck', () => ({
  get cardDeck() {
    return mockCards;
  },
}));

// Dynamic imports after mocks
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

beforeEach(() => {
  storageMap.clear();
});

afterEach(() => {
  storageMap.clear();
  cleanup();
});

describe('US-018: Persistence integration', () => {
  describe('BrowseAllCards tier filter persistence', () => {
    it('restores tier filters from localStorage on mount', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open', prompt: 'Open Card' }),
        makeCard({ cardNumber: 2, tier: 'Working', prompt: 'Working Card' }),
        makeCard({ cardNumber: 3, tier: 'Deep', prompt: 'Deep Card' }),
      ]);

      // Pre-seed localStorage with persisted tier filter
      window.localStorage.setItem('openhand:activeTiers', JSON.stringify(['Working']));

      render(<BrowseAllCards />);

      // Should show only Working cards on mount
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
      expect(articles[0].getAttribute('data-tier')).toBe('Working');
    });

    it('restores multiple active tiers from localStorage on mount', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open', prompt: 'Open Card' }),
        makeCard({ cardNumber: 2, tier: 'Working', prompt: 'Working Card' }),
        makeCard({ cardNumber: 3, tier: 'Deep', prompt: 'Deep Card' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', JSON.stringify(['Open', 'Deep']));

      render(<BrowseAllCards />);

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(2);
      const tiers = articles.map((a) => a.getAttribute('data-tier'));
      expect(tiers).toContain('Open');
      expect(tiers).toContain('Deep');
    });

    it('persists tier filter changes to localStorage when toggled', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ]);

      render(<BrowseAllCards />);

      // Click Open tier filter
      fireEvent.click(screen.getByRole('button', { name: /open/i }));

      const stored = JSON.parse(window.localStorage.getItem('openhand:activeTiers')!);
      expect(stored).toEqual(['Open']);
    });

    it('clears persisted tiers when clear filters is clicked', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', JSON.stringify(['Open']));

      render(<BrowseAllCards />);

      fireEvent.click(screen.getByRole('button', { name: /clear/i }));

      const stored = JSON.parse(window.localStorage.getItem('openhand:activeTiers')!);
      expect(stored).toEqual([]);
    });

    it('shows all cards when persisted tiers is empty array', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
        makeCard({ cardNumber: 3, tier: 'Deep' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', JSON.stringify([]));

      render(<BrowseAllCards />);

      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });

  describe('BrowseAllCards search query persistence', () => {
    it('restores search query from localStorage on mount', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Check In', guidance: 'arrival' }),
        makeCard({ cardNumber: 2, prompt: 'Feedback Loop', guidance: 'reflect' }),
      ]);

      window.localStorage.setItem('openhand:searchQuery', JSON.stringify('feedback'));

      render(<BrowseAllCards />);

      // Should filter to only the card matching "feedback"
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
      expect(screen.getByText('Feedback Loop')).toBeDefined();
    });

    it('persists search query changes to localStorage', () => {
      fillMockCards([makeCard({ cardNumber: 1 })]);

      render(<BrowseAllCards />);

      const searchInput = screen.getByRole('searchbox') || screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'growth' } });

      const stored = JSON.parse(window.localStorage.getItem('openhand:searchQuery')!);
      expect(stored).toBe('growth');
    });
  });

  describe('corrupt localStorage resilience', () => {
    it('renders with defaults when tier filter localStorage contains invalid JSON', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', 'not-valid-json!!!');

      // Should not throw
      render(<BrowseAllCards />);

      // Should render all cards (default = no filter)
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('renders with defaults when tier filter contains invalid tier values', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Working' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', JSON.stringify(['InvalidTier', 'Bogus']));

      render(<BrowseAllCards />);

      // Should render all cards (invalid data treated as default)
      expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('renders with defaults when search query localStorage contains wrong type', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, prompt: 'Card One' }),
      ]);

      window.localStorage.setItem('openhand:searchQuery', JSON.stringify(12345));

      render(<BrowseAllCards />);

      // Should render normally with empty search (default)
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });

    it('renders with defaults when localStorage contains null values', () => {
      fillMockCards([
        makeCard({ cardNumber: 1, tier: 'Open' }),
        makeCard({ cardNumber: 2, tier: 'Deep' }),
      ]);

      window.localStorage.setItem('openhand:activeTiers', JSON.stringify(null));
      window.localStorage.setItem('openhand:searchQuery', JSON.stringify(null));

      render(<BrowseAllCards />);

      expect(screen.getAllByRole('article')).toHaveLength(2);
    });
  });

  describe('route persistence', () => {
    it('persists route to localStorage on hash change', async () => {
      // Import App dynamically
      const { default: App } = await import('../../src/App');

      window.location.hash = '#/browse';
      render(<App />);

      // Trigger hashchange
      window.location.hash = '#/guide';
      fireEvent(window, new HashChangeEvent('hashchange'));

      const stored = JSON.parse(window.localStorage.getItem('openhand:lastRoute')!);
      expect(stored).toBe('/guide');
    });

    it('restores persisted route on load when no hash is present', async () => {
      const { default: App } = await import('../../src/App');

      window.localStorage.setItem('openhand:lastRoute', JSON.stringify('/browse'));
      window.location.hash = '';

      render(<App />);

      // Should show browse page content
      expect(screen.getByRole('heading', { name: /browse/i })).toBeDefined();
    });

    it('does not override explicit hash with persisted route', async () => {
      const { default: App } = await import('../../src/App');

      window.localStorage.setItem('openhand:lastRoute', JSON.stringify('/browse'));
      window.location.hash = '#/guide';

      render(<App />);

      // Should show guide page, not browse
      expect(screen.getByRole('heading', { name: /play guide/i })).toBeDefined();
    });

    it('renders home page when persisted route is corrupt', async () => {
      const { default: App } = await import('../../src/App');

      window.localStorage.setItem('openhand:lastRoute', 'not-json!!!');
      window.location.hash = '';

      render(<App />);

      // Should show welcome/home page (default)
      expect(screen.getByText(/better conversations/i)).toBeDefined();
    });

    it('renders home page when persisted route is an unknown route', async () => {
      const { default: App } = await import('../../src/App');

      window.localStorage.setItem('openhand:lastRoute', JSON.stringify('/unknown-page'));
      window.location.hash = '';

      render(<App />);

      // Unknown route falls through to home
      expect(screen.getByText(/better conversations/i)).toBeDefined();
    });
  });
});
