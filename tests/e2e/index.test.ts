import { test, expect } from "@playwright/test";

test.describe("index page", () => {

  test("has the correct page title", async ({ page }) => {
    const resp = (await page.goto("/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);

    await expect(page).toHaveTitle("evanoconnor.ie");
  });

  test("has the correct meta tags", async ({ page }) => {
    await page.goto("/", { timeout: 5000 });

    const metaCharset = page.locator("meta[charset]");
    await expect(metaCharset).toHaveAttribute("charset", "UTF-8");

    const metaViewport = page.locator("meta[name=\"viewport\"]");
    await expect(metaViewport).toHaveAttribute("content", expect.stringContaining("width=device-width"));

    const metaDescription = page.locator("meta[name=\"description\"]");
    await expect(metaDescription).toHaveAttribute("content", "Evan O'Connor's personal website");

    const metaLastBuiltTime = page.locator("meta[name=\"x-last-built-time\"]");
    expect(await metaLastBuiltTime.getAttribute("content")).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  test("has links to other pages", async ({ page }) => {
    await page.goto("/", { timeout: 5000 });

    const cvLink = page.getByRole("link", { name: "/cv" });
    await expect(cvLink).toBeVisible();
    await expect(cvLink).toHaveAttribute("href", "/cv");

    const lightspeedLink = page.getByRole("link", { name: "/experiments/lightspeed" });
    await expect(lightspeedLink).toBeVisible();
    await expect(lightspeedLink).toHaveAttribute("href", "/experiments/lightspeed");
  });

  test("footer is visible (with JS enabled)", async ({ page }) => {
    await page.goto("/", { timeout: 5000 });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test.describe("with JS disabled", () => {
    test.use({ javaScriptEnabled: false });

    test("footer is hidden", async ({ page }) => {
      await page.goto("/", { timeout: 5000 });

      const footer = page.locator("footer");
      await expect(footer).toBeHidden();
    });
  });

});
