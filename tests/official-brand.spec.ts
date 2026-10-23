import { expect, test } from "@playwright/test";

test("marca oficial carrega sem distorção no cabeçalho e rodapé", async ({
  page,
}) => {
  await page.goto("/");
  const logo = page.locator(".site-header img:visible");
  await expect(logo).toHaveAttribute("src", "/media/brand/valetto-branca.webp");
  await expect(logo).toHaveAttribute(
    "alt",
    "Valetto — Motorcycle Concierge e Transporte",
  );
  await expect
    .poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBe(1983);
  const box = (await logo.boundingBox())!;
  const header = (await page.locator(".site-header").boundingBox())!;
  expect(Math.abs(box.width / box.height - 1983 / 793)).toBeLessThan(0.01);
  expect(box.y).toBeGreaterThanOrEqual(header.y);
  expect(box.y + box.height).toBeLessThanOrEqual(header.y + header.height);
  const footer = page.locator(".footer-brand");
  await footer.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      footer.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBe(1983);
  await expect(page.locator(".site-footer p")).toHaveText(
    "Você entrega a chave. Nós cuidamos do resto.",
  );
});

test("marca permanece disponível sem JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator(".site-header img:visible")).toBeVisible();
  await expect(page.locator(".site-header img:visible")).toHaveJSProperty(
    "naturalWidth",
    1983,
  );
  await context.close();
});
