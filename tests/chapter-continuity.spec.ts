import { test, expect } from "@playwright/test";

test("transições entre capítulos restauram o HTML ao reduzir movimento", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-poster")).toHaveAttribute(
    "data-loaded",
    "true",
  );
  await page
    .locator('[data-essence-reveal="closing"]')
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.locator("[data-essence-story]")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expect(page.locator("#philosophy-title")).toHaveAttribute(
    "style",
    /transform/,
  );
  await page
    .locator("[data-philosophy-chapter]")
    .nth(1)
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.locator("[data-philosophy-story]")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  if (page.viewportSize()!.width > 900) {
    await expect(page.locator("#process-title > span")).toHaveAttribute(
      "style",
      /transform/,
    );
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("#process-title > span")).toHaveCSS(
      "transform",
      "none",
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const selector of [
    "#essencia .section-label",
    "#philosophy-title",
    "#process-title > span",
  ])
    await expect(page.locator(selector)).toHaveCSS("transform", "none");
  await expect(page.locator("#philosophy-title")).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
