import { test, expect } from "@playwright/test";
test("editorial, navegação e política acessíveis", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sua moto precisa ir. Você não.",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const menu = page.getByRole("button", { name: "Abrir menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(
      page.getByRole("button", { name: "Fechar menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("navigation", { name: "Navegação móvel" })
      .getByRole("link", { name: "Como funciona" })
      .click();
    await expect(
      page.getByRole("button", { name: "Abrir menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Como funciona" })
      .click();
  }
  await expect(page).toHaveURL(/#como-funciona$/);
  await expect(
    page.getByRole("list").first().getByRole("listitem"),
  ).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: "Acompanhe no Instagram" }),
  ).toHaveAttribute("href", "https://www.instagram.com/valettomotos/");
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-home.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "Privacidade", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacidade.",
  );
  expect(errors).toEqual([]);
});
test("atalho de teclado e redução de movimento", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("atalho transfere foco ao conteúdo principal", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.goto("/privacidade");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});
