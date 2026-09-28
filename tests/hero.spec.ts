import { test, expect, type Page } from "@playwright/test";

async function seek(page: Page, time: number) {
  await page.locator('video').evaluate(async (video: HTMLVideoElement, t) => {
    video.pause(); video.currentTime = t;
    await new Promise<void>(resolve => video.addEventListener('seeked', () => resolve(), { once: true }));
  }, time);
}

for (const [width, height] of [[1920,1080],[3440,1440],[1366,768],[768,1024],[390,844],[375,667]]) {
  test(`Intro final em ${width}x${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.setViewportSize({width, height});
    await page.goto('/');
    await page.waitForFunction(() => document.querySelector('video')?.ended);
    const video = page.locator('video');
    await expect(video).toHaveJSProperty('muted', true);
    await expect(video).toHaveJSProperty('loop', false);
    await expect(video).toHaveJSProperty('controls', false);
    await expect(video).toHaveAttribute('playsinline', '');
    const scale = await video.evaluate(v => new DOMMatrix(getComputedStyle(v).transform).a);
    expect(scale).toBeCloseTo(width <= 900 ? 1 : width / height >= 2 ? 1.06 : 1.10, 3);
    await expect(page.locator('.hero-grain')).toHaveCSS('opacity', '0.24');
    await expect(page.locator('.hero')).toHaveAttribute('data-intro-state', 'ended');
    await expect(page.locator('.title-line-1')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    await expect(page.locator('.title-line-2')).toHaveCSS('opacity', '1');
    await expect(page.getByRole('link', {name:'Vem me conhecer'})).toBeVisible();
    await page.waitForTimeout(300);
    expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeCloseTo(6, 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cta = await page.locator('.hero-cta').boundingBox();
    expect(cta!.y + cta!.height).toBeLessThanOrEqual(height + 20);
    expect(errors).toEqual([]);
    await page.screenshot({path:`.qa/intro-${width}.png`});
  });
}

test('Timeline follows seeking and pauses, not wall-clock time', async ({page}) => {
  await page.setViewportSize({width:1920,height:1080});
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('video')!.readyState >= 2);
  await seek(page, .5);
  const scale = () => page.locator('video').evaluate(v => new DOMMatrix(getComputedStyle(v).transform).a);
  const earlyScale = await scale();
  await expect(page.locator('.hero-eyebrow')).toHaveCSS('opacity','0');
  await page.waitForTimeout(1600);
  expect(await scale()).toBeCloseTo(earlyScale, 4);
  await expect(page.locator('.hero-eyebrow')).toHaveCSS('opacity','0');
  await seek(page, 1.9);
  await expect(page.locator('.hero-eyebrow')).toHaveCSS('opacity','1');
  await expect(page.locator('.title-line-1')).toHaveCSS('opacity','0');
  await seek(page, 2.25);
  expect(await scale()).toBeGreaterThan(earlyScale);
  expect(await scale()).toBeLessThan(1.1);
  const mask = await page.locator('.title-line-1').evaluate(el => ({y:new DOMMatrix(getComputedStyle(el).transform).m42,h:el.getBoundingClientRect().height}));
  expect(mask.y).toBeGreaterThan(0); expect(mask.y).toBeLessThan(mask.h);
  await expect(page.locator('.title-line-2')).toHaveCSS('opacity','0');
  await seek(page, 4.3);
  expect(await scale()).toBeCloseTo(1.1, 3);
  await page.setViewportSize({width:3440,height:1440});
  await expect.poll(scale).toBeCloseTo(1.06, 3);
  await page.setViewportSize({width:1920,height:1080});
  await expect.poll(scale).toBeCloseTo(1.1, 3);
  await expect(page.locator('.hero-cta')).toHaveCSS('opacity','1');
  await seek(page, .5);
  expect(await scale()).toBeCloseTo(earlyScale, 4);
  await expect(page.locator('.hero-cta')).toHaveCSS('visibility','hidden');
});

test('Late video does not flash text before it starts', async ({page}) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => {release=resolve;});
  await page.route('**/videos/hero-intro.mp4', async route => {await gate; await route.continue();});
  await page.goto('/', {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1800);
  await expect(page.locator('.title-line-1')).toHaveCSS('visibility','hidden');
  await expect(page.locator('.hero-cta')).toHaveCSS('opacity','0');
  release();
  await expect(page.locator('.hero')).toHaveAttribute('data-intro-state','ended',{timeout:20000});
});

for (const mode of ['blocked','error','reduced','raf'] as const) {
  test(`Fallback: ${mode}`, async ({page}) => {
    if(mode==='blocked') await page.addInitScript(() => {HTMLMediaElement.prototype.play=()=>Promise.reject(new DOMException('Blocked','NotAllowedError'));});
    if(mode==='error') await page.route('**/videos/hero-intro.mp4', route=>route.fulfill({status:200,contentType:'video/mp4',body:'invalid video'}));
    if(mode==='reduced') await page.emulateMedia({reducedMotion:'reduce'});
    if(mode==='raf') await page.addInitScript(() => {Object.defineProperty(HTMLVideoElement.prototype,'requestVideoFrameCallback',{value:undefined,configurable:true});});
    await page.goto('/');
    await expect(page.locator('.hero')).toHaveAttribute('data-intro-state', mode==='reduced'?'reduced':mode==='raf'?'ended':'fallback',{timeout:20000});
    await expect(page.locator('.hero-cta')).toHaveCSS('opacity','1');
    if(mode!=='raf') await expect(page.locator('video')).toHaveJSProperty('paused',true);
    await expect(page.getByRole('heading',{level:1})).toHaveAccessibleName('TRANSFORMANDO REDES SOCIAIS EM MÁQUINAS DE VENDAS');
  });
}

test('Playback stalled before the intro completes reveals fallback', async ({page}) => {
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('video')!.readyState >= 2);
  await seek(page, .6);
  await expect(page.locator('.hero')).toHaveAttribute('data-intro-state','fallback',{timeout:12000});
  await expect(page.locator('.hero-cta')).toBeVisible();
});

test('Content remains accessible without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://localhost:3000');
  await expect(page.locator('.title-line-1')).toHaveCSS('transform','none');
  await expect(page.getByRole('link',{name:'Vem me conhecer'})).toBeVisible();
  await context.close();
});
