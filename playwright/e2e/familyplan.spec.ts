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
    let initialCount = await lineItems.count();
    console.log('Initial line items:', initialCount);
    
    // Add a line
    await addLineBtn.click();
    
    // Wait for count to increase - with timeout
    let newCount = initialCount;
    let attempts = 0;
    while (newCount === initialCount && attempts < 10) {
      await page.waitForTimeout(100);
      newCount = await lineItems.count();
      attempts++;
    }
    
    console.log('After adding, line items:', newCount);

    // Verify count increased
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should display pricing section', async ({ page }) => {
    // Grouped assertions
    await expect(page.locator('[data-cy="pricing-summary"]')).toBeVisible();
    await expect(page.locator('[data-cy="subtotal-amount"]')).toBeVisible();
    await expect(page.locator('[data-cy="savings-amount"]')).toBeVisible();
  });
});