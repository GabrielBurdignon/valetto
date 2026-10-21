import { test, expect } from "@playwright/test";

const description =
  "Organização da retirada, transporte até a concessionária ou prestador especializado e retorno da motocicleta, conforme o atendimento combinado.";

test("cena editorial preserva conteúdo, enquadramento e movimento reversível", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const section = page.locator("#servicos");
  const root = section.locator("[data-experience-story]");
  const frame = section.locator("[data-experience-frame]");
  const picture = frame.locator("picture");
  const image = picture.locator("img");
  await frame.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-enhanced", "true");
  await expect
    .poll(() =>
      image.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const source = await image.evaluate(
    (image: HTMLImageElement) => image.currentSrc,
  );
  expect(source).toContain(
    page.viewportSize()!.width > 900 ? "desktop" : "mobile",
  );
  expect(source).not.toContain("original.png");
  await expect(image).toHaveAttribute("alt", /conceitual gerada por IA/);
  await expect(section.getByRole("heading", { level: 2 })).toHaveText(
    /A próxima revisão\.\s*Sem reorganizar\s*a sua vida\./,
  );
  await expect(section.getByText(description, { exact: true })).toBeVisible();
  await expect(section.locator("[data-experience-future]")).toBeVisible();
  await expect(
    section.getByRole("link", { name: "Acompanhe o próximo capítulo" }),
  ).toHaveAttribute("href", "#lancamento");
  await expect(section.locator("canvas")).toHaveCount(0);
  await expect
    .poll(() =>
      picture.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe("none");
  const top = await frame.evaluate(
    (element) => element.getBoundingClientRect().top + scrollY,
  );
  const y = () =>
    picture.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
    );
  await page.evaluate(
    (top) => scrollTo({ top: top - innerHeight * 0.75, behavior: "instant" }),
    top,
  );
  await page.waitForTimeout(650);
  const before = await y();
  await page.evaluate(
    (top) => scrollTo({ top: top - innerHeight * 0.05, behavior: "instant" }),
    top,
  );
  await expect.poll(y).toBeLessThan(before - 2);
  await page.evaluate(
    (top) => scrollTo({ top: top - innerHeight * 0.75, behavior: "instant" }),
    top,
  );
  await expect
    .poll(async () => Math.abs((await y()) - before))
    .toBeLessThan(0.3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).toHaveAttribute("data-enhanced", "false");
  await expect(picture).toHaveCSS("transform", "none");
  await expect(section.locator("[data-experience-heading]")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(section.locator("[data-experience-copy]")).toHaveCSS(
    "transform",
    "none",
  );
  await page.reload();
  await section.scrollIntoViewIfNeeded();
  await expect(picture).toHaveCSS("transform", "none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});

test("fotografia e textos continuam acessíveis sem JavaScript", async ({
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
    await staticPage.goto(`${baseURL}/#servicos`);
    const section = staticPage.locator("#servicos");
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(section.getByText(description, { exact: true })).toBeVisible();
    await section.locator("img").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        section
          .locator("img")
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await expect(section.locator("[data-experience-copy]")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(
      section.getByText("VISÃO DE EXPANSÃO", { exact: true }),
    ).toBeVisible();
    expect(
      await staticPage.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  } finally {
    await context.close();
  }
});

test("foto só recebe movimento depois de carregar e decodificar", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requested = false;
  await page.route(
    (url) =>
      url.href.includes("experience") &&
      (url.pathname === "/_next/image" || url.pathname.endsWith(".webp")),
    async (route) => {
      requested = true;
      await gate;
      await route.continue();
    },
  );
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const frame = page.locator("[data-experience-frame]");
    await frame.scrollIntoViewIfNeeded();
    await expect(page.locator("[data-experience-story]")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    await expect.poll(() => requested).toBe(true);
    await expect(frame.locator("picture")).toHaveCSS("transform", "none");
    release();
    await expect
      .poll(() =>
        frame
          .locator("picture")
          .evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe("none");
  } finally {
    release();
  }
});
