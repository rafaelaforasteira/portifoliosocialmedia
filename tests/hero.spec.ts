import { test, expect } from "@playwright/test";
const sizes = [[375,667],[390,844],[430,932],[1366,768],[1440,900],[1920,1080],[2560,1440],[2560,1080],[3440,1440]];
for (const [width, height] of sizes) {
  test(`Base monocromática em ${width}x${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const hero = page.locator(".hero");
    await expect(hero).toHaveText("");
    await expect(hero.locator("a, h1, header")).toHaveCount(0);
    const image = hero.locator("img");
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
    await expect(image).toHaveAttribute("src", /raffaela-hero/);
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => {
      const img = document.querySelector(".portrait-reveal img")!;
      const shade = document.querySelector(".hero-shade")!;
      const grain = document.querySelector(".hero-grain")!;
      const stage = document.querySelector(".hero-stage")!;
      const a = document.querySelector(".hero")!.getBoundingClientRect(), b = shade.getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > innerWidth, background: getComputedStyle(document.body).backgroundColor, aligned: a.x === 0 && a.width === innerWidth && Math.abs(a.x-b.x)<1 && Math.abs(a.y-b.y)<1 && Math.abs(a.width-b.width)<1 && Math.abs(a.height-b.height)<1, ordered: Number(getComputedStyle(stage).zIndex) < Number(getComputedStyle(grain).zIndex) && Number(getComputedStyle(grain).zIndex) < Number(getComputedStyle(shade).zIndex), mask: getComputedStyle(img).maskImage };
    });
    expect(state.overflow).toBe(false);
    expect(state.background).toBe("rgb(0, 0, 0)");
    expect(state.aligned).toBe(true);
    expect(state.ordered).toBe(true);
    expect(state.mask).toBe("none");
    expect(errors).toEqual([]);
    await page.screenshot({ path: `.qa/clean-${width}x${height}.png` });
  });
}
test("Movimento reduzido mantém fotografia visível", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".portrait-reveal")).toHaveCSS("opacity", "1");
});
