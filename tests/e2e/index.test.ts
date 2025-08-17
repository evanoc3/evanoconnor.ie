import { test, expect } from "@playwright/test";

test.describe("index page", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/", { timeout: 5000 });
  });

  test("has the correct page title", async ({ page }) => {
    const resp = (await page.goto("/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);

    await expect(page).toHaveTitle("evanoconnor.ie");
  });

  test("has the correct meta tags", async ({ page }) => {
    const metaCharset = page.locator("meta[charset]");
    await expect(metaCharset).toHaveAttribute("charset", "UTF-8");

    const metaViewport = page.locator("meta[name=\"viewport\"]");
    await expect(metaViewport).toHaveAttribute("content", expect.stringContaining("width=device-width"));

    const metaDescription = page.locator("meta[name=\"description\"]");
    await expect(metaDescription).toHaveAttribute("content", "Evan O'Connor's personal website");

    const metaLastBuiltTime = page.locator("meta[name=\"x-last-built-time\"]");
    expect(await metaLastBuiltTime.getAttribute("content")).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

    const linkCanonical = page.locator("link[rel=\"canonical\"]");
    if(await linkCanonical.count() === 1) {
      await expect(linkCanonical).toHaveAttribute("href", expect.stringMatching(/\/$/));
    } else {
      expect(await linkCanonical.count()).toBe(0);
    }
  });

  test("has links to other pages", async ({ page }) => {
    const cvLink = page.getByRole("link", { name: "/cv" });
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute("href", "/cv/");

    const lightspeedLink = page.getByRole("link", { name: "/experiments/lightspeed" });
    await expect(lightspeedLink).toBeVisible();
    await expect(lightspeedLink).toHaveAttribute("href", "/experiments/lightspeed/");

    const tableOfContentsLink = page.getByRole("link", { name: "/experiments/toc" });
    await expect(tableOfContentsLink).toBeVisible();
    await expect(tableOfContentsLink).toHaveAttribute("href", "/experiments/toc/");
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
