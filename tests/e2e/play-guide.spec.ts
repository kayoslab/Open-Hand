import { test, expect } from "@playwright/test";

test.describe("Play Guide page", () => {
  test("loads the /guide route and displays content", async ({ page }) => {
    const response = await page.goto("/guide");
    expect(response?.status()).toBe(200);

    // Page should have visible guide content
    const heading = page.getByRole("heading", { name: /structure at a glance/i });
    await expect(heading).toBeVisible();
  });

  test("displays all major sections", async ({ page }) => {
    await page.goto("/guide");

    const sections = [
      /structure at a glance/i,
      /three ways to play/i,
      /rituals/i,
      /pairing references/i,
      /flavour text/i,
    ];

    for (const sectionName of sections) {
      const heading = page.getByRole("heading", { name: sectionName });
      await expect(heading).toBeVisible();
    }
  });

  test("displays subsections for ways to play", async ({ page }) => {
    await page.goto("/guide");

    const subsections = [
      /draw three.*keep one/i,
      /feedback conversation/i,
      /team.level use/i,
    ];

    for (const name of subsections) {
      const heading = page.getByRole("heading", { name });
      await expect(heading).toBeVisible();
    }
  });

  test("displays tier indicators with text labels", async ({ page }) => {
    await page.goto("/guide");

    // Tier names must be visible as text (not colour-only)
    await expect(page.getByText(/open/i).first()).toBeVisible();
    await expect(page.getByText(/working/i).first()).toBeVisible();
    await expect(page.getByText(/deep/i).first()).toBeVisible();
  });
});

test.describe("Play Guide navigation", () => {
  test("Guide link in nav navigates to the guide page", async ({ page }) => {
    await page.goto("/");

    const guideLink = page.getByRole("navigation").getByRole("link", { name: /guide/i });
    await expect(guideLink).toBeVisible();
    await guideLink.click();

    // Should navigate to the guide page
    await expect(page).toHaveURL(/\/guide/);

    // Guide content should be visible
    const heading = page.getByRole("heading", { name: /structure at a glance/i });
    await expect(heading).toBeVisible();
  });
});

const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

for (const viewport of viewports) {
  test.describe(`Play Guide readability at ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("guide content is visible and not clipped", async ({ page }) => {
      await page.goto("/guide");

      const main = page.getByRole("main");
      await expect(main).toBeVisible();

      // No horizontal scrolling
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    });

    test("headings are readable (visible and non-empty)", async ({ page }) => {
      await page.goto("/guide");

      const headings = page.getByRole("heading");
      const count = await headings.count();
      expect(count).toBeGreaterThanOrEqual(5);

      for (let i = 0; i < Math.min(count, 8); i++) {
        const heading = headings.nth(i);
        await expect(heading).toBeVisible();
        const text = await heading.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
      }
    });
  });
}
