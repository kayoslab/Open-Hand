# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: page-loads.spec.ts >> Default page >> loads successfully and displays content
- Location: tests/e2e/page-loads.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /card deck/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /card deck/i })

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
  3  | test.describe("Default page", () => {
  4  |   test("loads successfully and displays content", async ({ page }) => {
  5  |     await page.goto("/");
  6  | 
  7  |     // Page should have a title
  8  |     await expect(page).toHaveTitle(/.+/);
  9  | 
  10 |     // The heading should be visible
  11 |     const heading = page.getByRole("heading", { name: /card deck/i });
> 12 |     await expect(heading).toBeVisible();
     |                           ^ Error: expect(locator).toBeVisible() failed
  13 |   });
  14 | 
  15 |   test("returns HTTP 200 for the root URL", async ({ page }) => {
  16 |     const response = await page.goto("/");
  17 |     expect(response?.status()).toBe(200);
  18 |   });
  19 | 
  20 |   test("serves valid HTML with a root element", async ({ page }) => {
  21 |     await page.goto("/");
  22 |     const root = page.locator("#root");
  23 |     await expect(root).toBeAttached();
  24 |   });
  25 | });
  26 | 
```