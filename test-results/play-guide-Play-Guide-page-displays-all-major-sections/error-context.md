# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: play-guide.spec.ts >> Play Guide page >> displays all major sections
- Location: tests/e2e/play-guide.spec.ts:13:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /structure at a glance/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /structure at a glance/i })

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
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Play Guide page", () => {
  4   |   test("loads the /guide route and displays content", async ({ page }) => {
  5   |     const response = await page.goto("/guide");
  6   |     expect(response?.status()).toBe(200);
  7   | 
  8   |     // Page should have visible guide content
  9   |     const heading = page.getByRole("heading", { name: /structure at a glance/i });
  10  |     await expect(heading).toBeVisible();
  11  |   });
  12  | 
  13  |   test("displays all major sections", async ({ page }) => {
  14  |     await page.goto("/guide");
  15  | 
  16  |     const sections = [
  17  |       /structure at a glance/i,
  18  |       /three ways to play/i,
  19  |       /rituals/i,
  20  |       /pairing references/i,
  21  |       /flavour text/i,
  22  |     ];
  23  | 
  24  |     for (const sectionName of sections) {
  25  |       const heading = page.getByRole("heading", { name: sectionName });
> 26  |       await expect(heading).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  27  |     }
  28  |   });
  29  | 
  30  |   test("displays subsections for ways to play", async ({ page }) => {
  31  |     await page.goto("/guide");
  32  | 
  33  |     const subsections = [
  34  |       /draw three.*keep one/i,
  35  |       /feedback conversation/i,
  36  |       /team.level use/i,
  37  |     ];
  38  | 
  39  |     for (const name of subsections) {
  40  |       const heading = page.getByRole("heading", { name });
  41  |       await expect(heading).toBeVisible();
  42  |     }
  43  |   });
  44  | 
  45  |   test("displays tier indicators with text labels", async ({ page }) => {
  46  |     await page.goto("/guide");
  47  | 
  48  |     // Tier names must be visible as text (not colour-only)
  49  |     await expect(page.getByText(/open/i).first()).toBeVisible();
  50  |     await expect(page.getByText(/working/i).first()).toBeVisible();
  51  |     await expect(page.getByText(/deep/i).first()).toBeVisible();
  52  |   });
  53  | });
  54  | 
  55  | test.describe("Play Guide navigation", () => {
  56  |   test("Guide link in nav navigates to the guide page", async ({ page }) => {
  57  |     await page.goto("/");
  58  | 
  59  |     const guideLink = page.getByRole("navigation").getByRole("link", { name: /guide/i });
  60  |     await expect(guideLink).toBeVisible();
  61  |     await guideLink.click();
  62  | 
  63  |     // Should navigate to the guide page
  64  |     await expect(page).toHaveURL(/\/guide/);
  65  | 
  66  |     // Guide content should be visible
  67  |     const heading = page.getByRole("heading", { name: /structure at a glance/i });
  68  |     await expect(heading).toBeVisible();
  69  |   });
  70  | });
  71  | 
  72  | const viewports = [
  73  |   { name: "mobile", width: 375, height: 667 },
  74  |   { name: "desktop", width: 1280, height: 800 },
  75  | ] as const;
  76  | 
  77  | for (const viewport of viewports) {
  78  |   test.describe(`Play Guide readability at ${viewport.name} (${viewport.width}px)`, () => {
  79  |     test.use({ viewport: { width: viewport.width, height: viewport.height } });
  80  | 
  81  |     test("guide content is visible and not clipped", async ({ page }) => {
  82  |       await page.goto("/guide");
  83  | 
  84  |       const main = page.getByRole("main");
  85  |       await expect(main).toBeVisible();
  86  | 
  87  |       // No horizontal scrolling
  88  |       const hasHorizontalScroll = await page.evaluate(
  89  |         () => document.documentElement.scrollWidth > window.innerWidth
  90  |       );
  91  |       expect(hasHorizontalScroll).toBe(false);
  92  |     });
  93  | 
  94  |     test("headings are readable (visible and non-empty)", async ({ page }) => {
  95  |       await page.goto("/guide");
  96  | 
  97  |       const headings = page.getByRole("heading");
  98  |       const count = await headings.count();
  99  |       expect(count).toBeGreaterThanOrEqual(5);
  100 | 
  101 |       for (let i = 0; i < Math.min(count, 8); i++) {
  102 |         const heading = headings.nth(i);
  103 |         await expect(heading).toBeVisible();
  104 |         const text = await heading.textContent();
  105 |         expect(text?.trim().length).toBeGreaterThan(0);
  106 |       }
  107 |     });
  108 |   });
  109 | }
  110 | 
```