import { test, expect } from "@playwright/test";

test("Essência preserva conteúdo e apresenta o macro aprovado", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#essencia");
  const section = page.locator("#essencia");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    "Seu tempo é valioso. Sua moto também.",
  );
  await expect(
    section.getByText(
      "Algumas coisas merecem a sua atenção. Outras podem ser cuidadas por quem entende o valor do seu tempo.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    section.getByText(
      "A Valetto nasce para conectar você ao cuidado que sua moto precisa. Organizamos a proposta de retirada, transporte até concessionárias e prestadores especializados e retorno, conforme o atendimento contratado.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    section.getByText("Uma nova perspectiva sobre conveniência. Em breve.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(section).toHaveAttribute("data-image", "configured");
  const image = section.getByRole("img");
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(image).toHaveAttribute("loading", "lazy");
  await expect(image).toHaveAttribute("alt", /acabamento metálico grafite/);
  await expect(section.locator('[data-essence-reveal="image"]')).toHaveCSS(
    "transform",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await section.screenshot({
    path: `test-results/${testInfo.project.name}-essence.png`,
  });
});

test("Essência permanece legível sem JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/#essencia`);
    const heading = page.locator("#essence-title");
    await expect(heading).toBeVisible();
    const image = page.locator("#essencia img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(heading).toHaveCSS("opacity", "1");
    await expect(heading).toHaveCSS("transform", "none");
    await expect(page.locator('[data-essence-reveal="description"]')).toHaveCSS(
      "opacity",
      "1",
    );
  } finally {
    await context.close();
  }
});

test("abertura fotográfica reverte com o scroll e desarma ao reduzir movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const figure = page.locator('[data-essence-reveal="image"]');
  const story = page.locator("[data-essence-story]");
  const move = async (progress: number) => {
    await figure.evaluate((element, value) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top + scrollY;
      const start = top - innerHeight * 0.95;
      const end = top + rect.height / 2 - innerHeight * 0.52;
      scrollTo({ top: start + (end - start) * value, behavior: "instant" });
    }, progress);
  };
  await figure.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-enhanced", "true");
  const inset = () =>
    figure.evaluate((element) =>
      parseFloat(getComputedStyle(element).clipPath.slice(6)),
    );
  await move(0.15);
  await expect.poll(inset).toBeGreaterThan(3);
  const first = await inset();
  await move(0.9);
  await expect.poll(inset).toBeLessThan(1.5);
  await move(0.15);
  await expect.poll(inset).toBeGreaterThan(first - 0.5);
  // Overscan must cover the frame throughout the exit, without an exposed strip.
  await figure.evaluate((element) =>
    scrollTo({
      top: element.getBoundingClientRect().bottom + scrollY - innerHeight * 0.3,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      figure.evaluate(
        (element) =>
          element.querySelector("img")!.getBoundingClientRect().bottom -
          element.getBoundingClientRect().bottom,
      ),
    )
    .toBeGreaterThanOrEqual(-1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story).toHaveAttribute("data-enhanced", "false");
  await expect(figure).toHaveCSS("clip-path", "none");
  await expect(figure.locator("img")).toHaveCSS("transform", "none");
  await expect(page.locator("#essence-title span").first()).toHaveCSS(
    "transform",
    "none",
  );
});

test("abertura aguarda fotografia decodificada sem animar um painel vazio", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    (url) =>
      url.pathname === "/_next/image" &&
      (url.searchParams.get("url") || "").includes("valetto-essencia-macro"),
    async (route) => {
      await gate;
      await route.continue();
    },
  );
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const figure = page.locator('[data-essence-reveal="image"]');
    const story = page.locator("[data-essence-story]");
    await figure.scrollIntoViewIfNeeded();
    expect(
      await figure
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBe(0);
    await expect(story).toHaveAttribute("data-enhanced", "false");
    await expect(figure).toHaveCSS("clip-path", "none");
    release();
    await expect(story).toHaveAttribute("data-enhanced", "true");
    expect(
      await figure
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(figure).toHaveCSS("clip-path", "none");
  } finally {
    release();
  }
});
