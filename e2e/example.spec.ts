import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // ページのタイトルに "Playwright" という文字列が含まれているか確認
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // "Get started" というテキストを持つリンクをクリック
  await page.getByRole('link', { name: 'Get started' }).click();

  // "Installation" という見出しが表示されているか確認
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
