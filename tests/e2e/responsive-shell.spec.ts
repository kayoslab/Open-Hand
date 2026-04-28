import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
] as const;

for (const viewport of viewports) {
  test.describe(`Layout shell at ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test("no horizontal scrolling occurs", async ({ page }) => {
      await page.goto("/");
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasHorizontalScroll).toBe(false);
    });

    test("header is visible", async ({ page }) => {
      await page.goto("/");
      const header = page.getByRole("banner");
      await expect(header).toBeVisible();
    });

    test("navigation is accessible", async ({ page }) => {
      await page.goto("/");
      const nav = page.getByRole("navigation");
      if (viewport.width >= 768) {
        await expect(nav).toBeVisible();
      } else {
        // On mobile, nav is hidden behind hamburger menu
        await expect(nav).toBeAttached();
        const hamburger = page.getByLabel(/open menu/i);
        await hamburger.click();
        await expect(nav).toBeVisible();
      }
    });

    test("main content area is visible", async ({ page }) => {
      await page.goto("/");
      const main = page.getByRole("main");
      await expect(main).toBeVisible();
    });
  });
}

test.describe("Navigation keyboard accessibility", () => {
  test("navigation links are keyboard-focusable with visible focus indicators", async ({
    page,
  }) => {
    await page.goto("/");
    const navLinks = page.getByRole("navigation").getByRole("link");
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await link.focus();
      await expect(link).toBeFocused();

      // Verify a visible focus indicator exists (outline or box-shadow)
      const hasVisibleFocus = await link.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        const hasOutline =
          styles.outlineStyle !== "none" && styles.outlineWidth !== "0px";
        const hasBoxShadow = styles.boxShadow !== "none";
        return hasOutline || hasBoxShadow;
      });
      expect(hasVisibleFocus).toBe(true);
    }
  });
});

test.describe("Layout usability at desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("all regions are appropriately sized", async ({ page }) => {
    await page.goto("/");

    const header = page.getByRole("banner");
    const nav = page.getByRole("navigation");
    const main = page.getByRole("main");

    const headerBox = await header.boundingBox();
    const navBox = await nav.boundingBox();
    const mainBox = await main.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(mainBox).not.toBeNull();

    // Header should span a reasonable width
    expect(headerBox!.width).toBeGreaterThan(500);

    // Main content should have meaningful height
    expect(mainBox!.height).toBeGreaterThan(0);

    // Nav should have meaningful dimensions
    expect(navBox!.width).toBeGreaterThan(0);
    expect(navBox!.height).toBeGreaterThan(0);
  });
});
