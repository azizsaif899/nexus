import { test, expect } from '@playwright/test';

test.describe('Content Management E2E', () => {
  test('should create content', async ({ page }) => {
    await page.goto('/admin/content');
    await page.click('text=إضافة محتوى جديد');
    await page.fill('input[name="title"]', 'Test Article');
    await page.fill('textarea', 'Test content');
    await page.click('text=حفظ');
    await expect(page.locator('text=Test Article')).toBeVisible();
  });

  test('should search content', async ({ page }) => {
    await page.goto('/knowledge-base');
    await page.fill('input[type="text"]', 'test');
    await expect(page.locator('.search-results')).toBeVisible();
  });
});