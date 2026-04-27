import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import type { Card } from "../../src/domain/card.js";

/**
 * US-006: Load and parse card_deck.csv
 *
 * Tests for the CSV parser that converts raw CSV text into typed Card objects.
 * The parser module under test is src/data/parseCardCsv.ts.
 */

// Helper: build a minimal valid CSV string from rows
function csv(rows: string[]): string {
  const header =
    "CardNumber,Category,Tier,Prompt,Guidance,FlavourText,PairsWith";
  return [header, ...rows].join("\n");
}

// A valid row with all fields populated (including PairsWith)
const VALID_ROW_WITH_PAIR =
  '6,Working Together,Open,"Which of our communication channels is genuinely useful, and which is just noise?","Tactical. Quick way to streamline.","The team has fourteen Slack channels. Three are used. Two are weather-related.",7';

// A valid row without PairsWith
const VALID_ROW_NO_PAIR =
  "1,Infrastructure,Open,What's been the highlight of your week so far?,Always opens. Warm up before going deeper.,The week's been fine. Define fine.,";

describe("US-006: Parse card_deck.csv", () => {
  // Lazy-load the parser so tests fail clearly if the module is missing
  async function loadParser(): Promise<(csv: string) => Card[]> {
    const mod = await import("../../src/data/parseCardCsv.js");
    return mod.parseCardCsv;
  }

  describe("valid CSV parsing", () => {
    it("parses a multi-row CSV string into typed Card objects", async () => {
      const parseCardCsv = await loadParser();
      const input = csv([VALID_ROW_NO_PAIR, VALID_ROW_WITH_PAIR]);
      const cards = parseCardCsv(input);

      expect(cards).toHaveLength(2);

      expect(cards[0].cardNumber).toBe(1);
      expect(cards[0].category).toBe("Infrastructure");
      expect(cards[0].tier).toBe("Open");
      expect(cards[0].prompt).toBe(
        "What's been the highlight of your week so far?",
      );
      expect(cards[0].guidance).toBe(
        "Always opens. Warm up before going deeper.",
      );
      expect(cards[0].flavourText).toBe(
        "The week's been fine. Define fine.",
      );
      expect(cards[0].pairsWith).toBeUndefined();

      expect(cards[1].cardNumber).toBe(6);
      expect(cards[1].category).toBe("Working Together");
      expect(cards[1].tier).toBe("Open");
      expect(cards[1].pairsWith).toBe(7);
    });

    it("handles quoted commas inside fields correctly", async () => {
      const parseCardCsv = await loadParser();
      const row =
        '10,Working Together,Working,"What do you need from me this week, and what do you definitely not need?","Direct. Two-part question surfaces both help and interference.","She needed space. He scheduled a sync.",';
      const cards = parseCardCsv(csv([row]));

      expect(cards).toHaveLength(1);
      expect(cards[0].prompt).toBe(
        "What do you need from me this week, and what do you definitely not need?",
      );
    });

    it("returns correct types for all fields", async () => {
      const parseCardCsv = await loadParser();
      const cards = parseCardCsv(csv([VALID_ROW_WITH_PAIR]));
      const card = cards[0];

      expect(typeof card.cardNumber).toBe("number");
      expect(typeof card.category).toBe("string");
      expect(typeof card.tier).toBe("string");
      expect(typeof card.prompt).toBe("string");
      expect(typeof card.guidance).toBe("string");
      expect(typeof card.flavourText).toBe("string");
      expect(typeof card.pairsWith).toBe("number");
    });

    it("PairsWith empty value results in undefined", async () => {
      const parseCardCsv = await loadParser();
      const cards = parseCardCsv(csv([VALID_ROW_NO_PAIR]));

      expect(cards[0].pairsWith).toBeUndefined();
    });

    it("PairsWith numeric value results in a number", async () => {
      const parseCardCsv = await loadParser();
      const cards = parseCardCsv(csv([VALID_ROW_WITH_PAIR]));

      expect(cards[0].pairsWith).toBe(7);
    });
  });

  describe("validation errors", () => {
    it("throws a readable error for a row with missing required Prompt", async () => {
      const parseCardCsv = await loadParser();
      const row = "1,Infrastructure,Open,,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/prompt/i);
    });

    it("throws a readable error for a row with missing required Guidance", async () => {
      const parseCardCsv = await loadParser();
      const row = "1,Infrastructure,Open,Some prompt,,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/guidance/i);
    });

    it("throws a readable error for invalid Tier value", async () => {
      const parseCardCsv = await loadParser();
      const row = "1,Infrastructure,Medium,A prompt,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/tier/i);
    });

    it("throws a readable error for invalid Category value", async () => {
      const parseCardCsv = await loadParser();
      const row = "1,Unknown Category,Open,A prompt,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/category/i);
    });

    it("throws a readable error for non-numeric CardNumber", async () => {
      const parseCardCsv = await loadParser();
      const row = "abc,Infrastructure,Open,A prompt,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/cardnumber/i);
    });

    it("throws a readable error for negative CardNumber", async () => {
      const parseCardCsv = await loadParser();
      const row =
        "-1,Infrastructure,Open,A prompt,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([row]))).toThrow(/row.*1/i);
      expect(() => parseCardCsv(csv([row]))).toThrow(/cardnumber/i);
    });

    it("error for second row references row 2", async () => {
      const parseCardCsv = await loadParser();
      const validRow =
        "1,Infrastructure,Open,A prompt,Some guidance,Some flavour,";
      const invalidRow =
        "abc,Infrastructure,Open,A prompt,Some guidance,Some flavour,";
      expect(() => parseCardCsv(csv([validRow, invalidRow]))).toThrow(
        /row.*2/i,
      );
    });
  });

  describe("integration: real card_deck.csv", () => {
    it("parses all 57 rows from the real CSV file without errors", async () => {
      const parseCardCsv = await loadParser();
      const root = resolve(__dirname, "../..");
      const csvText = readFileSync(
        resolve(root, "Input/card_deck.csv"),
        "utf-8",
      );
      const cards = parseCardCsv(csvText);

      expect(cards).toHaveLength(57);
    });

    it("every parsed card has correct field types", async () => {
      const parseCardCsv = await loadParser();
      const root = resolve(__dirname, "../..");
      const csvText = readFileSync(
        resolve(root, "Input/card_deck.csv"),
        "utf-8",
      );
      const cards = parseCardCsv(csvText);

      for (const card of cards) {
        expect(typeof card.cardNumber).toBe("number");
        expect(card.cardNumber).toBeGreaterThan(0);
        expect(typeof card.category).toBe("string");
        expect(typeof card.tier).toBe("string");
        expect(typeof card.prompt).toBe("string");
        expect(card.prompt.length).toBeGreaterThan(0);
        expect(typeof card.guidance).toBe("string");
        expect(card.guidance.length).toBeGreaterThan(0);
        expect(typeof card.flavourText).toBe("string");
        if (card.pairsWith !== undefined) {
          expect(typeof card.pairsWith).toBe("number");
          expect(card.pairsWith).toBeGreaterThan(0);
        }
      }
    });

    it("all four categories are present in the parsed deck", async () => {
      const parseCardCsv = await loadParser();
      const root = resolve(__dirname, "../..");
      const csvText = readFileSync(
        resolve(root, "Input/card_deck.csv"),
        "utf-8",
      );
      const cards = parseCardCsv(csvText);
      const categories = new Set(cards.map((c) => c.category));

      expect(categories).toContain("Infrastructure");
      expect(categories).toContain("Working Together");
      expect(categories).toContain("Growth and Direction");
      expect(categories).toContain("Feedback and Repair");
    });

    it("all three tiers are present in the parsed deck", async () => {
      const parseCardCsv = await loadParser();
      const root = resolve(__dirname, "../..");
      const csvText = readFileSync(
        resolve(root, "Input/card_deck.csv"),
        "utf-8",
      );
      const cards = parseCardCsv(csvText);
      const tiers = new Set(cards.map((c) => c.tier));

      expect(tiers).toContain("Open");
      expect(tiers).toContain("Working");
      expect(tiers).toContain("Deep");
    });
  });
});
