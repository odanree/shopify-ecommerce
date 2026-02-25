import { test, expect } from '@playwright/test';

test.describe('Smoke Tests: Playwright Setup Verification', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Modern Ecommerce|Premium Tech/i);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('cart page is accessible', async ({ page }) => {
    await page.goto('/cart');
    // Should either show empty cart or cart items
    const pageContent = page
      .locator('[data-testid="empty-cart-page"], [data-testid="cart-item"]')
      .first();
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test('checkout page exists', async ({ page }) => {
    await page.goto('/checkout');
    // Check for either: empty state OR checkout form
    const checkoutContent = page.locator('main, form, [role="main"]').first();
    await expect(checkoutContent).toBeVisible({ timeout: 10000 });
  });
});

