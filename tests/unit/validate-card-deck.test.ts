import { describe, it, expect } from "vitest";
import type { Card } from "../../src/domain/card.js";

/**
 * US-007: Validate card dataset
 *
 * Tests for the dataset-level validation function that ensures the card deck
 * as a whole is consistent and safe: no duplicate card numbers, no unknown
 * tiers or categories, and all pairsWith references point to existing cards.
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

describe("US-007: Validate card dataset", () => {
  async function loadValidator(): Promise<(cards: Card[]) => Card[]> {
    const mod = await import("../../src/data/validateCardDeck.js");
    return mod.validateCardDeck;
  }

  describe("duplicate card numbers", () => {
    it("throws a descriptive error when two cards share the same card number", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1 }),
        makeCard({ cardNumber: 2 }),
        makeCard({ cardNumber: 1 }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/duplicate/i);
      expect(() => validateCardDeck(cards)).toThrow(/1/);
    });

    it("throws when multiple different duplicates exist", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 5 }),
        makeCard({ cardNumber: 5 }),
        makeCard({ cardNumber: 10 }),
        makeCard({ cardNumber: 10 }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/duplicate/i);
    });

    it("does not throw when all card numbers are unique", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1 }),
        makeCard({ cardNumber: 2 }),
        makeCard({ cardNumber: 3 }),
      ];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });
  });

  describe("unknown tier values", () => {
    it("throws a descriptive error for an unknown tier", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, tier: "Unknown" as Card["tier"] }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/tier/i);
      expect(() => validateCardDeck(cards)).toThrow(/Unknown/);
    });

    it("throws for a tier that is close but not exact (case mismatch)", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, tier: "open" as Card["tier"] }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/tier/i);
    });

    it("accepts all three valid tiers", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, tier: "Open" }),
        makeCard({ cardNumber: 2, tier: "Working" }),
        makeCard({ cardNumber: 3, tier: "Deep" }),
      ];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });
  });

  describe("unknown category values", () => {
    it("throws a descriptive error for an unknown category", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({
          cardNumber: 1,
          category: "Nonexistent" as Card["category"],
        }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/category/i);
      expect(() => validateCardDeck(cards)).toThrow(/Nonexistent/);
    });

    it("throws for a category that is close but not exact", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({
          cardNumber: 1,
          category: "infrastructure" as Card["category"],
        }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/category/i);
    });

    it("accepts all four valid categories", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, category: "Infrastructure" }),
        makeCard({ cardNumber: 2, category: "Working Together" }),
        makeCard({ cardNumber: 3, category: "Growth and Direction" }),
        makeCard({ cardNumber: 4, category: "Feedback and Repair" }),
      ];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });
  });

  describe("pairsWith references", () => {
    it("throws when pairsWith references a card number not in the dataset", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, pairsWith: 99 }),
        makeCard({ cardNumber: 2 }),
      ];

      expect(() => validateCardDeck(cards)).toThrow(/pairsWith/i);
      expect(() => validateCardDeck(cards)).toThrow(/99/);
    });

    it("does not throw when pairsWith references a valid card number", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, pairsWith: 2 }),
        makeCard({ cardNumber: 2, pairsWith: 1 }),
      ];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });

    it("does not throw when pairsWith is undefined", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1 }),
        makeCard({ cardNumber: 2 }),
      ];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });
  });

  describe("valid dataset", () => {
    it("returns the cards array when validation passes", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [
        makeCard({ cardNumber: 1, tier: "Open", category: "Infrastructure" }),
        makeCard({
          cardNumber: 2,
          tier: "Working",
          category: "Working Together",
          pairsWith: 1,
        }),
        makeCard({
          cardNumber: 3,
          tier: "Deep",
          category: "Growth and Direction",
        }),
      ];

      const result = validateCardDeck(cards);
      expect(result).toEqual(cards);
    });

    it("passes validation for an empty array", async () => {
      const validateCardDeck = await loadValidator();

      expect(() => validateCardDeck([])).not.toThrow();
    });

    it("passes validation for a single valid card", async () => {
      const validateCardDeck = await loadValidator();
      const cards = [makeCard({ cardNumber: 1 })];

      expect(() => validateCardDeck(cards)).not.toThrow();
    });
  });
});
