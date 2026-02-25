# Playwright Migration: Quick Start Checklist

## Phase 1: Foundation (Next 1-2 Hours)

### Step 1: Install Playwright
- [ ] Run: `npm install -D @playwright/test @types/node`
- [ ] Run: `npx playwright install`
- [ ] Verify: `npx playwright --version`

### Step 2: Create Base Files
- [ ] Create `playwright.config.ts` (copy from PLAYWRIGHT_MIGRATION_PLAN.md)
- [ ] Create `playwright/` directory structure:
  ```
  mkdir -p playwright/{e2e,fixtures,support}
  touch playwright/config.ts
  ```

### Step 3: Create Fixtures
- [ ] Create `playwright/fixtures/payment.fixture.ts` with Stripe client setup
- [ ] Create `playwright/support/stripe-mock.ts` with webhook mock generator
- [ ] Create `playwright/support/helpers.ts` for reusable utilities

### Step 4: Update package.json
- [ ] Add scripts:
  ```json
  "playwright": "playwright test",
  "playwright:ui": "playwright test --ui",
  "playwright:debug": "playwright test --debug",
  "playwright:report": "playwright show-report"
  ```

### Step 5: Smoke Test
- [ ] Run: `npm run playwright:ui`
- [ ] Open browser, verify it connects to http://localhost:3000
- [ ] Create dummy test: `playwright/e2e/smoke.spec.ts`
  ```typescript
  import { test, expect } from '@playwright/test';
  test('smoke test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Shopify/i);
  });
  ```

---

## Phase 2: Core Tests (Next 2-3 Hours)

### Step 6: Implement checkout.spec.ts
- [ ] Create `playwright/e2e/checkout.spec.ts`
- [ ] Implement "Clean Path" test (home → cart → checkout → stripe → success)
- [ ] Add selectors to components if missing:
  - `[data-cy="add-to-cart-btn"]`
  - `[data-cy="checkout-btn"]`
  - `[data-cy="complete-purchase-btn"]`
  - `[data-cy="order-number"]`
- [ ] Run: `npx playwright test checkout.spec.ts`

### Step 7: Implement webhook.spec.ts
- [ ] Create `playwright/e2e/webhook.spec.ts`
- [ ] Implement 3 webhook tests:
  1. Valid signature → 200 OK
  2. Invalid signature → 400 Error
  3. Order creation verification
- [ ] Run: `npx playwright test webhook.spec.ts`

### Step 8: Implement idempotency.spec.ts
- [ ] Create `playwright/e2e/idempotency.spec.ts`
- [ ] Implement "Double Hit" test (send webhook twice, verify 1 order)
- [ ] Run: `npx playwright test idempotency.spec.ts`

### Step 9: Check & Refine
- [ ] Run all three together: `npx playwright test`
- [ ] Review failures (expected with new codebase)
- [ ] Update component selectors in your React components
- [ ] Rerun tests until green

---

## Phase 3: Polish (Optional, Next 1 Hour)

### Step 10: Add Cart Recovery Test
- [ ] Create `playwright/e2e/cart-recovery.spec.ts`
- [ ] Test declined card (4000000000000002) → items persist
- [ ] Test success → cart clears

### Step 11: Add Mobile Tests
- [ ] Create `playwright/e2e/mobile-payments.spec.ts`
- [ ] Test iPhone viewport (Apple Pay button visible)
- [ ] Test Android viewport (Google Pay button visible)

### Step 12: CI/CD Integration
- [ ] Create `.github/workflows/e2e-playwright.yml`
- [ ] Push & verify tests run on PR

---

## Selector Checklist: Add These to Your Components

Playwright needs these `data-cy` attributes. Update your React components:

```jsx
// Add to product card
<button data-cy="add-to-cart-btn">Add to Cart</button>

// Add to cart page
<button data-cy="checkout-btn">Proceed to Checkout</button>
<div data-cy="cart-item">Item</div>
<div data-cy="empty-cart-page">Empty message</div>

// Add to checkout page
<input data-cy="shipping-email" />
<input data-cy="shipping-name" />
<input data-cy="shipping-address" />
<button data-cy="complete-purchase-btn">Complete Purchase</button>

// Add to success page
<div data-cy="order-number">Order #1234</div>
<div data-cy="payment-error">Error message</div>

// Add to payment button area
<button data-cy="apple-pay-btn">Apple Pay</button>
<button data-cy="google-pay-btn">Google Pay</button>
```

---

## Environment Variables Check

Before running tests, verify these are set:

```bash
# Check Stripe keys
echo $STRIPE_PUBLIC_KEY
echo $STRIPE_SECRET_KEY
echo $STRIPE_WEBHOOK_SECRET

# Check Shopify tokens
echo $NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
echo $SHOPIFY_ADMIN_API_TOKEN
echo $SHOPIFY_STORE_NAME
```

If missing, update `.env.local` or create test fixtures with hardcoded values.

---

## Quick Commands Reference

```bash
# Run all tests
npm run playwright

# Run one file
npx playwright test playwright/e2e/checkout.spec.ts

# Run with UI (debug interactively)
npm run playwright:ui

# Debug a specific test
npm run playwright:debug -- playwright/e2e/checkout.spec.ts

# View report after failure
npm run playwright:report

# Run headed (see browser)
npx playwright test --headed

# Run slow (1s per action, easy to watch)
npx playwright test --headed --slowMo=1000
```

---

## Expected Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Install + Config | 1-2h | ⬜ TODO |
| 2 | Core Tests (3) | 2-3h | ⬜ TODO |
| 3 | Advanced Tests (2) | 1-2h | ⬜ TODO |
| 4 | CI/CD + Refine | 1-2h | ⬜ TODO |
| **Total** | **Full Suite** | **5-9h** | ⬜ TODO |

---

## What Happens Next?

Once Phase 1 passes:
1. You'll have a working Playwright setup
2. Phase 2 will verify your payment flow end-to-end
3. Phase 3 adds edge cases (failures, mobile, etc.)
4. Your project gains production-grade test coverage for critical payment path

---

**Status:** Ready to start Phase 1  
**Contact:** Reach out if blocked on selectors or Stripe/Shopify API access  
**Reference:** See `PLAYWRIGHT_MIGRATION_PLAN.md` for full details
