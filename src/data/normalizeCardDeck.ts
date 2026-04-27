import type { Card } from "../domain/card";

export function normalizeCardDeck(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => a.cardNumber - b.cardNumber);
}
