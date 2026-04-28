import { test, expect } from "@playwright/test";

test.describe("Deployment verification", () => {
  test.describe("Production deployment succeeds", () => {
    test("root URL returns HTTP 200", async ({ page }) => {
      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
    });

    test("serves valid HTML document", async ({ page }) => {
      await page.goto("/");
      const root = page.locator("#root");
      await expect(root).toBeAttached();
      // App content should be rendered inside root
      await expect(root).not.toBeEmpty();
    });
  });

  test.describe("Client-side routes resolve correctly after refresh", () => {
    const routes = [
      { hash: "#/", label: /better conversations/i },
      { hash: "#/browse", label: /browse/i },
      { hash: "#/play", label: /draw/i },
      { hash: "#/play/draw-three", label: /draw three/i },
      { hash: "#/guide", label: /guide/i },
    ];

    for (const { hash, label } of routes) {
      test(`route ${hash} loads on direct navigation`, async ({ page }) => {
        const response = await page.goto(`/${hash}`);
        expect(response?.status()).toBe(200);
        const heading = page.getByRole("heading", { name: label });
        await expect(heading).toBeVisible();
      });

      test(`route ${hash} survives page refresh`, async ({ page }) => {
        await page.goto(`/${hash}`);
        await page.reload();
        const heading = page.getByRole("heading", { name: label });
        await expect(heading).toBeVisible();
      });
    }
  });

  test.describe("No console errors on landing page", () => {
    test("landing page produces zero console errors", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await page.goto("/");
      // Wait for any async content to settle
      await page.waitForLoadState("networkidle");

      expect(errors).toEqual([]);
    });

    test("landing page produces no uncaught exceptions", async ({ page }) => {
      const exceptions: string[] = [];
      page.on("pageerror", (err) => {
        exceptions.push(err.message);
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      expect(exceptions).toEqual([]);
    });
  });

  test.describe("Browse page loads in production", () => {
    test("browse page renders card grid", async ({ page }) => {
      await page.goto("/#/browse");
      const cards = page.getByRole("article");
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBeGreaterThan(0);
    });

    test("browse page shows all 57 cards", async ({ page }) => {
      await page.goto("/#/browse");
      const cards = page.getByRole("article");
      await expect(cards.nth(56)).toBeVisible({ timeout: 5000 });
      expect(await cards.count()).toBe(57);
    });
  });

  test.describe("Random draw mode works in production", () => {
    test("single draw: can draw a card", async ({ page }) => {
      await page.goto("/#/play");
      const drawButton = page.getByRole("button", { name: /draw/i });
      await expect(drawButton).toBeVisible();
      await drawButton.click();
      // A card should appear after drawing
      const card = page.getByRole("article");
      await expect(card).toBeVisible();
    });

    test("single draw: shows remaining count", async ({ page }) => {
      await page.goto("/#/play");
      // Should show remaining cards text
      await expect(page.getByText(/remaining/i)).toBeVisible();
    });

    test("draw three keep one: can draw and select", async ({ page }) => {
      await page.goto("/#/play/draw-three");
      const drawButton = page.getByRole("button", { name: /draw/i });
      await expect(drawButton).toBeVisible();
      await drawButton.click();

      // Three cards should appear
      const cards = page.getByRole("article");
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBe(3);

      // Select one card
      const keepButtons = page.getByRole("button", { name: /keep/i });
      await keepButtons.first().click();

      // Should show the kept card
      await expect(page.getByRole("article")).toBeVisible();
    });
  });
});
