import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardVisual } from '../../src/ui/CardVisual/CardVisual';
import type { Card } from '../../src/domain/card';

const baseCard: Card = {
  cardNumber: 1,
  category: 'Working Together',
  tier: 'Open',
  prompt: 'Check In',
  guidance: 'How are you arriving today?',
  flavourText: 'Start with presence.',
};

describe('CardVisual', () => {
  it('renders the prompt as the card title', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByText('Check In')).toBeDefined();
  });

  it('renders the guidance as question text', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByText('How are you arriving today?')).toBeDefined();
  });

  it('renders the category label', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByText('Working Together')).toBeDefined();
  });

  it('renders tier marker with text label for Open', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByText('Open')).toBeDefined();
  });

  it('renders tier marker with text label for Working', () => {
    const card: Card = { ...baseCard, tier: 'Working' };
    render(<CardVisual card={card} />);
    expect(screen.getByText('Working')).toBeDefined();
  });

  it('renders tier marker with text label for Deep', () => {
    const card: Card = { ...baseCard, tier: 'Deep' };
    render(<CardVisual card={card} />);
    expect(screen.getByText('Deep')).toBeDefined();
  });

  it('renders flavour text when present', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByText('Start with presence.')).toBeDefined();
  });

  it('does not render flavour text element when flavourText is empty string', () => {
    const card: Card = { ...baseCard, flavourText: '' };
    render(<CardVisual card={card} />);
    expect(screen.queryByText('Start with presence.')).toBeNull();
    // Verify no italic flavour text paragraph exists
    const article = screen.getByRole('article');
    const paragraphs = article.querySelectorAll('p');
    // Should only have the question paragraph, not a flavour text paragraph
    expect(paragraphs.length).toBe(1);
  });

  it('uses semantic article element', () => {
    render(<CardVisual card={baseCard} />);
    expect(screen.getByRole('article')).toBeDefined();
  });

  it('has correct data-tier attribute for each tier', () => {
    const { unmount } = render(<CardVisual card={baseCard} />);
    expect(screen.getByRole('article').getAttribute('data-tier')).toBe('Open');
    unmount();

    const { unmount: unmount2 } = render(<CardVisual card={{ ...baseCard, tier: 'Working' }} />);
    expect(screen.getByRole('article').getAttribute('data-tier')).toBe('Working');
    unmount2();

    render(<CardVisual card={{ ...baseCard, tier: 'Deep' }} />);
    expect(screen.getByRole('article').getAttribute('data-tier')).toBe('Deep');
  });
});
