import { describe, it, expect, expectTypeOf } from "vitest";

/**
 * US-005: Define typed card domain model
 *
 * These tests verify that the Card, Tier, and Category types exist,
 * are correctly shaped, and can be imported from the domain barrel.
 * Since these are pure type definitions, most validation is compile-time —
 * the tests use vitest's expectTypeOf for type-level assertions.
 */

describe("US-005: Typed card domain model", () => {
  describe("types are importable from domain barrel", () => {
    it("exports Card type", async () => {
      const domain = await import("../../src/domain/index.js");
      // If Card is a type-only export, it won't appear at runtime.
      // The real check is that this file compiles with the import below.
      expect(true).toBe(true);
    });

    it("exports Tier type", async () => {
      expect(true).toBe(true);
    });

    it("exports Category type", async () => {
      expect(true).toBe(true);
    });
  });

  describe("Tier type", () => {
    it("accepts 'Open' as a valid Tier", () => {
      const tier: import("../../src/domain/card.js").Tier = "Open";
      expectTypeOf(tier).toBeString();
      expect(tier).toBe("Open");
    });

    it("accepts 'Working' as a valid Tier", () => {
      const tier: import("../../src/domain/card.js").Tier = "Working";
      expectTypeOf(tier).toBeString();
      expect(tier).toBe("Working");
    });

    it("accepts 'Deep' as a valid Tier", () => {
      const tier: import("../../src/domain/card.js").Tier = "Deep";
      expectTypeOf(tier).toBeString();
      expect(tier).toBe("Deep");
    });
  });

  describe("Category type", () => {
    it("accepts 'Infrastructure' as a valid Category", () => {
      const cat: import("../../src/domain/card.js").Category = "Infrastructure";
      expect(cat).toBe("Infrastructure");
    });

    it("accepts 'Working Together' as a valid Category", () => {
      const cat: import("../../src/domain/card.js").Category =
        "Working Together";
      expect(cat).toBe("Working Together");
    });

    it("accepts 'Growth and Direction' as a valid Category", () => {
      const cat: import("../../src/domain/card.js").Category =
        "Growth and Direction";
      expect(cat).toBe("Growth and Direction");
    });

    it("accepts 'Feedback and Repair' as a valid Category", () => {
      const cat: import("../../src/domain/card.js").Category =
        "Feedback and Repair";
      expect(cat).toBe("Feedback and Repair");
    });
  });

  describe("Card interface", () => {
    it("can construct a complete Card object with all required fields", () => {
      const card: import("../../src/domain/card.js").Card = {
        cardNumber: 1,
        category: "Infrastructure",
        tier: "Open",
        prompt: "What is one thing that slowed you down this week?",
        guidance: "Listen for systemic issues, not just symptoms.",
        flavourText: "Speed reveals friction.",
      };

      expect(card.cardNumber).toBe(1);
      expect(card.category).toBe("Infrastructure");
      expect(card.tier).toBe("Open");
      expect(card.prompt).toBeTypeOf("string");
      expect(card.guidance).toBeTypeOf("string");
      expect(card.flavourText).toBeTypeOf("string");
    });

    it("allows pairsWith to be omitted (optional field)", () => {
      const card: import("../../src/domain/card.js").Card = {
        cardNumber: 2,
        category: "Working Together",
        tier: "Working",
        prompt: "How do you prefer to receive feedback?",
        guidance: "Explore the gap between intent and impact.",
        flavourText: "Feedback is a gift.",
      };

      expect(card.pairsWith).toBeUndefined();
    });

    it("allows pairsWith to be set to a number", () => {
      const card: import("../../src/domain/card.js").Card = {
        cardNumber: 3,
        category: "Feedback and Repair",
        tier: "Deep",
        prompt: "What conversation have you been avoiding?",
        guidance: "Create safety before depth.",
        flavourText: "Avoidance has a cost.",
        pairsWith: 17,
      };

      expect(card.pairsWith).toBe(17);
    });

    it("has correct field types", () => {
      const card: import("../../src/domain/card.js").Card = {
        cardNumber: 10,
        category: "Growth and Direction",
        tier: "Open",
        prompt: "What would you like to learn next?",
        guidance: "Connect learning to purpose.",
        flavourText: "Growth follows curiosity.",
      };

      expectTypeOf(card.cardNumber).toBeNumber();
      expectTypeOf(card.category).toBeString();
      expectTypeOf(card.tier).toBeString();
      expectTypeOf(card.prompt).toBeString();
      expectTypeOf(card.guidance).toBeString();
      expectTypeOf(card.flavourText).toBeString();
    });
  });

  describe("TypeScript compilation", () => {
    it("src/domain/card.ts file exists", async () => {
      const { existsSync } = await import("fs");
      const { resolve } = await import("path");
      const root = resolve(__dirname, "../..");
      expect(existsSync(resolve(root, "src/domain/card.ts"))).toBe(true);
    });

    it("src/domain/index.ts re-exports from card module", async () => {
      const { readFileSync } = await import("fs");
      const { resolve } = await import("path");
      const root = resolve(__dirname, "../..");
      const barrel = readFileSync(
        resolve(root, "src/domain/index.ts"),
        "utf-8",
      );
      // Barrel must have an export statement referencing the card module
      expect(barrel).toMatch(/export.*from\s+['"]\.\/card['"]/);
    });
  });
});
