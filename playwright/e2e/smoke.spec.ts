import { test, expect } from '@playwright/test';

test.describe('Smoke Tests: Playwright Setup Verification', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Shopify/i);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('cart page is accessible', async ({ page }) => {
    await page.goto('/cart');
    // Should either show empty cart or cart items
    const pageContent = page.locator('[data-cy="empty-cart-page"], [data-cy="cart-item"]').first();
    await expect(pageContent).toBeVisible({ timeout: 10000 });
  });

  test('checkout page exists', async ({ page }) => {
    await page.goto('/checkout');
    const checkoutForm = page.locator('[data-cy="shipping-email"], form').first();
    await expect(checkoutForm).toBeVisible({ timeout: 10000 });
  });
});
