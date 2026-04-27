import type { Card } from './card';

export function findCardByNumber(
  cards: Card[],
  cardNumber: number,
): Card | undefined {
  return cards.find((card) => card.cardNumber === cardNumber);
}
