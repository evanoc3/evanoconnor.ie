import { test, expect } from "@playwright/test";
import { hasLink, validateCanonicalLink, validateMetaTags } from "../e2e-test-utils.ts";

test.describe("lightspeed page", () => {

  test.beforeEach(async ({ page }) => {
    const resp = (await page.goto("/playground/lightspeed/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);
  });

  test("has the correct metadata", async ({ page }) => {
    await expect(page).toHaveTitle("Lightspeed scroll animation | evanoconnor.ie");

    await validateMetaTags(page, {
      description: "Demonstration of a 'lightspeed' scroll animation effect using canvas and JavaScript.",
      keywords: ["lightspeed", "scroll", "animation", "canvas", "JavaScript", "JS"]
    });

    await validateCanonicalLink(page, "/playground/lightspeed/$");
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
