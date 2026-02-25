# Playwright Migration Plan: Payment Flow Testing

**Status:** In Progress  
**Objective:** Transition from Cypress to Playwright for critical payment flow testing  
**Approach:** "Diamond" strategy—focus on Integration Isolation, not duplication  
**Timeline:** Phase 1 (Foundation) → Phase 2 (Core Tests) → Phase 3 (Advanced Scenarios)

---

## 🎯 Strategic Overview

### Why Playwright?

- **Multi-tab handling** — Seamlessly navigate Stripe-hosted checkout and back to success page
- **Webhook testing** — Request interception + context creation for isolated test environments
- **Performance** — Async/await syntax naturally handles webhook delays (1–3 seconds)
- **Maintainability** — Strong TypeScript support, better debugging, visual traces

### The "Diamond" Principle

Instead of duplicating Cypress tests (Add to Cart, Browse Products), **Playwright targets the critical path** that only headless payment systems require:

```
Core Path (Cypress)          ↘
                              → Playwright (Payment Critical Path)
                              ↙
Advanced Payment Scenarios
```

**Cypress remains for:**
- Homepage navigation
- Collection browsing
- Cart management basics (non-payment)
- Product filtering

**Playwright handles:**
- Complete payment flow (Stripe → Shopify)
- Webhook verification
- Idempotency edge cases
- Cart recovery on payment failure
- Mobile payment buttons (Apple/Google Pay)

---

## 📋 Test Suite Structure

### File Organization

```
playwright/
├── config.ts                    # Playwright config (baseURL, timeouts, retries)
├── fixtures/
│   ├── payment.fixture.ts       # Shared payment setup & teardown
│   ├── webhook.fixture.ts       # Mock Stripe webhook context
│   └── shopify.fixture.ts       # Shopify Admin API client
├── e2e/
│   ├── checkout.spec.ts         # The "Clean Path"
│   ├── webhook.spec.ts          # The "Webhook Interceptor"
│   ├── idempotency.spec.ts      # The "Double Hit"
│   ├── cart-recovery.spec.ts    # State & Storage Tests
│   └── mobile-payments.spec.ts  # Responsive Pay
├── support/
│   ├── helpers.ts               # Reusable payment utilities
│   └── stripe-mock.ts           # Mock Stripe event generator
└── README.md                    # Quick start & running guide
```

### Test Files & Scope

| Test File | Focus | Key Feature | Complexity | Priority |
|-----------|-------|-------------|-----------|----------|
| **checkout.spec.ts** | The Redirect Loop | Tests jump from your domain → Stripe → back to success page | Medium | 🔴 P0 |
| **webhook.spec.ts** | The Handshake | Sends mock Stripe events to `/api/payment/webhook`; verifies signature/logic | Medium | 🔴 P0 |
| **idempotency.spec.ts** | The "Double Hit" | Sends same webhook twice; ensures orders aren't duplicated | Low | 🟡 P1 |
| **cart-recovery.spec.ts** | State & Storage | Tests cart persistence on payment failure/retry | Low | 🟡 P1 |
| **mobile-payments.spec.ts** | Responsive Pay | Verifies Apple/Google Pay buttons visible on mobile viewports | Low | 🟡 P1 |

---

## 🛠️ Phase 1: Foundation (Week 1)

### 1.1 Install & Configure Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### 1.2 Create Base Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/e2e',
  testMatch: '**/*.spec.ts',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'iPhone',
      use: { ...devices['iPhone 12'] },
    },
  ],
  timeout: 60 * 1000,
  globalTimeout: 10 * 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
});
```

### 1.3 Setup npm Scripts

**Update `package.json`:**

```json
{
  "scripts": {
    "playwright:install": "playwright install",
    "playwright": "playwright test",
    "playwright:ui": "playwright test --ui",
    "playwright:debug": "playwright test --debug",
    "playwright:report": "playwright show-report"
  }
}
```

### 1.4 Create Fixtures for Payment Testing

**File:** `playwright/fixtures/payment.fixture.ts`

```typescript
import { test as base } from '@playwright/test';
import Stripe from 'stripe';

// Type-safe fixtures for payment tests
export const test = base.extend<{
  stripeClient: Stripe;
  mockPaymentIntentId: string;
}>({
  stripeClient: async ({}, use) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    await use(stripe);
  },
  
  mockPaymentIntentId: async ({ stripeClient }, use) => {
    // Create real Payment Intent for testing
    const intent = await stripeClient.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { test: true },
    });
    await use(intent.id);
    // Cleanup: cancel intent after test
    await stripeClient.paymentIntents.cancel(intent.id);
  },
});

export { expect } from '@playwright/test';
```

### 1.5 Create Webhook Mock Utility

**File:** `playwright/support/stripe-mock.ts`

```typescript
import crypto from 'crypto';

interface MockWebhookPayload {
  type: 'payment_intent.succeeded' | 'payment_intent.payment_failed';
  id: string;
  object: string;
  [key: string]: any;
}

/**
 * Generate a mock Stripe webhook with valid signature
 * Mimics what Stripe sends to /api/payment/webhook
 */
export function generateMockWebhookEvent(
  payload: Partial<MockWebhookPayload>,
  webhookSecret: string
): { body: string; headers: Record<string, string> } {
  const now = Math.floor(Date.now() / 1000);
  const baseEvent: MockWebhookPayload = {
    type: 'payment_intent.succeeded',
    id: `evt_test_${crypto.randomBytes(12).toString('hex')}`,
    object: 'event',
    created: now,
    data: {
      object: {
        id: `pi_test_${crypto.randomBytes(12).toString('hex')}`,
        object: 'payment_intent',
        status: 'succeeded',
        metadata: { shopify_cart: JSON.stringify([]) },
        ...payload.data,
      },
    },
    ...payload,
  };

  const body = JSON.stringify(baseEvent);
  const timestamp = now.toString();
  
  // Sign using Stripe's algorithm
  const signedContent = `${timestamp}.${body}`;
  const signature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedContent)
    .digest('base64');

  return {
    body,
    headers: {
      'stripe-signature': `t=${timestamp},v1=${signature}`,
      'content-type': 'application/json',
    },
  };
}
```

---

## 🧪 Phase 2: Core Tests (Week 2)

### 2.1 Test 1: The "Clean Path" (Redirect Loop)

**File:** `playwright/e2e/checkout.spec.ts`

```typescript
import { test, expect } from '../fixtures/payment.fixture';

test.describe('Checkout Flow: Stripe Redirect Loop', () => {
  test('complete payment from home → stripe → success', async ({ 
    page, 
    stripeClient,
    mockPaymentIntentId 
  }) => {
    // Step 1: Navigate to home
    await page.goto('/');
    await expect(page).toHaveTitle(/Shopify/i);

    // Step 2: Add a product to cart
    await page.click('[data-cy="add-to-cart-btn"]');
    await page.waitForURL('/cart');

    // Step 3: Go to checkout
    await page.click('[data-cy="checkout-btn"]');
    
    // Step 4: Fill shipping info
    await page.fill('[data-cy="shipping-email"]', 'test@example.com');
    await page.fill('[data-cy="shipping-name"]', 'Test User');
    await page.fill('[data-cy="shipping-address"]', '123 Main St');
    await page.fill('[data-cy="shipping-city"]', 'San Francisco');
    await page.fill('[data-cy="shipping-state"]', 'CA');
    await page.fill('[data-cy="shipping-zip"]', '94102');

    // Step 5: Trigger payment (uses mocked card)
    // The Stripe iframe loads within the page context
    const frameLocator = page.frameLocator('iframe[title="Stripe.com secure payment input frame"]');
    await frameLocator.locator('input[placeholder="Card number"]').fill('4242424242424242');
    await frameLocator.locator('input[placeholder="MM / YY"]').fill('12/25');
    await frameLocator.locator('input[placeholder="CVC"]').fill('123');

    // Step 6: Click "Complete Purchase"
    await page.click('[data-cy="complete-purchase-btn"]');

    // Step 7: Handle redirect to Stripe-hosted checkout
    // Playwright natively supports this with page.waitForURL
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
    
    // Step 8: Confirm payment (in Stripe UI)
    await page.click('button:has-text("Confirm")');

    // Step 9: Wait for redirect back to your success page
    await page.waitForURL('/checkout/success', { timeout: 15000 });

    // Step 10: Verify success page elements
    await expect(page).toHaveTitle(/Order Confirmed/);
    await expect(page.locator('[data-cy="order-number"]')).toBeVisible();
    
    // Step 11: Query Shopify Admin API to verify order exists
    const orderNumber = await page.locator('[data-cy="order-number"]').textContent();
    const orders = await stripeClient.paymentIntents.retrieve(mockPaymentIntentId);
    
    expect(orders.metadata?.shopify_order_id).toBeTruthy();
    console.log(`✅ Order created in Shopify: ${orders.metadata?.shopify_order_id}`);
  });

  test('handle payment timeout gracefully', async ({ page }) => {
    // Edge case: User takes 60+ seconds in Stripe UI
    // After 60s, Stripe timeout should not break the flow
    
    await page.goto('/checkout');
    // ... fill form ...
    
    // Artificially wait long in Stripe UI
    await page.waitForTimeout(65000);
    
    // Even if frontend polling times out, backend webhook should create order
    // Verify via API call or Shopify Admin query
  });
});
```

### 2.2 Test 2: The "Webhook Interceptor"

**File:** `playwright/e2e/webhook.spec.ts`

```typescript
import { test, expect } from '../fixtures/payment.fixture';
import { generateMockWebhookEvent } from '../support/stripe-mock';

test.describe('Webhook Verification: Stripe → Shopify Handshake', () => {
  test('webhook signature verification prevents spoofing', async ({ page }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    // Generate a legitimate mock webhook
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_mock_1234',
            status: 'succeeded',
            metadata: {
              shopify_cart: JSON.stringify([
                { variant_id: 'gid://shopify/ProductVariant/1', quantity: 1 }
              ]),
            },
          },
        },
      },
      webhookSecret
    );

    // POST to webhook endpoint
    const response = await page.request.post('/api/payment/webhook', {
      headers,
      data: body,
    });

    // Should return 200 OK (webhook processed successfully)
    expect(response.status()).toBe(200);
    
    // Verify response contains success message
    const json = await response.json();
    expect(json.received).toBe(true);
  });

  test('webhook rejects invalid signature (spoofing attack)', async ({ page }) => {
    // Generate event with WRONG signature
    const fakeSignature = 'v1=fakefakefakefakefake';
    
    const response = await page.request.post('/api/payment/webhook', {
      headers: {
        'stripe-signature': fakeSignature,
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_fake' } },
      }),
    });

    // Should return 400 (unauthorized)
    expect(response.status()).toBe(400);
  });

  test('webhook creates Shopify order with correct metadata', async ({ page, stripeClient }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    // Create real payment intent first
    const intent = await stripeClient.paymentIntents.create({
      amount: 2999, // $29.99
      currency: 'usd',
      metadata: {
        shopify_cart: JSON.stringify([
          {
            variant_id: 'gid://shopify/ProductVariant/44654321',
            title: 'Test Product',
            quantity: 1,
            price: 2999,
          },
        ]),
        customer_email: 'webhook-test@example.com',
      },
    });

    // Generate valid webhook for this intent
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: intent.id,
            status: 'succeeded',
            metadata: intent.metadata,
          },
        },
      },
      webhookSecret
    );

    // Send webhook
    const response = await page.request.post('/api/payment/webhook', { headers, data: body });
    expect(response.status()).toBe(200);

    // Wait a moment for async processing
    await page.waitForTimeout(1000);

    // Query Shopify to verify order was created
    const shopifyResponse = await page.request.get(
      `/api/shopify/orders?tag=Stripe-Payment,${intent.id}`
    );
    const orders = await shopifyResponse.json();
    
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].customer.email).toBe('webhook-test@example.com');
  });
});
```

### 2.3 Test 3: The "Double Hit" (Idempotency)

**File:** `playwright/e2e/idempotency.spec.ts`

```typescript
import { test, expect } from '../fixtures/payment.fixture';
import { generateMockWebhookEvent } from '../support/stripe-mock';

test.describe('Idempotency: Webhook Retry Prevention', () => {
  test('webhook retry does not create duplicate orders', async ({ page, stripeClient }) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    // Create payment intent
    const intent = await stripeClient.paymentIntents.create({
      amount: 1500,
      currency: 'usd',
      metadata: {
        shopify_cart: JSON.stringify([{ variant_id: 'gid://shopify/ProductVariant/123', quantity: 1 }]),
        customer_email: 'idempotent-test@example.com',
      },
    });

    // Generate webhook event
    const { body, headers } = generateMockWebhookEvent(
      {
        type: 'payment_intent.succeeded',
        data: { object: { id: intent.id, status: 'succeeded', metadata: intent.metadata } },
      },
      webhookSecret
    );

    // Send webhook TWICE (simulating Stripe retry)
    const response1 = await page.request.post('/api/payment/webhook', { headers, data: body });
    expect(response1.status()).toBe(200);

    await page.waitForTimeout(500);

    const response2 = await page.request.post('/api/payment/webhook', { headers, data: body });
    expect(response2.status()).toBe(200);

    // Wait for async processing
    await page.waitForTimeout(1000);

    // Query Shopify: should only have ONE order with this payment intent tag
    const shopifyResponse = await page.request.get(
      `/api/shopify/orders?tag=Stripe-Payment,${intent.id}`
    );
    const orders = await shopifyResponse.json();
    
    // Critical assertion: only 1 order, not 2
    expect(orders.length).toBe(1);
    console.log(`✅ Idempotency verified: Single webhook with ID ${intent.id} created exactly 1 order`);
  });
});
```

---

## 🛒 Phase 3: Advanced Scenarios (Week 3)

### 3.1 Test 4: Cart Recovery (State & Storage)

**File:** `playwright/e2e/cart-recovery.spec.ts`

```typescript
import { test, expect } from '../fixtures/payment.fixture';

test.describe('Cart Recovery: Payment Failure Resilience', () => {
  test('cart items persist after payment decline', async ({ page }) => {
    // Add item to cart
    await page.goto('/');
    await page.click('[data-cy="add-to-cart-btn"]');
    await page.waitForURL('/cart');

    // Get initial cart state
    const cartItems1 = await page.locator('[data-cy="cart-item"]').count();

    // Go to checkout
    await page.click('[data-cy="checkout-btn"]');

    // Fill form
    await page.fill('[data-cy="shipping-email"]', 'recover@example.com');
    // ... other fields ...

    // Use DECLINED test card: 4000000000000002
    const frameLocator = page.frameLocator('iframe[title="Stripe"]');
    await frameLocator.locator('input[placeholder="Card number"]').fill('4000000000000002');
    await frameLocator.locator('input[placeholder="MM / YY"]').fill('12/25');
    await frameLocator.locator('input[placeholder="CVC"]').fill('123');

    // Click "Complete Purchase"
    await page.click('[data-cy="complete-purchase-btn"]');

    // Wait for decline error
    await expect(page.locator('[data-cy="payment-error"]')).toContainText('declined');

    // Navigate back to cart
    await page.goto('/cart');

    // Items should still be there
    const cartItems2 = await page.locator('[data-cy="cart-item"]').count();
    expect(cartItems2).toBe(cartItems1);
  });

  test('cart clears only after successful order', async ({ page, stripeClient }) => {
    // Add item
    await page.goto('/');
    await page.click('[data-cy="add-to-cart-btn"]');
    await page.waitForURL('/cart');

    // Before checkout: verify cart has items
    const itemsBefore = await page.locator('[data-cy="cart-item"]').count();
    expect(itemsBefore).toBeGreaterThan(0);

    // Complete checkout with VALID card
    await page.click('[data-cy="checkout-btn"]');
    // ... fill form & pay ...
    
    // Wait for success
    await page.waitForURL('/checkout/success');

    // Navigate back to cart
    await page.goto('/cart');

    // Cart should be empty
    await expect(page.locator('[data-cy="empty-cart-page"]')).toBeVisible();
  });
});
```

### 3.2 Test 5: Mobile Payment Buttons

**File:** `playwright/e2e/mobile-payments.spec.ts`

```typescript
import { test, devices, expect } from '@playwright/test';

test.describe('Mobile Payments: Apple Pay & Google Pay', () => {
  test('Apple Pay button visible on iPhone', async (testInfo) => {
    const context = await testInfo.browser!.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000');
    
    // Add to cart on mobile
    await page.click('[data-cy="add-to-cart-btn"]');
    await page.goto('http://localhost:3000/checkout');

    // Apple Pay button should be visible on iOS
    await expect(page.locator('[data-cy="apple-pay-btn"]')).toBeVisible();

    await context.close();
  });

  test('Google Pay button visible on Android', async (testInfo) => {
    const context = await testInfo.browser!.newContext({
      ...devices['Pixel 5'],
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000');
    
    await page.click('[data-cy="add-to-cart-btn"]');
    await page.goto('http://localhost:3000/checkout');

    // Google Pay button should be visible on Android
    await expect(page.locator('[data-cy="google-pay-btn"]')).toBeVisible();

    await context.close();
  });

  test('Payment Element responsive on mobile viewport', async (testInfo) => {
    const context = await testInfo.browser!.newContext({
      viewport: { width: 375, height: 667 }, // iPhone SE
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000/checkout');

    // Payment Element should be visible and not overflow
    const stripeFrame = page.frameLocator('iframe[title*="Stripe"]');
    await expect(stripeFrame.locator('input[placeholder="Card number"]')).toBeInViewport();

    await context.close();
  });
});
```

---

## 🎬 Running the Tests

### Local Development

```bash
# Run all Playwright tests
npm run playwright

# Run with UI (interactive mode)
npm run playwright:ui

# Run specific test file
npx playwright test playwright/e2e/checkout.spec.ts

# Debug mode (step through code)
npm run playwright:debug

# Generate + view HTML report
npm run playwright && npm run playwright:report
```

### CI/CD Integration

**Update `package.json`:**

```json
{
  "scripts": {
    "test:playwright:ci": "playwright test --reporter=github"
  }
}
```

**GitHub Actions (`.github/workflows/e2e-playwright.yml`):**

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - run: npm run build
      - run: npm run playwright
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📊 Success Criteria

- ✅ All 5 test suites passing (checkout, webhook, idempotency, cart-recovery, mobile)
- ✅ Payment flow works end-to-end (Stripe → Shopify → Success page)
- ✅ Webhook signature verification prevents spoofing attacks
- ✅ Idempotency prevents duplicate orders on webhook retries
- ✅ Cart persists through payment failures
- ✅ Mobile payment buttons render correctly
- ✅ CI/CD integration passing on all PRs

---

## 🔧 Debugging & Troubleshooting

### Common Issues

**Issue:** Stripe iframe not loading in Playwright
- **Solution:** Use `frameLocator('iframe[title="Stripe"]')` instead of `locator('iframe')`
- **Why:** Playwright needs exact frame selectors

**Issue:** Webhook signature validation failing
- **Solution:** Verify `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint secret (not signing secret)
- **Command:** `echo $STRIPE_WEBHOOK_SECRET`

**Issue:** Async webhook processing too slow
- **Solution:** Increase polling timeout in success page polling
- **Current:** 10 retries × 2 seconds = 20 second max wait
- **Adjust:** Update `/api/payment/order-number` endpoint timeout if needed

**Issue:** Mobile viewport tests flaky
- **Solution:** Use explicit `waitForLoadState('networkidle')` before assertions
- **Example:** `await page.waitForLoadState('networkidle');`

### Debugging Tools

```bash
# Enable trace recording for failed tests
npx playwright test --trace on

# View traces in Playwright Inspector
npx playwright show-trace trace.zip

# Screenshot on every step
npx playwright test --screenshot on

# Slow down execution (helpful for manual inspection)
npx playwright test --headed --slowMo=1000
```

---

## 📈 Next Steps

1. **Week 1:** Install Playwright, create fixtures & config
2. **Week 2:** Implement core 3 tests (checkout, webhook, idempotency)
3. **Week 3:** Add advanced tests (cart-recovery, mobile-payments)
4. **Week 4:** Integrate with CI/CD, refine based on real runs
5. **Post-Launch:** Maintain both Cypress (basic E2E) + Playwright (payment critical path)

---

## 📚 References

- [Playwright Official Docs](https://playwright.dev/)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Stripe Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Next.js + Playwright Guide](https://nextjs.org/docs/testing#playwright)

---

**Owner:** @odanree  
**Last Updated:** Feb 24, 2026  
**Status:** Ready for Phase 1 Implementation
