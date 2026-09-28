import { test, expect } from "@playwright/test";

for (const width of [390, 1366, 3440]) {
  test(`Menu fixo e acessível em ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav).toBeVisible();
    await expect(page.locator("header")).toHaveCSS("backdrop-filter", "blur(18px) saturate(1.4)");
    await expect(nav.locator("img")).toHaveCSS("filter", "none");
    await expect(nav.locator("img")).toHaveAttribute("src", "/icon.svg");
    await expect(nav.getByRole("link", { name: "FALAR COMIGO" })).toHaveAttribute("href", "#contato");
    for (const [label, href] of [["SOBRE", "#sobre"], ["CASES", "#cases"], ["PROCESSO", "#processo"], ["EXPERIÊNCIA", "#experiencia"]]) {
      const link = nav.locator(`a[href="${href}"]`);
      await expect(link).toHaveText(label);
      if (width > 760) await expect(link).toBeVisible();
      else await expect(link).toBeHidden();
    }
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Início", exact: true })).toBeFocused();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `.qa/menu-${width}.png` });
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: "instant" }));
    await expect(page.locator("header")).toHaveCSS("position", "fixed");
    expect((await page.locator("header").boundingBox())!.y).toBe(0);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
