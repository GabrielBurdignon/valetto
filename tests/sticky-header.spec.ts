import { test, expect } from "@playwright/test";

test("cabeçalho persistente preserva destinos e folga das âncoras", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const header = page.locator(".site-header");
  const height = (await header.boundingBox())!.height;
  for (const id of [
    "essencia",
    "filosofia",
    "como-funciona",
    "servicos",
    "lancamento",
  ]) {
    await header.locator(`a[href="/#${id}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
    expect(
      (await page.locator(`#${id}`).boundingBox())!.y,
    ).toBeGreaterThanOrEqual(height);
  }
});

test("menu compacto no tablet e paisagem permite teclado e rolagem interna", async ({
  page,
}) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const button = page.getByRole("button", { name: "Abrir menu" });
    await button.click();
    const nav = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(
      nav.getByRole("link", { name: "Nossa filosofia" }),
    ).toBeVisible();
    await nav.getByRole("link").last().focus();
    const last = (await nav.getByRole("link").last().boundingBox())!;
    expect(last.y + last.height).toBeLessThanOrEqual(viewport.height);
    await page.keyboard.press("Tab");
    await expect(nav).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
});

test("sticky da filosofia permanece abaixo do cabeçalho", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const viewport of [
    { width: 1440, height: 390 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const story = page.locator("[data-philosophy-story]");
    await story
      .locator("[data-philosophy-chapter]")
      .nth(1)
      .evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
    await expect(story).toHaveAttribute("data-enhanced", "true");
    await expect
      .poll(
        async () =>
          (await story.locator("[data-philosophy-visual]").boundingBox())!.y,
      )
      .toBeGreaterThanOrEqual(
        (await page.locator(".site-header").boundingBox())!.height,
      );
    const box = (await story
      .locator("[data-philosophy-visual]")
      .boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  }
});
