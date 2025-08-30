import { expect, type Page } from "@playwright/test";


type validateMetaTagsOptions = Partial<{
  description: string | RegExp;
  keywords: string[]
}>

export async function validateMetaTags(page: Page, opts?: validateMetaTagsOptions): Promise<void> {
  // charset
  const metaCharset = page.locator("meta[charset]");
  await expect(metaCharset).toHaveAttribute("charset", "UTF-8");

  // viewport
  const metaViewport = page.locator("meta[name=\"viewport\"]");
  await expect(metaViewport).toHaveAttribute("content", "width=device-width, initial-scale=1.0");

  // author
  const metaAuthor = page.locator("meta[name=\"author\"]");
  await expect(metaAuthor).toHaveAttribute("content", "Evan O'Connor");

  // description
  if(opts?.description) {
    const metaDescription = page.locator("meta[name=\"description\"]");
    if(typeof opts?.description === "string") {
      await expect(metaDescription).toHaveAttribute("content", opts.description);
    }
    else {
      await expect(metaDescription).toHaveAttribute("content", expect.stringMatching(opts.description));
    }
  }

  // keywords
  if(opts?.keywords) {
    const metaKeywords = page.locator("meta[name=\"keywords\"]");
    await expect(metaKeywords).toHaveAttribute("content");
    const keywordsContent = (await metaKeywords.getAttribute("content"))!;
    expect(keywordsContent.split(", ")).toEqual(opts.keywords);
  }
}

type ValidateLinkTagsOptions = {
  canonicalLinkValue: string | RegExp;
}

export async function validateLinkTags(page: Page, opts: ValidateLinkTagsOptions): Promise<void> {
  // sitemap
  const linkSitemap = page.locator("link[rel=\"sitemap\"]");
  await expect(linkSitemap).toHaveAttribute("href", "/sitemap-index.xml");

  // canonical
  const linkCanonical = page.locator("link[rel=\"canonical\"]");
  if(await linkCanonical.count() === 1) {
    await expect(linkCanonical).toHaveAttribute("href", expect.stringMatching(opts.canonicalLinkValue));
  }
  else {
    expect(await linkCanonical.count()).toBe(0);
  }
}



export async function hasLink(page: Page, linkText: string, linkHref: string): Promise<void> {
  const link = page.getByRole("link", { name: linkText });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", linkHref);
}
