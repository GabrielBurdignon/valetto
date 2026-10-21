import { test, expect } from "@playwright/test";

const titles = ["Conveniência", "Responsabilidade", "Atenção aos detalhes"];
test("narrativa coordena palco e capítulos, inclusive ao rolar para trás", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const root = page.locator("[data-philosophy-story]");
  const chapters = root.locator("[data-philosophy-chapter]");
  await expect(chapters).toHaveCount(3);
  const scenes = root.locator("[data-philosophy-scene]");
  await expect(scenes).toHaveCount(3);
  expect(
    await scenes.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-philosophy-scene")),
    ),
  ).toEqual(["cockpit", "engineering", "finish"]);
  await expect(root.locator('[data-asset-state="configured"]')).toHaveCount(3);

  for (const index of [0, 1, 2, 1, 0]) {
    await chapters
      .nth(index)
      .evaluate((element) =>
        element.scrollIntoView({ block: "center", behavior: "instant" }),
      );
    await expect(root).toHaveAttribute("data-enhanced", "true");
    await expect(root).toHaveAttribute("data-active", String(index + 1));
    await expect
      .poll(() =>
        root
          .locator("[data-philosophy-layer]")
          .nth(index)
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.98);
    await expect(
      chapters.nth(index).getByRole("heading", { level: 3 }),
    ).toHaveText(titles[index]);
  }
  await expect(root.locator("[data-philosophy-visual]")).toHaveCSS(
    "position",
    "sticky",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await expect(root.locator("canvas")).toHaveCount(0);
  const panels =
    page.viewportSize()!.width > 900
      ? root.locator("[data-philosophy-layer]")
      : root.locator("[data-philosophy-static-scene]");
  for (let index = 0; index < 3; index++) {
    const panel = panels.nth(index);
    await chapters.nth(index).scrollIntoViewIfNeeded();
    await expect(panel).toBeVisible();
    await expect
      .poll(() =>
        panel
          .locator("img")
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    const source = await panel
      .locator("img")
      .evaluate((image: HTMLImageElement) => image.currentSrc);
    expect(source).toContain(["cockpit", "engineering", "finish"][index]);
    expect(source).not.toContain("original.png");
  }
  expect(errors).toEqual([]);
});

test("redução de movimento desfaz o palco animado e mantém leitura completa", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const root = page.locator("[data-philosophy-story]");
  await root
    .locator("[data-philosophy-chapter]")
    .nth(1)
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(root).toHaveAttribute("data-enhanced", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).toHaveAttribute("data-enhanced", "false");
  for (const chapter of await root.locator("[data-philosophy-chapter]").all()) {
    await expect(chapter).toHaveCSS("opacity", "1");
    await expect(chapter).toHaveCSS("transform", "none");
  }
  await expect(root.locator("[data-philosophy-visual]")).toHaveCSS(
    "position",
    "relative",
  );
  for (const panel of await root
    .locator("[data-philosophy-static-scene]")
    .all()) {
    await expect(panel).toBeVisible();
    await expect(panel.locator("picture")).toHaveCSS("transform", "none");
  }
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  });
  await page.locator("#filosofia").screenshot({
    path: `test-results/${testInfo.project.name}-philosophy-static.png`,
    scale: "css",
  });
});

test("conteúdo e três fotografias funcionam sem JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#filosofia`);
    const section = page.locator("#filosofia");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      "Cuidado que vaialém do transporte.",
    );
    for (const title of titles)
      await expect(
        section.getByRole("heading", { level: 3, name: title, exact: true }),
      ).toBeVisible();
    await expect(
      section.getByText(
        "Sua rotina no centro. Uma proposta pensada para poupar deslocamentos e simplificar a organização do cuidado com sua moto.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      section.getByText(
        "Clareza para combinar cada atendimento, respeitando o destino e as condições alinhadas com você.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      section.getByText(
        "Um olhar cuidadoso para a experiência inteira. Do primeiro contato à combinação do retorno.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(section.locator("canvas")).toHaveCount(0);
    const panels = section.locator("[data-philosophy-static-scene]");
    await expect(panels).toHaveCount(3);
    for (const panel of await panels.all()) {
      await panel.scrollIntoViewIfNeeded();
      await expect(panel).toBeVisible();
      await expect
        .poll(() =>
          panel
            .locator("img")
            .evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
        )
        .toBe(true);
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
