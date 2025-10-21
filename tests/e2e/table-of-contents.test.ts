import { test, expect } from "@playwright/test";
import { hasLink, successfulNavigation, validateLinkTags, validateMetaTags, validateSitemap } from "../e2e-test-utils.ts";

test.describe("/playground/table-of-contents/", () => {

  test.beforeEach(async ({ page }) => {
    await successfulNavigation(page, "/playground/table-of-contents/");
  });

  test("has the correct meta tags", async ({ page }) => {
    await expect(page).toHaveTitle(/Table of Contents component showcase/);

    await validateMetaTags(page, {
      description: "Demonstration of a Table of Contents component built with Lit.",
      keywords: ["custom component", "Lit", "TypeScript"]
    });

    await validateLinkTags(page, {
      canonicalLinkValue: "/playground/toc/$"
    });
  });

  test("has a valid sitemap", async ({ page }) => {
    await validateSitemap(page);
  });

  test("has the div.table-of-contents element", async ({ page }) => {
    const tableOfContentsElement = page.locator("div.table-of-contents");
    await expect(tableOfContentsElement).toBeVisible();

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("has the back button (with JS enabled)", async ({ page }) => {
    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();
  });

  test.describe("with JS disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("has the home link", async ({ page }) => {
      await hasLink(page, "Home", "/");
    });

    test("the back button is hidden", async ({ page }) => {
      const backButton = page.getByRole("button", { name: "Back" });
      await expect(backButton).toBeHidden();
    });
  });

});
