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
  expect(errors).toEqual([]);
});

test('reload offers exact saved position and settings preserve the current bead', async ({ page }) => {
  await page.locator('#journey [data-section="2"]').click();
  for (let n = 0; n < 6; n++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await page.reload();
  await page.getByRole('button', {name: 'Continue where I left off'}).click();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await page.getByRole('button', {name: 'Open settings'}).click();
  await page.getByLabel('Include the Fatima Prayer').uncheck();
  await page.getByLabel('Appearance').selectOption('dark');
  await page.getByLabel('Prayer text size').selectOption('largest');
  await page.keyboard.press('Escape');
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 5 of 10');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#step-count')).toHaveText('27 / 75');
});

test('mobile navigation, mystery selection, reference, and layouts', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.screenshot({path: 'test-results/mobile-opening.png', fullPage: true});
  await page.getByRole('button', {name: 'Journey', exact: true}).click();
  await page.locator('#mobile-journey [data-section="1"]').click();
  await expect(page.locator('h1')).toHaveText('The Annunciation');
  await page.locator('#next').click();
  await page.locator('#next').click();
  await expect(page.locator('.bead-count')).toHaveText('Hail Mary 1 of 10');
  await page.screenshot({path: 'test-results/mobile-bead.png', fullPage: true});
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
  await page.screenshot({path: 'test-results/desktop-opening.png', fullPage: true});
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
