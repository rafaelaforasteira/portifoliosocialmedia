import { test, expect } from "@playwright/test";

const sizes = [[375,667],[390,844],[430,932],[1366,768],[1440,900],[1920,1080],[2560,1440],[2560,1080],[3440,1440]];
for (const [width, height] of sizes) {
  test(`Hero íntegro em ${width}x${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("TRANSFORMANDO REDES SOCIAIS EM MÁQUINAS DE VENDAS");
    await expect(page.locator(".portrait-reveal img")).toHaveJSProperty("complete", true);
    await expect(page.locator(".portrait-reveal img")).not.toHaveJSProperty("naturalWidth", 0);
    await page.waitForTimeout(2800);
    const bounds = await page.evaluate(() => {
      const title = document.querySelector("h1")!.getBoundingClientRect();
      const cta = document.querySelector(".scroll-indicator")!.getBoundingClientRect();
      const line = document.querySelector(".headline-main")!;
      const range = document.createRange(); range.selectNodeContents(line);
      return { overflow: document.documentElement.scrollWidth > innerWidth, titleX: title.x, titleRight: title.right, textRight: range.getBoundingClientRect().right, ctaBottom: cta.bottom, titleBottom: title.bottom, ctaTop: cta.top };
    });
    expect(bounds.overflow).toBe(false);
    expect(bounds.titleX).toBeGreaterThanOrEqual(0);
    expect(bounds.textRight).toBeLessThanOrEqual(width);
    expect(bounds.ctaBottom).toBeLessThanOrEqual(height);
    expect(bounds.titleBottom).toBeLessThan(bounds.ctaTop);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `.qa/hero-${width}x${height}.png` });
  });
}

test("Teclado, scroll e movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const cta = page.getByRole("link", { name: "Vem me conhecer" });
  await expect(cta).toBeFocused();
  expect(await cta.evaluate(el => getComputedStyle(el).outlineStyle)).toBe("solid");
  expect(await page.locator(".scroll-arrow").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  const initial = await page.locator(".portrait-plane").evaluate(el => getComputedStyle(el).transform);
  await page.mouse.move(900, 300);
  expect(await page.locator(".portrait-plane").evaluate(el => getComputedStyle(el).transform)).toBe(initial);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#continuacao$/);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
