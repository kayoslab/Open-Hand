# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive-shell.spec.ts >> Layout shell at desktop (1280px) >> main content area is visible
- Location: tests/e2e/responsive-shell.spec.ts:33:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('main')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - text: "Error: ENOENT: no such file or directory, open '/Users/cr0ss/Development/open-hand-worktrees/US-015/dist/index.html'"
  - text: at readFileSync (node:fs:436:20)
  - text: at file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/.vite-temp/vite.config.ts.timestamp-1777268546620-1d9d9a62be1b98.mjs:14:19
  - text: at call (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:6183:5)
  - text: at next (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:6136:4)
  - text: at viteHtmlFallbackMiddleware (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:25190:3)
  - text: at call (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:6183:5)
  - text: at next (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:6136:4)
  - text: at file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:23981:28
  - text: at viteAssetMiddleware (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:33694:4)
  - text: at call (file:///Users/cr0ss/Development/open-hand-worktrees/US-015/node_modules/vite/dist/node/chunks/node.js:6183:5)
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const viewports = [
  4  |   { name: "mobile", width: 375, height: 667 },
  5  |   { name: "tablet", width: 768, height: 1024 },
  6  |   { name: "desktop", width: 1280, height: 800 },
  7  | ] as const;
  8  | 
  9  | for (const viewport of viewports) {
  10 |   test.describe(`Layout shell at ${viewport.name} (${viewport.width}px)`, () => {
  11 |     test.use({ viewport: { width: viewport.width, height: viewport.height } });
  12 | 
  13 |     test("no horizontal scrolling occurs", async ({ page }) => {
  14 |       await page.goto("/");
  15 |       const hasHorizontalScroll = await page.evaluate(
  16 |         () => document.documentElement.scrollWidth > window.innerWidth
  17 |       );
  18 |       expect(hasHorizontalScroll).toBe(false);
  19 |     });
  20 | 
  21 |     test("header is visible", async ({ page }) => {
  22 |       await page.goto("/");
  23 |       const header = page.getByRole("banner");
  24 |       await expect(header).toBeVisible();
  25 |     });
  26 | 
  27 |     test("navigation is visible", async ({ page }) => {
  28 |       await page.goto("/");
  29 |       const nav = page.getByRole("navigation");
  30 |       await expect(nav).toBeVisible();
  31 |     });
  32 | 
  33 |     test("main content area is visible", async ({ page }) => {
  34 |       await page.goto("/");
  35 |       const main = page.getByRole("main");
> 36 |       await expect(main).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  37 |     });
  38 |   });
  39 | }
  40 | 
  41 | test.describe("Navigation keyboard accessibility", () => {
  42 |   test("navigation links are keyboard-focusable with visible focus indicators", async ({
  43 |     page,
  44 |   }) => {
  45 |     await page.goto("/");
  46 |     const navLinks = page.getByRole("navigation").getByRole("link");
  47 |     const count = await navLinks.count();
  48 |     expect(count).toBeGreaterThanOrEqual(4);
  49 | 
  50 |     for (let i = 0; i < count; i++) {
  51 |       const link = navLinks.nth(i);
  52 |       await link.focus();
  53 |       await expect(link).toBeFocused();
  54 | 
  55 |       // Verify a visible focus indicator exists (outline or box-shadow)
  56 |       const hasVisibleFocus = await link.evaluate((el) => {
  57 |         const styles = window.getComputedStyle(el);
  58 |         const hasOutline =
  59 |           styles.outlineStyle !== "none" && styles.outlineWidth !== "0px";
  60 |         const hasBoxShadow = styles.boxShadow !== "none";
  61 |         return hasOutline || hasBoxShadow;
  62 |       });
  63 |       expect(hasVisibleFocus).toBe(true);
  64 |     }
  65 |   });
  66 | });
  67 | 
  68 | test.describe("Layout usability at desktop", () => {
  69 |   test.use({ viewport: { width: 1280, height: 800 } });
  70 | 
  71 |   test("all regions are appropriately sized", async ({ page }) => {
  72 |     await page.goto("/");
  73 | 
  74 |     const header = page.getByRole("banner");
  75 |     const nav = page.getByRole("navigation");
  76 |     const main = page.getByRole("main");
  77 | 
  78 |     const headerBox = await header.boundingBox();
  79 |     const navBox = await nav.boundingBox();
  80 |     const mainBox = await main.boundingBox();
  81 | 
  82 |     expect(headerBox).not.toBeNull();
  83 |     expect(navBox).not.toBeNull();
  84 |     expect(mainBox).not.toBeNull();
  85 | 
  86 |     // Header should span a reasonable width
  87 |     expect(headerBox!.width).toBeGreaterThan(500);
  88 | 
  89 |     // Main content should have meaningful height
  90 |     expect(mainBox!.height).toBeGreaterThan(0);
  91 | 
  92 |     // Nav should have meaningful dimensions
  93 |     expect(navBox!.width).toBeGreaterThan(0);
  94 |     expect(navBox!.height).toBeGreaterThan(0);
  95 |   });
  96 | });
  97 | 
```