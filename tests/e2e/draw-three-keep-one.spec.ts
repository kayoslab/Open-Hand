import { test, expect } from "@playwright/test";

test.describe("Draw Three Keep One", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigates to draw-three route", async ({ page }) => {
    // Navigate via link or direct URL
    await page.goto("/#/play/draw-three");
    await expect(page.getByRole("heading", { name: /draw three/i })).toBeVisible();
  });

  test("draws 3 cards and displays them", async ({ page }) => {
    await page.goto("/#/play/draw-three");

    const drawButton = page.getByRole("button", { name: /draw/i });
    await expect(drawButton).toBeVisible();

    await drawButton.click();

    // Should show exactly 3 card articles
    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(3);
  });

  test("selecting a card keeps only that card visible", async ({ page }) => {
    await page.goto("/#/play/draw-three");

    // Draw cards
    await page.getByRole("button", { name: /draw/i }).click();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Get text of first card before selecting
    const firstCard = page.getByRole("article").first();
    const firstCardText = await firstCard.textContent();

    // Click the first card to select it
    const selectableParent = firstCard.locator("xpath=ancestor-or-self::button").first();
    const target = (await selectableParent.count()) > 0 ? selectableParent : firstCard;
    await target.click();

    // Only 1 card should remain
    await expect(page.getByRole("article")).toHaveCount(1);

    // The remaining card should contain the selected card's text
    const keptCard = page.getByRole("article");
    await expect(keptCard).toContainText(firstCardText!.slice(0, 20));
  });

  test("new round draws fresh cards after selection", async ({ page }) => {
    await page.goto("/#/play/draw-three");

    // Draw and select
    await page.getByRole("button", { name: /draw/i }).click();
    const firstCard = page.getByRole("article").first();
    const selectableParent = firstCard.locator("xpath=ancestor-or-self::button").first();
    const target = (await selectableParent.count()) > 0 ? selectableParent : firstCard;
    await target.click();
    await expect(page.getByRole("article")).toHaveCount(1);

    // New round
    await page.getByRole("button", { name: /new round/i }).click();
    await expect(page.getByRole("article")).toHaveCount(3);
  });

  test("reset restores full deck and clears cards", async ({ page }) => {
    await page.goto("/#/play/draw-three");

    // Draw cards
    await page.getByRole("button", { name: /draw/i }).click();
    await expect(page.getByRole("article")).toHaveCount(3);

    // Reset
    await page.getByRole("button", { name: /reset/i }).click();

    // No cards should be visible
    await expect(page.getByRole("article")).toHaveCount(0);

    // Remaining count should show full deck
    await expect(page.getByText(/57.*remaining/i)).toBeVisible();
  });

  test("remaining count updates through the full flow", async ({ page }) => {
    await page.goto("/#/play/draw-three");

    // Initially shows full deck count
    await expect(page.getByText(/remaining/i)).toBeVisible();

    // Draw reduces count by 3
    await page.getByRole("button", { name: /draw/i }).click();
    await expect(page.getByText(/54.*remaining/i)).toBeVisible();
  });
});
