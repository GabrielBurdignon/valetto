import { test, expect } from "@playwright/test";

test("headline mobile equilibra frases sem reduzir fonte ou deslocar a timeline", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const cases = [
    {
      width: 360,
      lines: ["Você entrega", "a chave.", "Nós cuidamos", "do resto."],
    },
    {
      width: 390,
      lines: ["Você entrega a chave.", "Nós cuidamos", "do resto."],
    },
    { width: 430, lines: ["Você entrega a chave.", "Nós cuidamos do resto."] },
  ];
  for (const { width, lines } of cases) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const title = page.locator("#process-title");
    const measure = () =>
      title.evaluate((el) => {
        const range = document.createRange();
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const rows = new Map<number, string>();
        let node;
        while ((node = walker.nextNode())) {
          for (let i = 0; i < (node.textContent?.length || 0); i++) {
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getBoundingClientRect();
            if (!rect.width || !rect.height) continue;
            const y = Math.round(rect.top);
            rows.set(y, (rows.get(y) || "") + node.textContent![i]);
          }
        }
        const section = el.closest("section")!;
        return {
          lines: [...rows.values()].map((line) => line.trim()),
          size: getComputedStyle(el).fontSize,
          height: el.getBoundingClientRect().height,
          timelineTop:
            section.querySelector("ol")!.getBoundingClientRect().top -
            section.getBoundingClientRect().top,
        };
      });
    const balanced = await measure();
    expect(balanced.lines).toEqual(lines);
    expect(balanced.size).toBe("36px");
    // Compare against the prior automatic wrapping in the same loaded font.
    const previous = await page.addStyleTag({
      content:
        "#process-title { text-wrap: wrap; } #process-title > span { display: inline; }",
    });
    const original = await measure();
    expect(balanced.height).toBe(original.height);
    expect(balanced.timelineTop).toBe(original.timelineTop);
    await previous.evaluate((el) => el.parentNode?.removeChild(el));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
});

const titles = ["Solicite", "Combine", "Deixe conosco", "Receba sua moto"];
test("linha coordena quatro etapas e reverte sem bloquear a rolagem", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const root = page.locator("[data-process-timeline]");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-enhanced", "true");
  const positions = async () =>
    root.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const start = rect.top + scrollY - innerHeight * 0.8;
      const end =
        rect.bottom + scrollY - innerHeight * (innerWidth > 900 ? 0.42 : 0.6);
      return { start, distance: end - start };
    });
  const fills = root.locator("[data-process-progress]");
  const go = async (index: number) => {
    const { start, distance } = await positions();
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      start + distance * ((index + 0.5) / 4),
    );
    await expect(root).toHaveAttribute("data-active", String(index + 1));
    const axis = page.viewportSize()!.width > 900 ? "a" : "d";
    await expect
      .poll(() =>
        fills
          .nth(index)
          .evaluate(
            (element, axis) =>
              new DOMMatrixReadOnly(getComputedStyle(element).transform)[
                axis === "a" ? "a" : "d"
              ],
            axis,
          ),
      )
      .toBeGreaterThan(0.48);
    await expect
      .poll(() =>
        fills
          .nth(index)
          .evaluate(
            (element, axis) =>
              new DOMMatrixReadOnly(getComputedStyle(element).transform)[
                axis === "a" ? "a" : "d"
              ],
            axis,
          ),
      )
      .toBeLessThan(0.52);
    await expect(
      root.getByRole("heading", { name: titles[index], exact: true }),
    ).toBeVisible();
  };
  for (const index of [0, 1, 2, 3, 2, 1, 0]) await go(index);
  if (page.viewportSize()!.width > 900) {
    await page.setViewportSize({ width: 768, height: 1024 });
    await go(2);
    await expect
      .poll(() =>
        fills
          .nth(2)
          .evaluate(
            (element) =>
              new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
          ),
      )
      .toBe(1);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await expect(root.locator("img, canvas, button")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("redução de movimento restaura linha completa e leitura estática", async ({
  page,
}) => {
  await page.goto("/");
  const root = page.locator("[data-process-timeline]");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-enhanced", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).toHaveAttribute("data-enhanced", "false");
  for (const fill of await root.locator("[data-process-progress]").all())
    await expect(fill).toHaveCSS("transform", "none");
  for (const copy of await root.locator("[data-process-copy]").all())
    await expect(copy).toHaveCSS("opacity", "1");
  for (const title of titles)
    await expect(
      root.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
});

test("processo sem JavaScript preserva ordem, headline e condição de pré-lançamento", async ({
  browser,
  page,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize()!,
  });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto(`${baseURL}/#como-funciona`);
    const section = staticPage.locator("#como-funciona");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      "Você entrega a chave.Nós cuidamos do resto.",
    );
    await expect(section.getByRole("listitem")).toHaveCount(4);
    expect(
      await section.getByRole("heading", { level: 3 }).allTextContents(),
    ).toEqual(titles);
    await expect(
      section.getByText(
        "Fluxo previsto. Disponibilidade e condições serão informadas no lançamento.",
      ),
    ).toBeVisible();
    for (const copy of await section.locator("[data-process-copy]").all())
      await expect(copy).toHaveCSS("opacity", "1");
    expect(
      await staticPage.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  } finally {
    await context.close();
  }
});
