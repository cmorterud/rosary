import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-26T12:00:00') });
  await page.goto('/');
});

test('complete rosary with keyboard, backtracking, and restart confirmation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await expect(page.locator('#set-name')).toContainText('Joyful');
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  await page.keyboard.press('Space');
  await expect(page.locator('h1')).toHaveText('The Apostles’ Creed');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  for (let n = 0; n < 80; n++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('h1')).toHaveText('Go in peace.');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await page.getByRole('button', {name: 'Pray again', exact: true}).click();
  await page.getByRole('button', {name: 'Keep my place'}).click();
  await expect(page.locator('h1')).toHaveText('Go in peace.');
  await page.reload(); // A finished rosary is ready to be prayed again.
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  await expect(page.locator('#notice')).toContainText('You’ve completed this rosary today.');
  expect(errors).toEqual([]);
});

test('reload returns to the exact saved position and settings preserve the current bead', async ({ page }) => {
  await page.locator('#journey [data-section="2"]').click();
  for (let n = 0; n < 6; n++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await page.reload();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await expect(page.locator('#notice')).toBeHidden();
  await page.getByRole('button', {name: 'Open settings'}).click();
  await page.getByLabel('Include the Fatima Prayer').uncheck();
  await page.getByLabel('Appearance').selectOption('dark');
  await page.getByLabel('Prayer text size').selectOption('largest');
  await page.keyboard.press('Escape');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#step-count')).toHaveText('27 / 75');
});

test('continuing straight after a reload never discards the saved place', async ({ page }) => {
  await page.locator('#journey [data-section="3"]').click();
  for (let n = 0; n < 8; n++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 7 of 10');
  await page.reload(); // As when a phone discards the tab in the background.
  await page.locator('#next').click();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 8 of 10');
  await page.reload();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 8 of 10');
});

test('the screen stays awake while praying, then locks as usual', async ({ page }) => {
  await page.addInitScript(() => {
    const log: string[] = [];
    Object.assign(window, { wakeLog: log });
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => {
      log.push('request');
      const sentinel = new EventTarget();
      return Object.assign(sentinel, { released: false, type: 'screen', release: async () => { log.push('release'); sentinel.dispatchEvent(new Event('release')); } });
    } } });
  });
  await page.reload();
  const log = () => page.evaluate(() => (window as unknown as { wakeLog: string[] }).wakeLog);
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  expect(await log()).toEqual([]); // Opening the page alone never holds the screen on.
  await page.locator('#next').click();
  await page.locator('#next').click();
  await expect.poll(log).toEqual(['request']);
  await page.clock.runFor(5 * 60 * 1000); // Stepped away from the prayer.
  await expect.poll(log).toEqual(['request', 'release']);
  await page.locator('#next').click();
  await expect.poll(log).toEqual(['request', 'release', 'request']);
  await page.locator('#journey [data-section="6"]').click();
  for (let n = 0; n < 3; n++) await page.locator('#next').click();
  await expect(page.locator('h1')).toHaveText('Go in peace.');
  await expect.poll(log).toEqual(['request', 'release', 'request', 'release']);
});

test('each Hail Mary tap visibly acknowledges the new bead, including rapid taps', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Journey', exact: true}).click();
  await page.locator('#mobile-journey [data-section="1"]').click();
  const next = page.locator('#next');
  await next.click(); // Our Father
  await next.click(); // Hail Mary 1
  await next.click(); // Hail Mary 2
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 2 of 10');
  await expect(next).toHaveClass(/acknowledged/);
  await expect(next).toContainText('✓ Hail Mary 2 of 10');
  await expect(next).toHaveAttribute('aria-label', 'Continue');
  await next.click(); // Hail Mary 3 before the feedback expires
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 3 of 10');
  await expect(next).toContainText('✓ Hail Mary 3 of 10');
  await page.clock.runFor(900);
  await expect(next).not.toHaveClass(/acknowledged/);
  await expect(next).toContainText('Continue');
});

test('mobile navigation, mystery selection, reference, and layouts', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Journey', exact: true}).click();
  await page.locator('#mobile-journey [data-section="1"]').click();
  await expect(page.locator('h1')).toHaveText('The Annunciation');
  await page.locator('#next').click();
  await page.locator('#next').click();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 1 of 10');
  await page.getByRole('button', {name: 'Change mysteries'}).click();
  await page.getByRole('button', {name: 'Sorrowful Mysteries'}).click();
  await expect(page.locator('#set-name')).toContainText('Sorrowful');
  await page.getByRole('button', {name: 'Journey', exact: true}).click();
  await page.getByRole('button', {name: 'All prayers & reference'}).click();
  await page.getByText('The Apostles’ Creed', {exact: true}).click();
  await expect(page.locator('#prayers-dialog details[open]')).toContainText('Creator of heaven');
  await page.keyboard.press('Escape');
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({width, height: 900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('yesterday can be resumed without changing the default daily mysteries', async ({page}) => {
  await page.locator('#next').click();
  await page.clock.setSystemTime(new Date('2026-09-27T12:00:00'));
  await page.reload();
  await expect(page.locator('#set-name')).toContainText('Glorious');
  await page.getByRole('button', {name: 'Continue where I left off'}).click();
  await expect(page.locator('#set-name')).toContainText('Joyful');
  await expect(page.locator('h1')).toHaveText('The Apostles’ Creed');
  await page.getByRole('button', {name: 'Pray today’s rosary'}).click();
  await expect(page.locator('#set-name')).toContainText('Glorious');
});

test('homepage follows the seasonal Sunday mysteries', async ({page}) => {
  for (const [date, expected] of [
    ['2026-02-22T12:00:00', 'Sorrowful'],
    ['2026-04-05T12:00:00', 'Glorious'],
    ['2026-11-29T12:00:00', 'Joyful'],
    ['2026-12-27T12:00:00', 'Glorious'],
  ]) {
    await page.clock.setSystemTime(new Date(date));
    await page.reload();
    await expect(page.locator('#set-name')).toContainText(expected);
  }
});

test('accessible light, dark, settings, and enlarged mobile prayer', async ({page}) => {
  await expect(page.locator('h1')).toHaveText('Sign of the Cross');
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.getByRole('button', {name: 'Open settings'}).click();
  await page.getByLabel('Appearance').selectOption('dark');
  await page.getByLabel('Prayer text size').selectOption('largest');
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.setViewportSize({width: 320, height: 700});
  await page.locator('#next').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});

for (const viewport of [{width: 1440, height: 900}, {width: 768, height: 1024}, {width: 390, height: 844}, {width: 320, height: 568}]) {
  test(`prayer controls stay fixed through every step at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    const next = page.locator('#next');
    const previous = page.locator('#previous');
    const nextBounds = (await next.boundingBox())!;
    const previousBounds = (await previous.boundingBox())!;
    expect(nextBounds.y + nextBounds.height).toBeLessThanOrEqual(viewport.height);
    for (let step = 0; step < 80; step++) {
      await next.click();
      expect(await next.boundingBox()).toEqual(nextBounds);
      expect(await previous.boundingBox()).toEqual(previousBounds);
    }
    await previous.click();
    expect(await next.boundingBox()).toEqual(nextBounds);
    await previous.click(); // Long concluding prayer.
    if (viewport.width <= 860) await page.locator('.prayer-surface').evaluate(element => element.scrollTop = element.scrollHeight);
    else await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    expect(await next.boundingBox()).toEqual(nextBounds);
    const text = (await page.locator('.prayer-text').boundingBox())!;
    const dock = (await page.locator('.prayer-controls').boundingBox())!;
    expect(text.y + text.height).toBeLessThanOrEqual(dock.y);
  });
}

for (const viewport of [{width: 390, height: 844}, {width: 320, height: 568}, {width: 768, height: 1024}]) {
  test(`mobile prayer area stays the same size at ${viewport.width}px`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    const surface = page.locator('.prayer-surface');
    await expect(page.locator('h1')).toHaveText('Sign of the Cross');
    await expect(surface).toBeVisible();
    const starting = (await surface.boundingBox())!;
    const buttons = (await page.locator('#next').boundingBox())!;
    const metrics = () => page.evaluate(() => {
      const area = document.querySelector('.prayer-surface')!;
      return { pageHeight: document.documentElement.scrollHeight, areaHeight: area.clientHeight, contentHeight: area.scrollHeight, scrollTop: area.scrollTop };
    });
    expect((await metrics()).pageHeight).toBeLessThanOrEqual(viewport.height);
    await page.locator('#next').click(); // Apostles' Creed: a long prayer.
    await expect(page.locator('h1')).toHaveText('The Apostles’ Creed');
    expect(await surface.boundingBox()).toEqual(starting);
    expect(await page.locator('#next').boundingBox()).toEqual(buttons);
    const long = await metrics();
    expect(long.contentHeight).toBeGreaterThan(long.areaHeight);
    await expect(page.locator('#scroll-cue')).toBeVisible();
    await surface.evaluate(element => element.scrollTop = element.scrollHeight);
    expect((await metrics()).scrollTop).toBeGreaterThan(0);
    await expect(page.locator('#scroll-cue')).toBeHidden();
    await page.locator('#next').click();
    expect((await metrics()).scrollTop).toBe(0);
    expect(await surface.boundingBox()).toEqual(starting);
    expect((await metrics()).pageHeight).toBeLessThanOrEqual(viewport.height);
  });
}
