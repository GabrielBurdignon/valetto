import { test, expect } from "@playwright/test";

test("hero estático exibe a imagem oficial sem carregar WebGL", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await expect(page.locator(".hero-art")).toHaveAttribute(
    "data-asset",
    "static",
  );
  await expect(page.getByText("Experiência visual em preparação.")).toHaveCount(
    0,
  );
  await expect(page.locator(".hero-poster img")).toBeVisible();
  await expect(page.locator(".hero canvas")).toHaveCount(0);
  await expect(page.locator(".art-type")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Conheça a Valetto" }),
  ).toHaveAttribute("href", "#essencia");
  expect(requests.some((url) => /\.(glb|gltf|hdr)(\?|$)/.test(url))).toBe(
    false,
  );
});

test("headline e CTA funcionam sem JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Sua motoprecisa ir.Você não.",
  );
  await expect
    .poll(() =>
      page
        .locator(".hero-poster img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page.getByRole("link", { name: "Conheça a Valetto" }).click();
  await expect(page).toHaveURL(/#essencia$/);
  await expect(page.locator("#essencia")).toBeInViewport();
  await context.close();
});

test("imagem estática carrega sem canvas e respeita redução de movimento", async ({
  page,
}, testInfo) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-art-static")).toBeVisible();
  const image = page.locator(".hero-poster img");
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(page.locator(".hero canvas")).toHaveCount(0);
  expect(requests.some((url) => /\.(glb|gltf|hdr)(\?|$)/.test(url))).toBe(
    false,
  );
  await expect(page.locator(".hero-poster-reveal")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".hero-poster-parallax")).toHaveCSS(
    "transform",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  const viewport = page.viewportSize()!;
  if (viewport.width > 600 && viewport.width <= 900) {
    const art = await page.locator(".hero-art-static").boundingBox();
    expect(art!.x).toBeGreaterThanOrEqual(viewport.width / 2);
  }
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-static-hero.png`,
  });
});

test("parallax discreto acompanha scroll e é desativado ao reduzir movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const layer = page.locator(".hero-poster-parallax");
  await expect(page.locator(".hero-poster")).toHaveAttribute(
    "data-loaded",
    "true",
  );
  const offset = () =>
    layer.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
    );
  // Waiting for the transform checks the real asynchronous GSAP initialization.
  await expect
    .poll(() =>
      layer.evaluate((element) => element.getAttribute("style") || ""),
    )
    .toContain("transform");
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
  await expect.poll(offset).toBeLessThan(-0.1);
  expect(await offset()).toBeGreaterThanOrEqual(-12);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(layer).toHaveCSS("transform", "none");
  await page.getByRole("link", { name: "Conheça a Valetto" }).click();
  await expect(page).toHaveURL(/#essencia$/);
});
