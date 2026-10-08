import { expect, test } from "@playwright/test";

test("renders the supplied artwork, credit and sample values", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("NFT preview card | Royer Adames");
  await expect(page.getByRole("heading", { name: "Equilibrium #3429", exact: true })).toBeVisible();
  await expect(page.getByText("Our Equilibrium collection promotes balance and calm.")).toBeVisible();
  await expect(page.getByText("0.041 ETH", { exact: true })).toBeVisible();
  await expect(page.getByText("3 days left", { exact: true })).toBeVisible();
  const artwork = page.getByRole("link", { name: "Equilibrium #3429", exact: true }).first().locator("img").first();
  await expect(artwork).toHaveAttribute("src", "/images/image-equilibrium.jpg");
  expect(await artwork.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
});

test("hover and keyboard expose the artwork and its original image destination", async ({ page }) => {
  await page.goto("/");
  const artwork = page.getByRole("link", { name: "Equilibrium #3429", exact: true }).first();
  const overlay = artwork.locator(".view-overlay");
  await artwork.hover();
  await expect(overlay).toHaveCSS("opacity", "1");
  await page.mouse.move(0, 0);
  await artwork.focus();
  await expect(overlay).toHaveCSS("opacity", "1");
  const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === "/images/image-equilibrium.jpg");
  await page.keyboard.press("Enter");
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/jpeg");
  await page.goBack();
  const title = page.getByRole("link", { name: "Equilibrium #3429", exact: true }).last();
  await title.focus();
  await expect(title).toHaveCSS("color", "rgb(0, 255, 248)");
  await expect(title).toHaveAttribute("href", "/images/image-equilibrium.jpg");
});

test("creator credit expands inline by keyboard without an overlay or focus trap", async ({ page }) => {
  await page.goto("/");
  const creator = page.locator("summary").filter({ hasText: "Jules Wyvern" });
  const credit = page.getByText("Artwork credit from the Frontend Mentor practice card.");
  await expect(credit).toBeHidden();
  await creator.focus();
  await expect(creator).toHaveCSS("color", "rgb(0, 255, 248)");
  await page.keyboard.press("Enter");
  await expect(credit).toBeVisible();
  await expect(creator).toBeFocused();
  await page.keyboard.press("Space");
  await expect(credit).toBeHidden();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Frontend Mentor", exact: true })).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("fits narrow and enlarged layouts with the family text and target floors", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallText = await page.locator("h1, p, dt, dd, summary, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    // Footer links keep 44 px targets. The card's title link and creator name keep the Figma type size, so they meet the 24 px WCAG 2.5.8 floor instead.
    for (const control of await page.locator("footer a").all()) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }
    for (const control of await page.locator(".artwork-card a, .artwork-card summary").all()) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(24);
      expect(box?.width).toBeGreaterThanOrEqual(24);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator("summary")).toBeVisible();
});

test("native artwork and credit controls work with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: `http://127.0.0.1:${process.env.PORT ?? 4389}`, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Equilibrium #3429", exact: true })).toBeVisible();
    await page.locator("summary").click();
    await expect(page.getByText("Artwork credit from the Frontend Mentor practice card.")).toBeVisible();
    const responsePromise = page.waitForResponse(response => new URL(response.url()).pathname === "/images/image-equilibrium.jpg");
    await page.getByRole("link", { name: "Equilibrium #3429", exact: true }).first().click();
    expect((await responsePromise).status()).toBe(200);
    expect(new URL(page.url()).search).toBe("");
    expect(writes).toEqual([]);
  } finally {
    await context.close();
  }
});
