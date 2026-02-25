import { Page } from '@playwright/test';

/**
 * Wait for cart to be added and navigate to cart page
 */
export async function addToCartAndNavigate(page: Page): Promise<void> {
  const addButton = page.locator('[data-cy="add-to-cart-btn"]').first();
  if (await addButton.isVisible({ timeout: 5000 })) {
    await addButton.click();
    await page.waitForURL('/cart', { timeout: 10000 });
  } else {
    throw new Error('Add to cart button not found');
  }
}

/**
 * Fill shipping information on checkout page
 */
export async function fillShippingInfo(
  page: Page,
  data: {
    email: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
): Promise<void> {
  await page.fill('[data-cy="shipping-email"]', data.email);
  await page.fill('[data-cy="shipping-name"]', data.name);
  await page.fill('[data-cy="shipping-address"]', data.address);
  await page.fill('[data-cy="shipping-city"]', data.city);
  await page.fill('[data-cy="shipping-state"]', data.state);
  await page.fill('[data-cy="shipping-zip"]', data.zip);
}

/**
 * Fill payment details in Stripe iframe
 */
export async function fillStripeCard(
  page: Page,
  cardNumber: string,
  expiryDate: string,
  cvc: string
): Promise<void> {
  const frameLocator = page.frameLocator('iframe[title*="Stripe"]').first();

  await frameLocator.locator('input[placeholder*="card number" i]').fill(cardNumber);
  await frameLocator.locator('input[placeholder*="MM / YY" i]').fill(expiryDate);
  await frameLocator.locator('input[placeholder*="CVC" i]').fill(cvc);
}

/**
 * Verify element is visible within timeout
 */
export async function verifyElementVisible(
  page: Page,
  selector: string,
  timeoutMs: number = 10000
): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: timeoutMs });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for success page with order confirmation
 */
export async function waitForSuccessPage(page: Page): Promise<string | null> {
  await page.waitForURL('/checkout/success', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  const orderNumber = await page.locator('[data-cy="order-number"]').textContent();
  return orderNumber || null;
}
