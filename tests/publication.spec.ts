import { test, expect } from "@playwright/test";

test("metadados, rotas públicas e destinos internos são consistentes", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://valetto.com.br",
  );
  await expect(
    page.getByRole("link", {
      name: "VALETTO Motorcycle Concierge, início",
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page
      .locator('a[href*="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href")!.split("#")[1])
          .filter((id) => id && !document.getElementById(id)),
      ),
  ).toEqual([]);
  await page.goto("/privacidade");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://valetto.com.br/privacidade",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://valetto.com.br/privacidade",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://valetto.com.br/privacidade");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain(
    "Sitemap: https://valetto.com.br/sitemap.xml",
  );
  expect(
    (await request.get("/opengraph-image")).headers()["content-type"],
  ).toContain("image/png");
  expect((await request.get("/rota-inexistente-auditoria")).status()).toBe(404);
});

test("menu móvel fecha com Escape e devolve foco ao botão", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Abrir menu" });
  await button.focus();
  await page.keyboard.press("Enter");
  const nav = page.getByRole("navigation", { name: "Navegação móvel" });
  await expect(nav).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(button).toBeFocused();
  await button.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(nav).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("menu e links continuam utilizáveis no mobile sem JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const nav = page.getByRole("navigation", {
      name: "Navegação sem JavaScript",
    });
    await expect(nav).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeHidden();
    for (const [name, hash] of [
      ["A essência", "essencia"],
      ["Nossa filosofia", "filosofia"],
      ["Como funciona", "como-funciona"],
      ["A experiência", "servicos"],
      ["Acompanhe o lançamento", "lancamento"],
    ]) {
      await nav.getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${hash}$`));
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  } finally {
    await context.close();
  }
});

test("palco sticky cabe integralmente em desktop de altura reduzida", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 390 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const story = page.locator("[data-philosophy-story]");
  await story
    .locator("[data-philosophy-chapter]")
    .nth(1)
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(story).toHaveAttribute("data-enhanced", "true");
  const box = await story.locator("[data-philosophy-visual]").boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
