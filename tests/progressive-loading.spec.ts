import { test, expect } from "@playwright/test";

test("abertura mantém HTML e entrada sem baixar motores de scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const scripts: Promise<string>[] = [];
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.endsWith(".js"))
      scripts.push(response.text());
  });
  await page.goto("/");
  await expect(page.locator(".hero-poster")).toHaveAttribute(
    "data-loaded",
    "true",
  );
  // Wait past the full entrance to catch background downloads as well.
  await page.waitForTimeout(1800);
  const opening = (await Promise.all(scripts)).join("\n");
  expect(opening).not.toContain("data-philosophy-layer");
  expect(opening).not.toContain("data-process-progress");
  expect(opening).not.toContain("data-experience-picture");
  expect(opening).not.toContain("GSAP");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#hero-title")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-poster-parallax")).not.toHaveAttribute(
    "style",
    /transform/,
  );
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
  await expect
    .poll(() =>
      page
        .locator(".hero-poster-parallax")
        .evaluate(
          (element) =>
            new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
        ),
    )
    .toBeLessThan(-0.1);
});

test("controlador tardio suporta redução de movimento antes de se aproximar", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .locator("[data-philosophy-chapter]")
    .nth(1)
    .scrollIntoViewIfNeeded();
  const story = page.locator("[data-philosophy-story]");
  await expect(story).toHaveAttribute("data-enhanced", "false");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(story).toHaveAttribute("data-enhanced", "true");
  await page
    .locator("[data-philosophy-chapter]")
    .nth(1)
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(story).toHaveAttribute("data-active", "2");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story).toHaveAttribute("data-enhanced", "false");
  await expect(page.locator("[data-philosophy-chapter]").nth(1)).toHaveCSS(
    "opacity",
    "1",
  );
});

test("timeline seguinte recalcula limites após uma ativação tardia acima dela", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let held = false;
  await page.route("**/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("data-philosophy-layer")) {
      held = true;
      await gate;
    }
    await route.fulfill({ response });
  });
  try {
    await page.goto("/");
    const process = page.locator("[data-process-timeline]");
    await process.scrollIntoViewIfNeeded();
    await expect(process).toHaveAttribute("data-enhanced", "true");
    await expect.poll(() => held).toBe(true);
    await process.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const start = rect.top + scrollY - innerHeight * 0.8;
      const end = rect.bottom + scrollY - innerHeight * 0.42;
      scrollTo({ top: start + (end - start) * 0.375, behavior: "instant" });
    });
    release();
    await expect(page.locator("[data-philosophy-story]")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    await expect
      .poll(() =>
        process.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const start = rect.top + scrollY - innerHeight * 0.8;
          const end = rect.bottom + scrollY - innerHeight * 0.42;
          const progress = Math.min(
            1,
            Math.max(0, (scrollY - start) / (end - start)),
          );
          return Math.max(
            ...[...element.querySelectorAll("[data-process-progress]")].map(
              (fill, index) => {
                const actual = new DOMMatrixReadOnly(
                  getComputedStyle(fill).transform,
                ).a;
                const expected = Math.min(1, Math.max(0, progress * 4 - index));
                return Math.abs(actual - expected);
              },
            ),
          );
        }),
      )
      .toBeLessThan(0.05);
  } finally {
    release();
  }
});

test("decodificação tardia das fotos não desloca a seção de processo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(
    (url) =>
      url.pathname === "/_next/image" &&
      (url.searchParams.get("url") || "").includes("/media/philosophy/"),
    async (route) => {
      await gate;
      await route.continue();
    },
  );
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const process = page.locator("[data-process-timeline]");
    await process.scrollIntoViewIfNeeded();
    await expect(process).toHaveAttribute("data-enhanced", "true");
    const position = () =>
      process.evaluate(
        (element) => element.getBoundingClientRect().top + scrollY,
      );
    const before = await position();
    release();
    await expect(page.locator("[data-philosophy-story]")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    expect(Math.abs((await position()) - before)).toBeLessThan(1);
  } finally {
    release();
  }
});
