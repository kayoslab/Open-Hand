import type { Card } from "../domain/card";

const VALID_TIERS: readonly string[] = ["Open", "Working", "Deep"];
const VALID_CATEGORIES: readonly string[] = [
  "Infrastructure",
  "Working Together",
  "Growth and Direction",
  "Feedback and Repair",
];

export function validateCardDeck(cards: Card[]): Card[] {
  // Check for duplicate card numbers
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const card of cards) {
    if (seen.has(card.cardNumber)) {
      duplicates.add(card.cardNumber);
    }
    seen.add(card.cardNumber);
  }
  if (duplicates.size > 0) {
    const nums = [...duplicates].sort((a, b) => a - b).join(", ");
    throw new Error(`Duplicate card numbers found: ${nums}`);
  }

  // Check for unknown tiers and categories
  for (const card of cards) {
    if (!VALID_TIERS.includes(card.tier)) {
      throw new Error(
        `Card ${card.cardNumber}: Invalid tier "${card.tier}". Must be one of: ${VALID_TIERS.join(", ")}`,
      );
    }
    if (!VALID_CATEGORIES.includes(card.category)) {
      throw new Error(
        `Card ${card.cardNumber}: Invalid category "${card.category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`,
      );
    }
  }

  // Check pairsWith references
  const allNumbers = new Set(cards.map((c) => c.cardNumber));
  for (const card of cards) {
    if (card.pairsWith !== undefined && !allNumbers.has(card.pairsWith)) {
      throw new Error(
        `Card ${card.cardNumber}: pairsWith references card ${card.pairsWith}, which does not exist in the dataset`,
      );
    }
  }

  return cards;
}
