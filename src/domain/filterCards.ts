import type { Card, Tier } from './card';

export function filterByTier(cards: Card[], tiers: Set<Tier>): Card[] {
  if (tiers.size === 0) return cards;
  return cards.filter((card) => tiers.has(card.tier));
}
