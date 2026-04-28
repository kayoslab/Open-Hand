import { test, expect } from "@playwright/test";

test.describe("Default page", () => {
  test("loads successfully and displays content", async ({ page }) => {
    await page.goto("/");

    // Page should have a title
    await expect(page).toHaveTitle(/.+/);

    // The heading should be visible
    const heading = page.getByRole("heading", { name: /better conversations/i });
    await expect(heading).toBeVisible();
  });

  test("returns HTTP 200 for the root URL", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("serves valid HTML with a root element", async ({ page }) => {
    await page.goto("/");
    const root = page.locator("#root");
    await expect(root).toBeAttached();
  });
});
