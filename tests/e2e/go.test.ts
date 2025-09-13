import { test, expect } from "@playwright/test";
import { successfulNavigation, validateLinkTags, validateMetaTags, validateSitemap } from "../e2e-test-utils.ts";

test.describe("/playground/go/", () => {

  test.beforeEach(async ({ page }) => {
    await successfulNavigation(page, "/playground/go/");
  });

  test("has the correct metadata", async ({ page }) => {
    await expect(page).toHaveTitle("Go Game | evanoconnor.ie");

    await validateMetaTags(page, {
      description: "Demonstration of aninteractive Go board component"
    });

    await validateLinkTags(page, {
      canonicalLinkValue: "/playground/go/$"
    });
  });

  test("has a valid sitemap", async ({ page }) => {
    await validateSitemap(page);
  });

  test("has the back button (with JS enabled)", async ({ page }) => {
    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();
  });

  test("has the <eoc-goboard /> tag", async ({ page }) => {
    const goBoardElement = page.locator("eoc-goboard");
    await expect(goBoardElement).toBeVisible();
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
