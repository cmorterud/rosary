import { expect, test } from '@playwright/test';

// The service worker is only registered by the production build.
test.use({ baseURL: 'http://127.0.0.1:4173' });

test('opens, prays, and keeps its place without a connection once visited', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  // Anything that still reaches for the network fails, so only the saved copy can answer.
  await context.route('**/*', route => route.abort('internetdisconnected'));
  const failed: string[] = [];
  page.on('requestfailed', request => failed.push(request.url()));
  const response = await page.reload();
  expect(response?.fromServiceWorker()).toBe(true);
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  const fonts = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].filter(font => font.status !== 'unloaded').map(font => `${font.family.replaceAll('"', '')} ${font.style} ${font.status}`);
  });
  expect(fonts).toEqual(expect.arrayContaining(['Libre Caslon Text normal loaded', 'DM Sans normal loaded']));
  expect(fonts.filter(font => font.endsWith('error'))).toEqual([]);

  for (let n = 0; n < 4; n++) await page.locator('#next').click();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 2 of 3');
  await page.reload();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 2 of 3');
  await page.goto('/?from=home-screen');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 2 of 3');
  expect(failed).toEqual([]);
});

test('can be installed as an app with its own icons', async ({ page }) => {
  await page.goto('/');
  const manifestUrl = new URL((await page.locator('link[rel="manifest"]').getAttribute('href'))!, page.url()).href;
  const manifest = await (await page.request.get(manifestUrl)).json();
  expect(manifest).toMatchObject({ name: 'Daily Rosary', short_name: 'Rosary', display: 'standalone' });
  expect(new URL(manifest.start_url, manifestUrl).href).toBe(page.url());
  expect(new URL(manifest.scope, manifestUrl).href).toBe(page.url());
  const icons = await Promise.all(manifest.icons.map(async (icon: { src: string; sizes: string; purpose?: string }) => {
    const size = await page.evaluate(async src => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return `${image.naturalWidth}x${image.naturalHeight}`;
    }, new URL(icon.src, manifestUrl).href);
    expect(size).toBe(icon.sizes);
    return `${icon.sizes} ${icon.purpose ?? 'any'}`;
  }));
  expect(icons).toEqual(expect.arrayContaining(['192x192 any', '512x512 any', '512x512 maskable']));
});
