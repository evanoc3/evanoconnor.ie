import { test, expect } from "@playwright/test";


test.describe("/sitemap-index.xml", () => {

  test.beforeEach(async ({ page }) => {
    const resp = (await page.goto("/sitemap-index.xml", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);
  });

  test("it contains a link to /sitemap-0.xml", async ({ page }) => {
    await page.getByText("/sitemap-0.xml").count() === 1;
  });

});


test.describe("/sitemap-0.xml", () => {

  test("it exists", async ({ page }) => {
    const resp = (await page.goto("/sitemap-0.xml", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);
  });

});
