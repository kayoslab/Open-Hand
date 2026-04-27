import { beforeAll, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Card } from '../../src/domain/card';

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

// Lazy import so the test file compiles before the component exists
let DrawThreeKeepOne: React.ComponentType<{ cards: Card[] }>;

beforeAll(async () => {
  const mod = await import('../../src/features/play/DrawThreeKeepOne');
  DrawThreeKeepOne = mod.DrawThreeKeepOne;
});

// ---------------------------------------------------------------------------
// Rendering — initial state
// ---------------------------------------------------------------------------

describe('DrawThreeKeepOne', () => {
  describe('initial render', () => {
    it('renders a Draw button', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      expect(screen.getByRole('button', { name: /draw/i })).toBeDefined();
    });

    it('does not show any cards before drawing', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });

    it('shows remaining card count', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      expect(screen.getByText(/10.*remaining/i)).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Drawing cards — choosing phase
  // ---------------------------------------------------------------------------

  describe('drawing cards', () => {
    it('shows exactly 3 cards after clicking Draw', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('all 3 drawn cards have valid prompt text from the deck', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      const articles = screen.getAllByRole('article');
      const prompts = cards.map((c) => c.prompt);

      for (const article of articles) {
        const matchesAnyPrompt = prompts.some((p) =>
          article.textContent?.includes(p),
        );
        expect(matchesAnyPrompt).toBe(true);
      }
    });

    it('all 3 drawn cards are unique within the round', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      const articles = screen.getAllByRole('article');
      const texts = articles.map((a) => a.textContent);
      expect(new Set(texts).size).toBe(3);
    });

    it('each card is clickable/selectable', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      // Cards should be wrapped in buttons or be buttons themselves for selection
      const selectableElements = screen.getAllByRole('button').filter((btn) => {
        // Exclude the draw/reset/new-round buttons
        const name = btn.textContent?.toLowerCase() ?? '';
        return !(/^draw$/i.test(name.trim()) || /^reset$/i.test(name.trim()) || /new round/i.test(name.trim()));
      });

      expect(selectableElements.length).toBeGreaterThanOrEqual(3);
    });

    it('remaining count decrements by 3 after drawing', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getByText(/7.*remaining/i)).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Selecting a card — kept phase
  // ---------------------------------------------------------------------------

  describe('selecting a card', () => {
    it('clicking a card shows only that card (unchosen cards dismissed)', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      // Get articles before selection
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(3);

      // Click the first card (find its selectable parent/wrapper)
      const firstArticle = articles[0];
      const selectableParent = firstArticle.closest('button') ?? firstArticle;
      fireEvent.click(selectableParent);

      // After selection, only 1 card should remain visible
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });

    it('the kept card contains the prompt of the selected card', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      const articles = screen.getAllByRole('article');
      const selectedPromptText = articles[0].textContent ?? '';

      const selectableParent = articles[0].closest('button') ?? articles[0];
      fireEvent.click(selectableParent);

      const keptArticle = screen.getByRole('article');
      // The kept card should contain text from the selected card
      expect(selectedPromptText).toBeTruthy();
      expect(keptArticle.textContent).toContain(
        cards.find((c) => selectedPromptText.includes(c.prompt))?.prompt,
      );
    });

    it('selecting via keyboard (Enter) works on a card', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      const articles = screen.getAllByRole('article');
      const selectableParent = articles[0].closest('button') ?? articles[0];
      fireEvent.keyDown(selectableParent, { key: 'Enter' });

      // Should transition to kept state with 1 card
      expect(screen.getAllByRole('article')).toHaveLength(1);
    });

    it('selecting via keyboard (Space) works on a card', () => {
      render(<DrawThreeKeepOne cards={makeCards(10)} />);
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));

      const articles = screen.getAllByRole('article');
      const selectableParent = articles[0].closest('button') ?? articles[0];
      fireEvent.keyDown(selectableParent, { key: ' ' });

      expect(screen.getAllByRole('article')).toHaveLength(1);
    });
  });

  // ---------------------------------------------------------------------------
  // New Round
  // ---------------------------------------------------------------------------

  describe('new round', () => {
    it('New Round button draws 3 fresh cards from remaining pool', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      // Draw and select
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const firstRoundArticles = screen.getAllByRole('article');
      const selectableParent =
        firstRoundArticles[0].closest('button') ?? firstRoundArticles[0];
      fireEvent.click(selectableParent);
      expect(screen.getAllByRole('article')).toHaveLength(1);

      // Start new round
      fireEvent.click(screen.getByRole('button', { name: /new round/i }));
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('remaining count decrements further after new round', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      // First draw: 10 -> 7
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getByText(/7.*remaining/i)).toBeDefined();

      // Select a card
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);

      // New round: 7 -> 4
      fireEvent.click(screen.getByRole('button', { name: /new round/i }));
      expect(screen.getByText(/4.*remaining/i)).toBeDefined();
    });

    it('cards from new round do not repeat cards from previous rounds', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      const allSeenPrompts = new Set<string>();

      // Round 1
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      let articles = screen.getAllByRole('article');
      for (const article of articles) {
        const prompt = cards.find((c) =>
          article.textContent?.includes(c.prompt),
        )?.prompt;
        expect(prompt).toBeDefined();
        allSeenPrompts.add(prompt!);
      }

      // Select first card and start new round
      fireEvent.click(articles[0].closest('button') ?? articles[0]);
      fireEvent.click(screen.getByRole('button', { name: /new round/i }));

      // Round 2
      articles = screen.getAllByRole('article');
      for (const article of articles) {
        const prompt = cards.find((c) =>
          article.textContent?.includes(c.prompt),
        )?.prompt;
        expect(prompt).toBeDefined();
        expect(allSeenPrompts.has(prompt!)).toBe(false);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  describe('reset', () => {
    it('Reset restores full deck count', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      // Draw and select
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);

      // Reset
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(screen.getByText(/10.*remaining/i)).toBeDefined();
    });

    it('Reset clears displayed cards', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getAllByRole('article')).toHaveLength(3);

      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });

    it('Reset returns to idle state with Draw button available', () => {
      const cards = makeCards(10);
      render(<DrawThreeKeepOne cards={cards} />);

      // Draw, select, then reset
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));

      // Should be able to draw again
      const drawButton = screen.getByRole('button', { name: /draw/i });
      expect(drawButton).not.toBeDisabled();
    });

    it('can draw full deck again after Reset', () => {
      const cards = makeCards(6);
      render(<DrawThreeKeepOne cards={cards} />);

      // Draw and select
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);

      // Reset
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));

      // Draw again — should get 3 cards
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getAllByRole('article')).toHaveLength(3);
      expect(screen.getByText(/3.*remaining/i)).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases — exhaustion
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    it('handles pool with fewer than 3 cards remaining gracefully', () => {
      const cards = makeCards(5);
      render(<DrawThreeKeepOne cards={cards} />);

      // First round: draws 3, leaving 2
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);

      // New round with 2 remaining: should draw 2 (or show appropriate state)
      fireEvent.click(screen.getByRole('button', { name: /new round/i }));
      const remainingArticles = screen.getAllByRole('article');
      expect(remainingArticles.length).toBeGreaterThanOrEqual(1);
      expect(remainingArticles.length).toBeLessThanOrEqual(2);
    });

    it('handles pool with exactly 3 cards', () => {
      const cards = makeCards(3);
      render(<DrawThreeKeepOne cards={cards} />);

      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      expect(screen.getAllByRole('article')).toHaveLength(3);
      expect(screen.getByText(/0.*remaining/i)).toBeDefined();
    });

    it('disables draw or shows appropriate state when pool is exhausted', () => {
      const cards = makeCards(3);
      render(<DrawThreeKeepOne cards={cards} />);

      // Draw all 3 and select one
      fireEvent.click(screen.getByRole('button', { name: /draw/i }));
      const articles = screen.getAllByRole('article');
      fireEvent.click(articles[0].closest('button') ?? articles[0]);

      // Pool is now empty — New Round should either be disabled or not shown
      const newRoundButton = screen.queryByRole('button', {
        name: /new round/i,
      });
      if (newRoundButton) {
        expect(newRoundButton).toBeDisabled();
      }
      // If no New Round button is shown, that's also acceptable
    });
  });
});
