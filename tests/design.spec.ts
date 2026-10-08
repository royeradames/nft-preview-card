import { expect, test, type Page } from "@playwright/test";

const siteName = "NFT Preview Card";
const siteUrl = "https://nft-preview-card.royeradames.com/";

async function box(page: Page, selector: string) {
  const found = await page.locator(selector).first().boundingBox();
  if (!found) throw new Error(`${selector} has no box`);
  return found;
}

async function smallText(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || parent.closest("script,style,noscript,.sr-only")) continue;
      if (parent.getClientRects().length === 0) continue;
      if (parseFloat(getComputedStyle(parent).fontSize) < 16) out.push(node.textContent.trim());
    }
    return out;
  });
}

test("declares one site name in og:site_name and WebSite JSON-LD, with canonical, Open Graph image and icons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", siteName);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl });
  // Canonical, og:url and the WebSite url name the same address.
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
  expect(new URL(canonical!).href).toBe(siteUrl);
  expect(new URL(ogUrl!).href).toBe(siteUrl);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Equilibrium/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  for (const href of await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))) {
    expect((await page.request.get(href)).status(), href).toBe(200);
  }
});

test("desktop frame matches the Figma card, type and spacing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const card = await box(page, ".artwork-card");
  expect(card.width).toBe(350);
  expect(Math.abs(card.height - 596)).toBeLessThanOrEqual(6);
  expect(Math.abs(card.x + card.width / 2 - 720)).toBeLessThanOrEqual(1);
  expect(Math.abs(card.y + card.height / 2 - 450)).toBeLessThanOrEqual(4);
  await expect(page.locator(".artwork-card")).toHaveCSS("padding-left", "24px");
  await expect(page.locator(".artwork-card")).toHaveCSS("border-radius", "15px");
  await expect(page.locator(".artwork-card")).toHaveCSS("background-color", "rgb(21, 38, 63)");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(13, 25, 44)");

  const image = await box(page, ".artwork");
  expect([image.width, image.height]).toEqual([302, 302]);
  const title = page.getByRole("heading", { level: 1 });
  await expect(title).toHaveCSS("font-size", "22px");
  await expect(title).toHaveCSS("font-weight", "600");
  await expect(page.locator(".text-link")).toHaveCSS("color", "rgb(255, 255, 255)");
  const titleBox = await box(page, "h1");
  expect(titleBox.y - (image.y + image.height)).toBeCloseTo(24, 0);
  const description = page.locator(".description");
  await expect(description).toHaveCSS("font-size", "18px");
  await expect(description).toHaveCSS("line-height", "26px");
  await expect(description).toHaveCSS("font-weight", "300");
  const descriptionBox = await box(page, ".description");
  expect(descriptionBox.y - (titleBox.y + titleBox.height)).toBeCloseTo(16, 0);
  const facts = await box(page, ".artwork-facts");
  expect(facts.y - (descriptionBox.y + descriptionBox.height)).toBeCloseTo(24, 0);
  await expect(page.locator(".price")).toHaveCSS("color", "rgb(0, 255, 248)");
  const creator = await box(page, ".creator");
  // The 1 px divider sits 24 px below the facts and 24 px above the creator row.
  expect(creator.y - (facts.y + facts.height)).toBeCloseTo(24, 0);
  await expect(page.locator(".creator")).toHaveCSS("border-top-color", "rgb(46, 64, 90)");
  await expect(page.locator(".creator")).toHaveCSS("padding-top", "24px");
  const avatar = await box(page, ".creator > img");
  expect([avatar.width, avatar.height]).toEqual([33, 33]);
  await expect(page.locator(".creator summary")).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("hover states follow the Figma active frame: cyan overlay with the eye, cyan title and creator", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".artwork-button").hover();
  await expect(page.locator(".view-overlay")).toHaveCSS("opacity", "1");
  await expect(page.locator(".view-overlay")).toHaveCSS("background-color", "rgba(0, 255, 248, 0.5)");
  await page.locator(".text-link").hover();
  await expect(page.locator(".text-link")).toHaveCSS("color", "rgb(0, 255, 248)");
  await page.locator(".creator summary").hover();
  await expect(page.locator(".creator summary")).toHaveCSS("color", "rgb(0, 255, 248)");
});

test("mobile frame follows the 375 px design", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const card = await box(page, ".artwork-card");
  expect(card.width).toBe(350);
  expect(Math.abs(card.x - 12.5)).toBeLessThanOrEqual(1);
  expect(Math.abs(card.height - 596)).toBeLessThanOrEqual(6);
});

async function avatarOffFirstLine(page: Page) {
  const avatar = await box(page, ".creator > img");
  const firstLine = await page.locator(".creator-copy").evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rect = range.getClientRects()[0];
    return { top: rect.top, bottom: rect.bottom };
  });
  const centre = avatar.y + avatar.height / 2;
  return centre < firstLine.top || centre > firstLine.bottom ? `avatar centre ${centre} outside first line ${firstLine.top}-${firstLine.bottom}` : null;
}

async function factIconsOffText(page: Page) {
  // Compare each icon with its own text node, not with a range that includes the icon.
  return page.locator(".artwork-facts dd").evaluateAll((items) => items.flatMap((item) => {
    const icon = item.querySelector("img")!.getBoundingClientRect();
    const text = [...item.childNodes].find((node) => node.nodeType === Node.TEXT_NODE)!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const line = range.getClientRects()[0];
    const offset = Math.abs(icon.top + icon.height / 2 - (line.top + line.height / 2));
    return offset > 2 ? [`${item.textContent} icon ${offset.toFixed(1)} px off its text`] : [];
  }));
}

test("width sweep 320 to 1600 px in 10 px steps: no page scroll, 16 px floor, icons on the first line of their text", async ({ page }) => {
  await page.goto("/");
  const failures: string[] = [];
  for (let width = 320; width <= 1600; width += 10) {
    await page.setViewportSize({ width, height: 900 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) failures.push(`${width}: page scroll`);
    const small = await smallText(page);
    if (small.length) failures.push(`${width}: small text ${small.join(" | ")}`);
    const avatar = await avatarOffFirstLine(page);
    if (avatar) failures.push(`${width}: ${avatar}`);
    for (const icon of await factIconsOffText(page)) failures.push(`${width}: ${icon}`);
  }
  expect(failures).toEqual([]);
});

test("the avatar stays on the first line when the credit is open and when text is enlarged to 200%", async ({ page }) => {
  await page.goto("/");
  await page.locator(".creator details").evaluate((details) => { (details as HTMLDetailsElement).open = true; });
  const failures: string[] = [];
  for (const width of [320, 400, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const open = await avatarOffFirstLine(page);
    if (open) failures.push(`${width} open: ${open}`);
  }
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  for (const width of [320, 400, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const enlarged = await avatarOffFirstLine(page);
    if (enlarged) failures.push(`${width} 200%: ${enlarged}`);
  }
  expect(failures).toEqual([]);
});
