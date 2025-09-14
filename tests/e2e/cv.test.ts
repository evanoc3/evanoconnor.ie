import { test, expect } from "@playwright/test";
import { successfulNavigation, validateLinkTags, validateMetaTags, validateSitemap } from "../e2e-test-utils.ts";

test.describe("/cv/", () => {

  test.beforeEach(async ({ page }) => {
    await successfulNavigation(page, "/cv/");
  });

  test("has the correct metadata", async ({ page }) => {
    await expect(page).toHaveTitle(/CV/);

    await validateMetaTags(page, {
      description: "CV for Evan O'Connor"
    });

    await validateLinkTags(page, {
      canonicalLinkValue: "/cv/$"
    });
  });

  test("has a valid sitemap", async ({ page }) => {
    await validateSitemap(page);
  });

  test("has the back button (with JS enabled)", async ({ page }) => {
    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();
  });

  test.describe("with JS disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("has the home link", async ({ page }) => {
      const homeLink = page.getByRole("link", { name: "Home" });
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute("href", "/");
    });

    test("the back button is hidden", async ({ page }) => {
      const backButton = page.getByRole("button", { name: "Back" });
      await expect(backButton).toBeHidden();
    });
  });

});
