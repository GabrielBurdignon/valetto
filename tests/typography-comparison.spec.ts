import { expect, test } from "@playwright/test";

test("home carrega só Inter aprovada e o estudo mantém suas fontes isoladas", async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") fonts.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(fonts).toHaveLength(1);
  await page.goto("/revisao/tipografia");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  expect(new Set(fonts).size).toBe(3);
  expect(
    fonts.every((url) => new URL(url).origin === new URL(page.url()).origin),
  ).toBe(true);
  await expect(page.locator("[data-font-family]")).toHaveCount(3);
  const samples = await page
    .locator('[data-sample="hero"]')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return {
          size: style.fontSize,
          weight: style.fontWeight,
          lineHeight: style.lineHeight,
          width: element.getBoundingClientRect().width,
        };
      }),
    );
  expect(samples[0]).toEqual(samples[1]);
  expect(samples[1]).toEqual(samples[2]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("comparação mantém todos os textos sem JavaScript e não entra no sitemap", async ({
  browser,
  baseURL,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/revisao/tipografia`);
    await expect(
      page.getByText(
        "A Valetto nasce para cuidar da logística da sua motocicleta:",
        { exact: false },
      ),
    ).toHaveCount(3);
    await expect(page.locator("[data-font-family]")).toHaveCount(3);
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toContain("/revisao/");
  } finally {
    await context.close();
  }
});
