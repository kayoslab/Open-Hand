import type { Card, Tier } from './card';

export function filterByTier(cards: Card[], tiers: Set<Tier>): Card[] {
  if (tiers.size === 0) return cards;
  return cards.filter((card) => tiers.has(card.tier));
}

export function filterByText(cards: Card[], query: string): Card[] {
  const trimmed = query.trim();
  if (trimmed === '') return cards;
  const lower = trimmed.toLowerCase();
  return cards.filter(
    (card) =>
      card.prompt.toLowerCase().includes(lower) ||
      card.guidance.toLowerCase().includes(lower),
  );
}
