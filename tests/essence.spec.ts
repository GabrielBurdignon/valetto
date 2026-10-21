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

test("revelação de scroll preserva visibilidade e cancela ao reduzir movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const heading = page.locator("#essence-title");
  await page.evaluate(() =>
    document
      .querySelector("#essence-title")!
      .scrollIntoView({ behavior: "instant", block: "center" }),
  );
  await expect
    .poll(() => heading.evaluate((element) => element.getAnimations().length))
    .toBeGreaterThan(0);
  const frames = await heading.evaluate((element) =>
    (element.getAnimations()[0].effect as KeyframeEffect).getKeyframes(),
  );
  expect(
    Math.min(...frames.map((frame) => Number(frame.opacity))),
  ).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(heading).toHaveCSS("transform", "none");
  expect(
    await heading.evaluate((element) => element.getAnimations().length),
  ).toBe(0);
});

test("fotografia revela após carregar, sem animar um painel vazio", async ({
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
    await figure.scrollIntoViewIfNeeded();
    expect(
      await figure
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBe(0);
    expect(
      await figure.evaluate((element) => element.getAnimations().length),
    ).toBe(0);
    release();
    await expect
      .poll(() => figure.evaluate((element) => element.getAnimations().length))
      .toBeGreaterThan(0);
    const frames = await figure.evaluate((element) =>
      (element.getAnimations()[0].effect as KeyframeEffect).getKeyframes(),
    );
    expect(
      Math.min(...frames.map((frame) => Number(frame.opacity))),
    ).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(figure).toHaveCSS("opacity", "1");
    await expect(figure).toHaveCSS("transform", "none");
  } finally {
    release();
  }
});
