import { test, expect } from "@playwright/test";

test.describe("CV page", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/cv/", { timeout: 5000 });
  });

  test("has the correct page title", async ({ page }) => {
    const resp = (await page.goto("/cv/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);

    await expect(page).toHaveTitle("CV | evanoconnor.ie");
  });

  test("has the correct meta tags", async ({ page }) => {
    const metaCharset = page.locator("meta[charset]");
    await expect(metaCharset).toHaveAttribute("charset", "UTF-8");

    const metaViewport = page.locator("meta[name=\"viewport\"]");
    await expect(metaViewport).toHaveAttribute("content", expect.stringContaining("width=device-width"));

    const linkCanonical = page.locator("link[rel=\"canonical\"]");
    if(await linkCanonical.count() === 1) {
      await expect(linkCanonical).toHaveAttribute("href", expect.stringMatching(/\/cv\/$/));
    }
    else {
      expect(await linkCanonical.count()).toBe(0);
    }
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
