import { test, expect } from '@playwright/test';

test.describe('Family Plan Builder', () => {
  
  test.beforeEach(async ({ page }) => {
    // Playwright handles hydration and redirects natively 
    // without needing complex error-ignoring logic.
    await page.goto('/family-plan');
  });

  test('should load the family plan builder page', async ({ page }) => {
    // 'data-cy' can still be used, but Playwright prefers getByTestId 
    // (configurable in playwright.config.ts to map to 'data-cy')
    const builder = page.locator('[data-cy="family-plan-builder"]');
    await expect(builder).toBeVisible({ timeout: 10000 });
    
    await expect(page.locator('[data-cy="builder-title"]')).toContainText('Build Your Family Plan');
    await expect(page.locator('[data-cy="builder-subtitle"]')).toContainText(/Select the number of lines/i);
  });

  test('should allow adding lines', async ({ page }) => {
    const addLineBtn = page.locator('[data-cy="add-line-button"]');
    const lineItems = page.locator('[data-cy^="line-item-"]');

    // Get initial count
    const initialCount = await lineItems.count();
    
    // Add a line
    await addLineBtn.click();

    // Verification - Playwright will auto-retry until the length is correct
    await expect(lineItems).toHaveCount(initialCount + 1);
  });

  test('should display pricing section', async ({ page }) => {
    // Grouped assertions
    await expect(page.locator('[data-cy="pricing-summary"]')).toBeVisible();
    await expect(page.locator('[data-cy="subtotal-amount"]')).toBeVisible();
    await expect(page.locator('[data-cy="savings-amount"]')).toBeVisible();
  });
});