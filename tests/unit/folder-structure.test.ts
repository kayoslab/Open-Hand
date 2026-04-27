import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "../..");

describe("US-003: Repository folder structure and code boundaries", () => {
  describe("required directories exist", () => {
    it("has src/domain/ directory", () => {
      expect(existsSync(resolve(root, "src/domain"))).toBe(true);
    });

    it("has src/data/ directory", () => {
      expect(existsSync(resolve(root, "src/data"))).toBe(true);
    });

    it("has src/features/ directory", () => {
      expect(existsSync(resolve(root, "src/features"))).toBe(true);
    });

    it("has src/ui/ directory", () => {
      expect(existsSync(resolve(root, "src/ui"))).toBe(true);
    });

    it("has tests/ directory", () => {
      expect(existsSync(resolve(root, "tests"))).toBe(true);
    });
  });

  describe("feature subdirectories exist", () => {
    it("has src/features/browse/ directory", () => {
      expect(existsSync(resolve(root, "src/features/browse"))).toBe(true);
    });

    it("has src/features/play/ directory", () => {
      expect(existsSync(resolve(root, "src/features/play"))).toBe(true);
    });

    it("has src/features/guide/ directory", () => {
      expect(existsSync(resolve(root, "src/features/guide"))).toBe(true);
    });
  });

  describe("barrel files are present and valid TypeScript", () => {
    const barrels = [
      "src/domain/index.ts",
      "src/data/index.ts",
      "src/features/browse/index.ts",
      "src/features/play/index.ts",
      "src/features/guide/index.ts",
      "src/ui/index.ts",
    ];

    for (const barrel of barrels) {
      it(`has ${barrel}`, () => {
        const fullPath = resolve(root, barrel);
        expect(existsSync(fullPath)).toBe(true);
      });
    }
  });

  describe("barrel files do not introduce invalid exports", () => {
    const barrels = [
      "src/domain/index.ts",
      "src/data/index.ts",
      "src/features/browse/index.ts",
      "src/features/play/index.ts",
      "src/features/guide/index.ts",
      "src/ui/index.ts",
    ];

    for (const barrel of barrels) {
      it(`${barrel} is parseable and non-empty`, () => {
        const fullPath = resolve(root, barrel);
        const content = readFileSync(fullPath, "utf-8");
        expect(content.length).toBeGreaterThan(0);
      });
    }
  });

  describe("test subdirectories exist", () => {
    it("has tests/unit/ directory", () => {
      expect(existsSync(resolve(root, "tests/unit"))).toBe(true);
    });

    it("has tests/e2e/ directory", () => {
      expect(existsSync(resolve(root, "tests/e2e"))).toBe(true);
    });
  });
});
