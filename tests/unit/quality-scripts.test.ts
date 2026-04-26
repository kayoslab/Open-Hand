import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "../..");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf-8"));

describe("Quality-gate scripts exist in package.json", () => {
  it("has an npm run lint script", () => {
    expect(pkg.scripts.lint).toBeDefined();
  });

  it("has an npm run typecheck script", () => {
    expect(pkg.scripts.typecheck).toBeDefined();
  });

  it("has an npm run test script", () => {
    expect(pkg.scripts.test).toBeDefined();
  });
});

describe("ESLint is configured for React and TypeScript", () => {
  it("has an eslint config file", () => {
    expect(existsSync(resolve(root, "eslint.config.js"))).toBe(true);
  });

  it("eslint config references typescript-eslint", () => {
    const config = readFileSync(
      resolve(root, "eslint.config.js"),
      "utf-8"
    );
    expect(config).toContain("typescript-eslint");
  });

  it("eslint config references react-hooks plugin", () => {
    const config = readFileSync(
      resolve(root, "eslint.config.js"),
      "utf-8"
    );
    expect(config).toContain("react-hooks");
  });

  it("eslint config targets .ts and .tsx files", () => {
    const config = readFileSync(
      resolve(root, "eslint.config.js"),
      "utf-8"
    );
    expect(config).toMatch(/\*\*\/\*\.\{ts,tsx\}/);
  });

  it("eslint is listed as a devDependency", () => {
    expect(pkg.devDependencies.eslint).toBeDefined();
  });

  it("typescript-eslint is listed as a devDependency", () => {
    expect(pkg.devDependencies["typescript-eslint"]).toBeDefined();
  });
});

describe("TypeScript typecheck configuration", () => {
  it("typecheck script uses tsc --noEmit", () => {
    expect(pkg.scripts.typecheck).toBe("tsc --noEmit");
  });

  it("typescript is listed as a devDependency", () => {
    expect(pkg.devDependencies.typescript).toBeDefined();
  });
});

describe("Vitest unit test configuration", () => {
  it("has a vitest config file", () => {
    expect(existsSync(resolve(root, "vitest.config.ts"))).toBe(true);
  });

  it("test script uses vitest", () => {
    expect(pkg.scripts.test).toContain("vitest");
  });

  it("vitest is listed as a devDependency", () => {
    expect(pkg.devDependencies.vitest).toBeDefined();
  });

  it("vitest config uses jsdom environment", () => {
    const config = readFileSync(
      resolve(root, "vitest.config.ts"),
      "utf-8"
    );
    expect(config).toContain("jsdom");
  });

  it("vitest config includes tests/unit directory", () => {
    const config = readFileSync(
      resolve(root, "vitest.config.ts"),
      "utf-8"
    );
    expect(config).toContain("tests/unit");
  });

  it("at least one sample unit test file exists", () => {
    const hasAppTest = existsSync(
      resolve(root, "tests/unit/App.test.tsx")
    );
    const hasSetupTest = existsSync(
      resolve(root, "tests/unit/project-setup.test.ts")
    );
    expect(hasAppTest || hasSetupTest).toBe(true);
  });
});
