import { expect, test } from "@playwright/test";

test("demonstração preserva medidas CSS e imagens alterando somente a família", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const inspect = async (path: string) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const headings = await page
      .locator("#hero-title, #essence-title, #experience-title")
      .evaluateAll((elements) =>
        elements.map((el) => {
          const s = getComputedStyle(el);
          return {
            text: el.textContent,
            size: s.fontSize,
            lineHeight: s.lineHeight,
            weight: s.fontWeight,
            tracking: s.letterSpacing,
          };
        }),
      );
    const images = await page
      .locator("main picture source, main figure img, .hero-poster img")
      .evaluateAll((elements) =>
        elements.map((el) => ({
          src: el.getAttribute("src"),
          srcSet: el.getAttribute("srcset"),
          sizes: el.getAttribute("sizes"),
          width: el.getAttribute("width"),
          height: el.getAttribute("height"),
        })),
      );
    return {
      headings,
      images,
      hero: await page.locator(".hero").evaluate((el) => el.innerHTML),
      description: await page.locator(".hero-description").textContent(),
    };
  };
  const home = await inspect("/");
  const current = await inspect("/revisao/inter/atual");
  const inter = await inspect("/revisao/inter/inter");
  expect(current.headings).toEqual(home.headings);
  expect(inter.headings).toEqual(home.headings);
  expect(inter.images).toEqual(current.images);
  expect(current.description).toEqual(home.description);
  expect(inter.description).toEqual(home.description);
  await expect(page.locator("main")).toHaveCSS(
    "font-family",
    '"Valetto Scene Inter", Arial, Helvetica, sans-serif',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});

test("fontes do recorte permanecem isoladas da home e conteúdo funciona sem JavaScript", async ({
  page,
  browser,
  baseURL,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") requests.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(new Set(requests).size).toBe(1);
  await page.goto("/revisao/inter/atual");
  await page.waitForLoadState("networkidle");
  expect(new Set(requests).size).toBe(1);
  await page.goto("/revisao/inter/inter");
  await page.evaluate(() => document.fonts.ready);
  expect(new Set(requests).size).toBe(2);
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto(`${baseURL}/revisao/inter/inter`);
    await expect(staticPage.locator("#hero-title")).toBeVisible();
    await expect(staticPage.locator("#essence-title")).toBeVisible();
    await expect(staticPage.locator("#experience-title")).toBeVisible();
  } finally {
    await context.close();
  }
});
