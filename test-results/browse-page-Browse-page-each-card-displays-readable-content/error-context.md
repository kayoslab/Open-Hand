# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browse-page.spec.ts >> Browse page >> each card displays readable content
- Location: tests/e2e/browse-page.spec.ts:20:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('article').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('article').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "Open Hand" [level=1] [ref=e5]
  - navigation "Main navigation" [ref=e6]:
    - list [ref=e7]:
      - listitem [ref=e8]:
        - link "Home" [ref=e9] [cursor=pointer]:
          - /url: "#/"
      - listitem [ref=e10]:
        - link "Browse" [ref=e11] [cursor=pointer]:
          - /url: "#/browse"
      - listitem [ref=e12]:
        - link "Play" [ref=e13] [cursor=pointer]:
          - /url: "#/play"
      - listitem [ref=e14]:
        - link "Draw 3" [ref=e15] [cursor=pointer]:
          - /url: "#/play/draw-three"
      - listitem [ref=e16]:
        - link "Guide" [ref=e17] [cursor=pointer]:
          - /url: "#/guide"
  - main [ref=e18]:
    - heading "Card Deck v2" [level=2] [ref=e19]
    - paragraph [ref=e20]: Welcome to Open Hand
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
> 25 |     await expect(firstCard).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
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
  87 |     expect(response?.status()).toBe(200);
  88 | 
  89 |     // Main content area should be present
  90 |     const main = page.getByRole("main");
  91 |     await expect(main).toBeVisible();
  92 |   });
  93 | });
  94 | 
```