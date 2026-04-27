# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browse-page.spec.ts >> Browse page empty state >> page is navigable and does not error
- Location: tests/e2e/browse-page.spec.ts:85:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 500
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
  3  | test.describe("Browse page", () => {
  4  |   test("loads successfully with heading visible", async ({ page }) => {
  5  |     const response = await page.goto("/browse");
  6  |     expect(response?.status()).toBe(200);
  7  | 
  8  |     const heading = page.getByRole("heading", { name: /browse/i });
  9  |     await expect(heading).toBeVisible();
  10 |   });
  11 | 
  12 |   test("renders all 57 cards from the dataset", async ({ page }) => {
  13 |     await page.goto("/browse");
  14 | 
  15 |     const cards = page.getByRole("article");
  16 |     await expect(cards).not.toHaveCount(0);
  17 |     await expect(cards).toHaveCount(57);
  18 |   });
  19 | 
  20 |   test("each card displays readable content", async ({ page }) => {
  21 |     await page.goto("/browse");
  22 | 
  23 |     // Spot-check the first card has visible text content
  24 |     const firstCard = page.getByRole("article").first();
  25 |     await expect(firstCard).toBeVisible();
  26 |     await expect(firstCard).not.toBeEmpty();
  27 |   });
  28 | });
  29 | 
  30 | test.describe("Browse page responsive layout", () => {
  31 |   const viewports = [
  32 |     { name: "mobile", width: 375, height: 667 },
  33 |     { name: "tablet", width: 768, height: 1024 },
  34 |     { name: "desktop", width: 1280, height: 800 },
  35 |   ] as const;
  36 | 
  37 |   for (const viewport of viewports) {
  38 |     test.describe(`at ${viewport.name} (${viewport.width}px)`, () => {
  39 |       test.use({ viewport: { width: viewport.width, height: viewport.height } });
  40 | 
  41 |       test("no horizontal overflow occurs", async ({ page }) => {
  42 |         await page.goto("/browse");
  43 | 
  44 |         const hasHorizontalScroll = await page.evaluate(
  45 |           () => document.documentElement.scrollWidth > window.innerWidth
  46 |         );
  47 |         expect(hasHorizontalScroll).toBe(false);
  48 |       });
  49 | 
  50 |       test("cards are visible and readable", async ({ page }) => {
  51 |         await page.goto("/browse");
  52 | 
  53 |         const firstCard = page.getByRole("article").first();
  54 |         await expect(firstCard).toBeVisible();
  55 | 
  56 |         // Card text should be present and not clipped to zero size
  57 |         const box = await firstCard.boundingBox();
  58 |         expect(box).not.toBeNull();
  59 |         expect(box!.width).toBeGreaterThan(0);
  60 |         expect(box!.height).toBeGreaterThan(0);
  61 |       });
  62 |     });
  63 |   }
  64 | 
  65 |   test.describe("mobile card readability (375px)", () => {
  66 |     test.use({ viewport: { width: 375, height: 667 } });
  67 | 
  68 |     test("card text is visible on mobile", async ({ page }) => {
  69 |       await page.goto("/browse");
  70 | 
  71 |       // Verify text inside first card is visible (not hidden by overflow)
  72 |       const firstCard = page.getByRole("article").first();
  73 |       const cardBox = await firstCard.boundingBox();
  74 |       expect(cardBox).not.toBeNull();
  75 | 
  76 |       // Card should not be wider than the viewport
  77 |       expect(cardBox!.width).toBeLessThanOrEqual(375);
  78 |     });
  79 |   });
  80 | });
  81 | 
  82 | test.describe("Browse page empty state", () => {
  83 |   // Note: With real data loaded, empty state won't appear.
  84 |   // This test verifies the page still functions when navigated to directly.
  85 |   test("page is navigable and does not error", async ({ page }) => {
  86 |     const response = await page.goto("/browse");
> 87 |     expect(response?.status()).toBe(200);
     |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  88 | 
  89 |     // Main content area should be present
  90 |     const main = page.getByRole("main");
  91 |     await expect(main).toBeVisible();
  92 |   });
  93 | });
  94 | 
```