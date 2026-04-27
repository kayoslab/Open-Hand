import { test, expect } from "@playwright/test";

test.describe("Browse page", () => {
  test("loads successfully with heading visible", async ({ page }) => {
    const response = await page.goto("/browse");
    expect(response?.status()).toBe(200);

    const heading = page.getByRole("heading", { name: /browse/i });
    await expect(heading).toBeVisible();
  });

  test("renders all 57 cards from the dataset", async ({ page }) => {
    await page.goto("/browse");

    const cards = page.getByRole("article");
    await expect(cards).not.toHaveCount(0);
    await expect(cards).toHaveCount(57);
  });

  test("each card displays readable content", async ({ page }) => {
    await page.goto("/browse");

    // Spot-check the first card has visible text content
    const firstCard = page.getByRole("article").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).not.toBeEmpty();
  });
});

test.describe("Browse page responsive layout", () => {
  const viewports = [
    { name: "mobile", width: 375, height: 667 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 800 },
  ] as const;

  for (const viewport of viewports) {
    test.describe(`at ${viewport.name} (${viewport.width}px)`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test("no horizontal overflow occurs", async ({ page }) => {
        await page.goto("/browse");

        const hasHorizontalScroll = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth
        );
        expect(hasHorizontalScroll).toBe(false);
      });

      test("cards are visible and readable", async ({ page }) => {
        await page.goto("/browse");

        const firstCard = page.getByRole("article").first();
        await expect(firstCard).toBeVisible();

        // Card text should be present and not clipped to zero size
        const box = await firstCard.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
      });
    });
  }

  test.describe("mobile card readability (375px)", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("card text is visible on mobile", async ({ page }) => {
      await page.goto("/browse");

      // Verify text inside first card is visible (not hidden by overflow)
      const firstCard = page.getByRole("article").first();
      const cardBox = await firstCard.boundingBox();
      expect(cardBox).not.toBeNull();

      // Card should not be wider than the viewport
      expect(cardBox!.width).toBeLessThanOrEqual(375);
    });
  });
});

test.describe("Browse page empty state", () => {
  // Note: With real data loaded, empty state won't appear.
  // This test verifies the page still functions when navigated to directly.
  test("page is navigable and does not error", async ({ page }) => {
    const response = await page.goto("/browse");
    expect(response?.status()).toBe(200);

    // Main content area should be present
    const main = page.getByRole("main");
    await expect(main).toBeVisible();
  });
});
