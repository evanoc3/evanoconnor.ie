import { test, expect } from "@playwright/test";


test("landing page has correct page title", async ({ page }) => {
  const resp = (await page.goto("/"))!;
  expect(resp).not.toBeNull();
  expect(resp.status()).toBe(200);

  await expect(page).toHaveTitle(/evanoconnor\.ie/);
});


test("landing page has links to other pages", async ({ page }) => {
  await page.goto("/");

  const cvLink = page.getByRole("link", { name: "/cv" });
  await expect(cvLink).toBeVisible();
  await expect(cvLink).toHaveAttribute("href", "/cv");

  const lightspeedLink = page.getByRole("link", { name: "/experiments/lightspeed" });
  await expect(lightspeedLink).toBeVisible();
  await expect(lightspeedLink).toHaveAttribute("href", "/experiments/lightspeed");
});
