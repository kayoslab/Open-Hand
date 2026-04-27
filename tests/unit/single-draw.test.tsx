import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SingleDraw } from '../../src/features/play/SingleDraw';
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

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('SingleDraw', () => {
  it('renders a Draw button', () => {
    render(<SingleDraw cards={makeCards(5)} />);
    expect(screen.getByRole('button', { name: /draw/i })).toBeDefined();
  });

  it('renders a Reset button', () => {
    render(<SingleDraw cards={makeCards(5)} />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeDefined();
  });

  it('does not show a card before any draw', () => {
    render(<SingleDraw cards={makeCards(5)} />);
    expect(screen.queryByRole('article')).toBeNull();
  });

  // ---------------------------------------------------------------------------
  // Drawing cards
  // ---------------------------------------------------------------------------

  it('shows a card after clicking Draw', () => {
    render(<SingleDraw cards={makeCards(5)} />);
    fireEvent.click(screen.getByRole('button', { name: /draw/i }));
    expect(screen.getByRole('article')).toBeDefined();
  });

  it('drawn card contains valid prompt text', () => {
    const cards = makeCards(5);
    render(<SingleDraw cards={cards} />);
    fireEvent.click(screen.getByRole('button', { name: /draw/i }));

    const prompts = cards.map((c) => c.prompt);
    const article = screen.getByRole('article');
    const matchesAnyPrompt = prompts.some((p) =>
      article.textContent?.includes(p),
    );
    expect(matchesAnyPrompt).toBe(true);
  });

  it('clicking Draw repeatedly never shows the same card twice', () => {
    const cards = makeCards(10);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });
    const seenPrompts = new Set<string>();

    for (let i = 0; i < 10; i++) {
      fireEvent.click(drawButton);
      const article = screen.getByRole('article');
      const text = article.textContent ?? '';
      // Extract the prompt — match longest first to avoid substring false positives
      const matchedPrompt = [...cards]
        .sort((a, b) => b.prompt.length - a.prompt.length)
        .find((c) => text.includes(c.prompt))?.prompt;
      expect(matchedPrompt).toBeDefined();
      expect(seenPrompts.has(matchedPrompt!)).toBe(false);
      seenPrompts.add(matchedPrompt!);
    }

    expect(seenPrompts.size).toBe(10);
  });

  // ---------------------------------------------------------------------------
  // Remaining counter
  // ---------------------------------------------------------------------------

  it('shows remaining card count', () => {
    const cards = makeCards(5);
    render(<SingleDraw cards={cards} />);
    // Should show 5 remaining initially
    expect(screen.getByText(/5.*remaining/i)).toBeDefined();
  });

  it('decrements remaining count after each draw', () => {
    const cards = makeCards(5);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    fireEvent.click(drawButton);
    expect(screen.getByText(/4.*remaining/i)).toBeDefined();

    fireEvent.click(drawButton);
    expect(screen.getByText(/3.*remaining/i)).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Exhaustion
  // ---------------------------------------------------------------------------

  it('disables Draw button when deck is exhausted', () => {
    const cards = makeCards(3);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
    }

    expect(drawButton).toBeDisabled();
  });

  it('shows 0 remaining when deck is exhausted', () => {
    const cards = makeCards(3);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
    }

    expect(screen.getByText(/0.*remaining/i)).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  it('Reset restores the full deck after partial draw', () => {
    const cards = makeCards(5);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    // Draw 3 cards
    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
    }
    expect(screen.getByText(/2.*remaining/i)).toBeDefined();

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByText(/5.*remaining/i)).toBeDefined();
  });

  it('Reset re-enables Draw button after exhaustion', () => {
    const cards = makeCards(3);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    // Exhaust deck
    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
    }
    expect(drawButton).toBeDisabled();

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(drawButton).not.toBeDisabled();
  });

  it('Reset clears the currently displayed card', () => {
    const cards = makeCards(5);
    render(<SingleDraw cards={cards} />);

    fireEvent.click(screen.getByRole('button', { name: /draw/i }));
    expect(screen.getByRole('article')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.queryByRole('article')).toBeNull();
  });

  it('can draw the full deck again after Reset', () => {
    const cards = makeCards(3);
    render(<SingleDraw cards={cards} />);
    const drawButton = screen.getByRole('button', { name: /draw/i });

    // First full cycle
    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
    }

    // Reset
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Second full cycle
    const seenPrompts = new Set<string>();
    for (let i = 0; i < 3; i++) {
      fireEvent.click(drawButton);
      const article = screen.getByRole('article');
      const text = article.textContent ?? '';
      const matchedPrompt = cards.find((c) => text.includes(c.prompt))?.prompt;
      expect(matchedPrompt).toBeDefined();
      seenPrompts.add(matchedPrompt!);
    }

    expect(seenPrompts.size).toBe(3);
  });
});
