import { test, expect } from "@playwright/test";

test.describe("toc page", () => {

  test("has the correct page title", async ({ page }) => {
    const resp = (await page.goto("/experiments/toc", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);

    await expect(page).toHaveTitle("table of contents component showcase | evanoconnor.ie");
  });

  test("has the correct meta tags", async ({ page }) => {
    await page.goto("/experiments/toc", { timeout: 5000 });

    const metaCharset = page.locator("meta[charset]");
    await expect(metaCharset).toHaveAttribute("charset", "UTF-8");

    const metaViewport = page.locator("meta[name=\"viewport\"]");
    await expect(metaViewport).toHaveAttribute("content", expect.stringContaining("width=device-width"));
  });

  test("has the eoc-toc element", async ({ page }) => {
    await page.goto("/experiments/toc", { timeout: 5000 });

    const tableOfContentsElement = page.locator("eoc-toc");
    await expect(tableOfContentsElement).toBeVisible();
    await expect(tableOfContentsElement).toHaveAttribute("target-id", "main");

    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("has the back button", async ({ page }) => {
    await page.goto("/experiments/toc", { timeout: 5000 });

    const backButton = page.getByRole("button", { name: "Back" });
    await expect(backButton).toBeVisible();
  });

  test.describe("with JS disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("has the home link", async ({ page }) => {
      await page.goto("/experiments/toc", { timeout: 5000 });

      const homeLink = page.getByRole("link", { name: "Home" });
      await expect(homeLink).toBeVisible();
    });

    test("the back button is hidden", async ({ page }) => {
      await page.goto("/experiments/toc", { timeout: 5000 });

      const backButton = page.getByRole("button", { name: "Back" });
      await expect(backButton).toBeHidden();
    });
  });

});
