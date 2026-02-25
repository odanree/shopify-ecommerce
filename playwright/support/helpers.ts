import { Page } from '@playwright/test';

/**
 * Wait for cart to be added and navigate to cart page
 */
export async function addToCartAndNavigate(page: Page): Promise<void> {
  const addButton = page.locator('[data-testid="add-to-cart-button"]').first();
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
    email?: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<void> {
  // AddressStep component has: firstName, lastName, address1, city, province, zip, country
  // Note: email comes from Stripe payment method, not from address form
  if (data.name) {
    const [firstName, lastName] = data.name.split(' ');
    if (firstName) await page.fill('[data-testid="shipping-firstName"]', firstName, { timeout: 5000 }).catch(() => {});
    if (lastName) await page.fill('[data-testid="shipping-lastName"]', lastName, { timeout: 5000 }).catch(() => {});
  }
  if (data.address) await page.fill('[data-testid="shipping-address"]', data.address, { timeout: 5000 }).catch(() => {});
  if (data.city) await page.fill('[data-testid="shipping-city"]', data.city, { timeout: 5000 }).catch(() => {});
  if (data.state) await page.fill('[data-testid="shipping-state"]', data.state, { timeout: 5000 }).catch(() => {});
  if (data.zip) await page.fill('[data-testid="shipping-zip"]', data.zip, { timeout: 5000 }).catch(() => {});
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
  testid: string,
  timeoutMs: number = 10000
): Promise<boolean> {
  try {
    await page.locator(`[data-testid="${testid}"]`).waitFor({ state: 'visible', timeout: timeoutMs });
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

  const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
  return orderNumber || null;
}

