import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import type { Card } from "../../src/domain/card.js";

/**
 * US-007: Integration tests for validate + normalize pipeline
 *
 * Confirms the real 57-card CSV passes validation and comes out sorted.
 */

describe("US-007: Card deck pipeline integration", () => {
  async function loadValidator(): Promise<(cards: Card[]) => Card[]> {
    const mod = await import("../../src/data/validateCardDeck.js");
    return mod.validateCardDeck;
  }

  async function loadNormalizer(): Promise<(cards: Card[]) => Card[]> {
    const mod = await import("../../src/data/normalizeCardDeck.js");
    return mod.normalizeCardDeck;
  }

  async function loadParser(): Promise<(csv: string) => Card[]> {
    const mod = await import("../../src/data/parseCardCsv.js");
    return mod.parseCardCsv;
  }

  function loadRealCsv(): string {
    const root = resolve(__dirname, "../..");
    return readFileSync(resolve(root, "Input/card_deck.csv"), "utf-8");
  }

  describe("real card_deck.csv through full pipeline", () => {
    it("passes validation without errors", async () => {
      const parseCardCsv = await loadParser();
      const validateCardDeck = await loadValidator();
      const csvText = loadRealCsv();
      const cards = parseCardCsv(csvText);

      expect(() => validateCardDeck(cards)).not.toThrow();
    });

    it("produces 57 cards after validation", async () => {
      const parseCardCsv = await loadParser();
      const validateCardDeck = await loadValidator();
      const csvText = loadRealCsv();
      const cards = parseCardCsv(csvText);

      const validated = validateCardDeck(cards);
      expect(validated).toHaveLength(57);
    });

    it("comes out sorted by cardNumber after normalization", async () => {
      const parseCardCsv = await loadParser();
      const normalizeCardDeck = await loadNormalizer();
      const csvText = loadRealCsv();
      const cards = parseCardCsv(csvText);

      const sorted = normalizeCardDeck(cards);
      const numbers = sorted.map((c) => c.cardNumber);

      for (let i = 1; i < numbers.length; i++) {
        expect(numbers[i]).toBeGreaterThan(numbers[i - 1]);
      }
    });

    it("full pipeline: parse → validate → normalize produces sorted valid deck", async () => {
      const parseCardCsv = await loadParser();
      const validateCardDeck = await loadValidator();
      const normalizeCardDeck = await loadNormalizer();
      const csvText = loadRealCsv();

      const parsed = parseCardCsv(csvText);
      const validated = validateCardDeck(parsed);
      const normalized = normalizeCardDeck(validated);

      expect(normalized).toHaveLength(57);

      // Sorted ascending
      for (let i = 1; i < normalized.length; i++) {
        expect(normalized[i].cardNumber).toBeGreaterThan(
          normalized[i - 1].cardNumber,
        );
      }

      // No duplicate card numbers
      const numbers = new Set(normalized.map((c) => c.cardNumber));
      expect(numbers.size).toBe(57);
    });

    it("all pairsWith references point to existing cards in the deck", async () => {
      const parseCardCsv = await loadParser();
      const validateCardDeck = await loadValidator();
      const csvText = loadRealCsv();
      const cards = parseCardCsv(csvText);

      // If pairsWith validation is in validateCardDeck, this should not throw
      const validated = validateCardDeck(cards);
      const numberSet = new Set(validated.map((c) => c.cardNumber));

      for (const card of validated) {
        if (card.pairsWith !== undefined) {
          expect(numberSet.has(card.pairsWith)).toBe(true);
        }
      }
    });
  });
});
