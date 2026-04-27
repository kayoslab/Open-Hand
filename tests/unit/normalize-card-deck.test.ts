import { describe, it, expect } from "vitest";
import type { Card } from "../../src/domain/card.js";

/**
 * US-007: Normalize card dataset
 *
 * Tests for the normalization function that sorts cards by cardNumber
 * in ascending order.
 */

function makeCard(overrides: Partial<Card> & { cardNumber: number }): Card {
  return {
    category: "Infrastructure",
    tier: "Open",
    prompt: "Test prompt",
    guidance: "Test guidance",
    flavourText: "",
    ...overrides,
  };
}

describe("US-007: Normalize card dataset", () => {
  async function loadNormalizer(): Promise<(cards: Card[]) => Card[]> {
    const mod = await import("../../src/data/normalizeCardDeck.js");
    return mod.normalizeCardDeck;
  }

  it("sorts cards by cardNumber in ascending order", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [
      makeCard({ cardNumber: 3 }),
      makeCard({ cardNumber: 1 }),
      makeCard({ cardNumber: 2 }),
    ];

    const result = normalizeCardDeck(cards);

    expect(result.map((c) => c.cardNumber)).toEqual([1, 2, 3]);
  });

  it("already-sorted input remains unchanged", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [
      makeCard({ cardNumber: 1 }),
      makeCard({ cardNumber: 2 }),
      makeCard({ cardNumber: 3 }),
    ];

    const result = normalizeCardDeck(cards);

    expect(result.map((c) => c.cardNumber)).toEqual([1, 2, 3]);
  });

  it("single-card input works", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [makeCard({ cardNumber: 42 })];

    const result = normalizeCardDeck(cards);

    expect(result).toHaveLength(1);
    expect(result[0].cardNumber).toBe(42);
  });

  it("empty array works", async () => {
    const normalizeCardDeck = await loadNormalizer();

    const result = normalizeCardDeck([]);

    expect(result).toEqual([]);
  });

  it("preserves all card fields after sorting", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [
      makeCard({
        cardNumber: 2,
        category: "Working Together",
        tier: "Deep",
        prompt: "Second",
        guidance: "G2",
        flavourText: "F2",
        pairsWith: 1,
      }),
      makeCard({
        cardNumber: 1,
        category: "Infrastructure",
        tier: "Open",
        prompt: "First",
        guidance: "G1",
        flavourText: "F1",
      }),
    ];

    const result = normalizeCardDeck(cards);

    expect(result[0]).toEqual({
      cardNumber: 1,
      category: "Infrastructure",
      tier: "Open",
      prompt: "First",
      guidance: "G1",
      flavourText: "F1",
    });
    expect(result[1]).toEqual({
      cardNumber: 2,
      category: "Working Together",
      tier: "Deep",
      prompt: "Second",
      guidance: "G2",
      flavourText: "F2",
      pairsWith: 1,
    });
  });

  it("does not mutate the original array", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [
      makeCard({ cardNumber: 3 }),
      makeCard({ cardNumber: 1 }),
    ];
    const originalFirst = cards[0].cardNumber;

    normalizeCardDeck(cards);

    expect(cards[0].cardNumber).toBe(originalFirst);
  });

  it("handles non-sequential card numbers", async () => {
    const normalizeCardDeck = await loadNormalizer();
    const cards = [
      makeCard({ cardNumber: 57 }),
      makeCard({ cardNumber: 3 }),
      makeCard({ cardNumber: 25 }),
    ];

    const result = normalizeCardDeck(cards);

    expect(result.map((c) => c.cardNumber)).toEqual([3, 25, 57]);
  });
});
