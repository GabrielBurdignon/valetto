import { expect, test } from "@playwright/test";

test("home usa só a Inter local de produção, preservando lettering e Georgia", async ({
  page,
}) => {
  const fonts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") fonts.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  expect(new Set(fonts).size).toBe(1);
  expect(new URL(fonts[0]).origin).toBe(new URL(page.url()).origin);
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(1);
  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    logo: getComputedStyle(document.querySelector(".wordmark")!).fontFamily,
    accent: getComputedStyle(document.querySelector(".statement em")!)
      .fontFamily,
  }));
  expect(families.body.toLowerCase()).toContain("inter");
  expect(families.logo).toBe("Arial, Helvetica, sans-serif");
  expect(families.accent).toBe("Georgia, serif");
  const lines = await page
    .locator("#hero-title, #essence-title, #experience-title")
    .evaluateAll((elements) =>
      elements.map((el) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const rows = new Set<number>();
        let node;
        while ((node = walker.nextNode())) {
          for (let i = 0; i < (node.textContent?.length || 0); i++) {
            if (!node.textContent![i].trim()) continue;
            const range = document.createRange();
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            rows.add(Math.round(range.getBoundingClientRect().top));
          }
        }
        return rows.size;
      }),
    );
  expect(lines).toEqual([3, 2, 3]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("falha da fonte mantém conteúdo, navegação e ausência de overflow", async ({
  page,
}) => {
  await page.route("**/*.woff2", (route) => route.abort());
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator(".hero-copy .button")).toHaveAttribute(
    "href",
    "#essencia",
  );
  await expect(page.locator("#process-title")).toBeVisible();
  await expect(page.locator(".statement em")).toHaveText("viver.");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("fallback tardio preserva a altura do título e do apoio do hero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/*.woff2", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".hero-description")).toBeVisible();
    await page.waitForTimeout(300);
    const measure = () =>
      page
        .locator("#hero-title, .hero-description")
        .evaluateAll((elements) =>
          elements.map((el) => el.getBoundingClientRect().height),
        );
    const fallback = await measure();
    release();
    await page.evaluate(() => document.fonts.ready);
    const loaded = await measure();
    loaded.forEach((height, index) =>
      expect(height).toBeCloseTo(fallback[index], 1),
    );
  } finally {
    release();
  }
});
