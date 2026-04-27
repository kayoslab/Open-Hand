# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: draw-three-keep-one.spec.ts >> Draw Three Keep One >> navigates to draw-three route
- Location: tests/e2e/draw-three-keep-one.spec.ts:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /draw three/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /draw three/i })

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
  3  | test.describe("Draw Three Keep One", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |   });
  7  | 
  8  |   test("navigates to draw-three route", async ({ page }) => {
  9  |     // Navigate via link or direct URL
  10 |     await page.goto("/#/play/draw-three");
> 11 |     await expect(page.getByRole("heading", { name: /draw three/i })).toBeVisible();
     |                                                                      ^ Error: expect(locator).toBeVisible() failed
  12 |   });
  13 | 
  14 |   test("draws 3 cards and displays them", async ({ page }) => {
  15 |     await page.goto("/#/play/draw-three");
  16 | 
  17 |     const drawButton = page.getByRole("button", { name: /draw/i });
  18 |     await expect(drawButton).toBeVisible();
  19 | 
  20 |     await drawButton.click();
  21 | 
  22 |     // Should show exactly 3 card articles
  23 |     const cards = page.getByRole("article");
  24 |     await expect(cards).toHaveCount(3);
  25 |   });
  26 | 
  27 |   test("selecting a card keeps only that card visible", async ({ page }) => {
  28 |     await page.goto("/#/play/draw-three");
  29 | 
  30 |     // Draw cards
  31 |     await page.getByRole("button", { name: /draw/i }).click();
  32 |     await expect(page.getByRole("article")).toHaveCount(3);
  33 | 
  34 |     // Get text of first card before selecting
  35 |     const firstCard = page.getByRole("article").first();
  36 |     const firstCardText = await firstCard.textContent();
  37 | 
  38 |     // Click the first card to select it
  39 |     const selectableParent = firstCard.locator("xpath=ancestor-or-self::button").first();
  40 |     const target = (await selectableParent.count()) > 0 ? selectableParent : firstCard;
  41 |     await target.click();
  42 | 
  43 |     // Only 1 card should remain
  44 |     await expect(page.getByRole("article")).toHaveCount(1);
  45 | 
  46 |     // The remaining card should contain the selected card's text
  47 |     const keptCard = page.getByRole("article");
  48 |     await expect(keptCard).toContainText(firstCardText!.slice(0, 20));
  49 |   });
  50 | 
  51 |   test("new round draws fresh cards after selection", async ({ page }) => {
  52 |     await page.goto("/#/play/draw-three");
  53 | 
  54 |     // Draw and select
  55 |     await page.getByRole("button", { name: /draw/i }).click();
  56 |     const firstCard = page.getByRole("article").first();
  57 |     const selectableParent = firstCard.locator("xpath=ancestor-or-self::button").first();
  58 |     const target = (await selectableParent.count()) > 0 ? selectableParent : firstCard;
  59 |     await target.click();
  60 |     await expect(page.getByRole("article")).toHaveCount(1);
  61 | 
  62 |     // New round
  63 |     await page.getByRole("button", { name: /new round/i }).click();
  64 |     await expect(page.getByRole("article")).toHaveCount(3);
  65 |   });
  66 | 
  67 |   test("reset restores full deck and clears cards", async ({ page }) => {
  68 |     await page.goto("/#/play/draw-three");
  69 | 
  70 |     // Draw cards
  71 |     await page.getByRole("button", { name: /draw/i }).click();
  72 |     await expect(page.getByRole("article")).toHaveCount(3);
  73 | 
  74 |     // Reset
  75 |     await page.getByRole("button", { name: /reset/i }).click();
  76 | 
  77 |     // No cards should be visible
  78 |     await expect(page.getByRole("article")).toHaveCount(0);
  79 | 
  80 |     // Remaining count should show full deck
  81 |     await expect(page.getByText(/57.*remaining/i)).toBeVisible();
  82 |   });
  83 | 
  84 |   test("remaining count updates through the full flow", async ({ page }) => {
  85 |     await page.goto("/#/play/draw-three");
  86 | 
  87 |     // Initially shows full deck count
  88 |     await expect(page.getByText(/remaining/i)).toBeVisible();
  89 | 
  90 |     // Draw reduces count by 3
  91 |     await page.getByRole("button", { name: /draw/i }).click();
  92 |     await expect(page.getByText(/54.*remaining/i)).toBeVisible();
  93 |   });
  94 | });
  95 | 
```