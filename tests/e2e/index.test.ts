import { test, expect } from "@playwright/test";
import { hasLink, successfulNavigation, validateLinkTags, validateMetaTags, validateSitemap } from "../e2e-test-utils.ts";

test.describe("/", () => {

  test.beforeEach(async ({ page }) => {
    await successfulNavigation(page, "/");
  });

  test("has the correct metadata", async ({ page }) => {
    await expect(page).toHaveTitle(/Homepage/);

    await validateMetaTags(page, {
      description: "Homepage of Evan O'Connor's personal website",
    });

    const metaLastBuiltTime = page.locator("meta[name=\"x-last-built-time\"]");
    await expect(metaLastBuiltTime).toHaveAttribute("content", expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/));

    await validateLinkTags(page, {
      canonicalLinkValue: "/$"
    });
  });

  test("has a valid sitemap", async ({ page }) => {
    await validateSitemap(page);
  });

  test("has links to other pages", async ({ page }) => {
    await hasLink(page, "/cv", "/cv/");
    await hasLink(page, "/playground/lightspeed", "/playground/lightspeed/");
    await hasLink(page, "/playground/table-of-contents", "/playground/table-of-contents/");
  });

  test("footer is visible (with JS enabled)", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test.describe("with JS disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("footer is hidden", async ({ page }) => {
      const footer = page.locator("footer");
      await expect(footer).toBeHidden();
    });
  });

});
