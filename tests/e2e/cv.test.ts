import { test, expect } from "@playwright/test";
import { validateLinkTags, validateMetaTags } from "../e2e-test-utils.ts";

test.describe("/cv/", () => {

  test.beforeEach(async ({ page }) => {
    const resp = (await page.goto("/cv/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);
  });

  test("has the correct metadata", async ({ page }) => {
    await expect(page).toHaveTitle("CV | evanoconnor.ie");

    await validateMetaTags(page, {
      description: "Evan O'Connor's CV"
    });

    await validateLinkTags(page, {
      canonicalLinkValue: "/cv/$"
    });
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
