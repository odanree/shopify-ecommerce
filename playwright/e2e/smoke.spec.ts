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
    // Cart page always renders - either empty state or items
    // Check for stable container that exists in both states
    const cartContainer = page.locator('main, [role="main"], div[class*="cart"]').first();
    await expect(cartContainer).toBeVisible({ timeout: 10000 });
  });

  test('checkout page exists', async ({ page }) => {
    await page.goto('/checkout');
    // Checkout page renders either empty state or form - look for stable container
    const checkoutContent = page.locator('main, [role="main"], form, h1').first();
    await expect(checkoutContent).toBeVisible({ timeout: 10000 });
  });
});

