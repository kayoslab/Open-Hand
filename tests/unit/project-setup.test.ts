import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "../..");

describe("Project structure", () => {
  it("has a package.json at the root", () => {
    expect(existsSync(resolve(root, "package.json"))).toBe(true);
  });

  it("has a tsconfig.json at the root", () => {
    expect(existsSync(resolve(root, "tsconfig.json"))).toBe(true);
  });

  it("has a vite.config.ts at the root", () => {
    expect(existsSync(resolve(root, "vite.config.ts"))).toBe(true);
  });

  it("has an index.html entry point", () => {
    expect(existsSync(resolve(root, "index.html"))).toBe(true);
  });

  it("has src/main.tsx entry module", () => {
    expect(existsSync(resolve(root, "src/main.tsx"))).toBe(true);
  });

  it("has src/App.tsx component", () => {
    expect(existsSync(resolve(root, "src/App.tsx"))).toBe(true);
  });

  it("preserves CLAUDE.md project file", () => {
    expect(existsSync(resolve(root, "CLAUDE.md"))).toBe(true);
  });

  it("preserves Input/ directory", () => {
    expect(existsSync(resolve(root, "Input"))).toBe(true);
  });
});

describe("package.json scripts", () => {
  const pkg = JSON.parse(
    readFileSync(resolve(root, "package.json"), "utf-8")
  );

  it("has a dev script", () => {
    expect(pkg.scripts.dev).toBeDefined();
  });

  it("has a build script", () => {
    expect(pkg.scripts.build).toBeDefined();
  });

  it("has a preview script", () => {
    expect(pkg.scripts.preview).toBeDefined();
  });
});

describe("TypeScript configuration", () => {
  const tsconfig = JSON.parse(
    readFileSync(resolve(root, "tsconfig.json"), "utf-8")
  );

  // tsconfig may use references pattern; check the app config if present
  const appConfigPath = resolve(root, "tsconfig.app.json");
  const appConfig = existsSync(appConfigPath)
    ? JSON.parse(readFileSync(appConfigPath, "utf-8"))
    : null;

  it("has strict mode enabled", () => {
    const strict =
      tsconfig.compilerOptions?.strict ?? appConfig?.compilerOptions?.strict;
    expect(strict).toBe(true);
  });
});

describe(".gitignore", () => {
  const gitignore = readFileSync(resolve(root, ".gitignore"), "utf-8");

  it("excludes node_modules", () => {
    expect(gitignore).toContain("node_modules");
  });

  it("excludes dist", () => {
    expect(gitignore).toContain("dist");
  });
});
