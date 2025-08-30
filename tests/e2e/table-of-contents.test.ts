import { test, expect } from "@playwright/test";
import { hasLink, validateLinkTags, validateMetaTags } from "../e2e-test-utils.ts";

test.describe("/playground/table-of-contents/", () => {

  test.beforeEach(async ({ page }) => {
    const resp = (await page.goto("/playground/table-of-contents/", { timeout: 5000 }))!;
    expect(resp).not.toBeNull();
    expect(resp.status()).toBe(200);
  });

  test("has the correct meta tags", async ({ page }) => {
    await expect(page).toHaveTitle("Table of Contents component | evanoconnor.ie");

    await validateMetaTags(page, {
      description: "Demonstration of a Table of Contents component built with Lit.",
      keywords: ["custom component", "Lit", "TypeScript"]
    });

    await validateLinkTags(page, {
      canonicalLinkValue: "/playground/toc/$"
    });
  });

  test("has the eoc-toc element", async ({ page }) => {
    const tableOfContentsElement = page.locator("eoc-toc");
    await expect(tableOfContentsElement).toBeVisible();
    await expect(tableOfContentsElement).toHaveAttribute("target-id", "main");

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
