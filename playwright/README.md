# Playwright E2E Tests

## Overview

This directory contains Playwright E2E tests for the Shopify headless ecommerce platform, with a focus on the **critical payment flow** (Stripe → Shopify integration).

Unlike Cypress (which handles basic page interactions), Playwright excels at:
- Multi-tab/redirect scenarios (browser → Stripe-hosted checkout → back)
- Webhook interception and testing
- Async operations with proper timeout handling
- Mobile viewport testing (Apple/Google Pay buttons)

## Project Structure

```
playwright/
├── config.ts                    # Playwright configuration
├── e2e/                         # Test specs
│   ├── smoke.spec.ts           # Verification that setup works
│   ├── checkout.spec.ts        # End-to-end payment flow
│   ├── webhook.spec.ts         # Webhook verification & signature
│   ├── idempotency.spec.ts     # Duplicate order prevention
│   ├── cart-recovery.spec.ts   # Cart persistence on failure
│   └── mobile-payments.spec.ts # Apple/Google Pay visibility
├── fixtures/
│   └── payment.fixture.ts       # Stripe client & payment intent setup
└── support/
    ├── stripe-mock.ts           # Mock webhook generator
    └── helpers.ts               # Reusable utilities
```

## Getting Started

### 1. Verify Installation

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Check Configuration

The `playwright.config.ts` is pre-configured with:
- Base URL: `http://localhost:3000`
- Browsers: Chromium, WebKit, iPhone 12
- Timeout: 60 seconds per test
- Screenshots on failure
- Trace recording on retry

### 3. Update npm Scripts

Your `package.json` should include:

```json
{
  "scripts": {
    "playwright": "playwright test",
    "playwright:ui": "playwright test --ui",
    "playwright:debug": "playwright test --debug",
    "playwright:report": "playwright show-report"
  }
}
```

Add if missing:

```bash
npm pkg set scripts.playwright="playwright test"
npm pkg set scripts.playwright:ui="playwright test --ui"
npm pkg set scripts.playwright:debug="playwright test --debug"
npm pkg set scripts.playwright:report="playwright show-report"
```

## Running Tests

### Local Development

```bash
# Run smoke test (quick verification)
npx playwright test smoke.spec.ts

# Run all tests
npm run playwright

# Run with UI (interactive debugging)
npm run playwright:ui

# Run in debug mode (step through code)
npm run playwright:debug

# Run headless with slow motion (1s per action)
npx playwright test --headed --slowMo=1000

# View test report after run
npm run playwright:report
```

### Specific Test File

```bash
npx playwright test playwright/e2e/checkout.spec.ts
```

### CI/CD

```bash
npm run playwright -- --reporter=github
```

## Test Coverage

### Phase 1: Foundation ✅
- [x] Playwright config & fixtures
- [x] Smoke test (homepage, cart, checkout)
- [x] Mock webhook generator
- [x] Helper utilities

### Phase 2: Core Tests (In Progress)
- [ ] Checkout flow (redirect loop)
- [ ] Webhook verification
- [ ] Idempotency (no duplicate orders)

### Phase 3: Advanced Tests (Coming)
- [ ] Cart recovery on payment failure
- [ ] Mobile payment buttons
- [ ] Responsive design validation

## Environment Variables

Before running tests, ensure these are set in `.env.local`:

```bash
STRIPE_PUBLIC_KEY=pk_test_***
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_test_***

NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=***
SHOPIFY_ADMIN_API_TOKEN=***
SHOPIFY_STORE_NAME=***
```

## Debugging Failed Tests

### View Screenshots

After a failed test run:

```bash
npm run playwright:report
```

This opens an HTML report with screenshots and video (if enabled).

### View Traces

If `trace: 'on-first-retry'` is set in config, failed tests generate `.zip` traces:

```bash
npx playwright show-trace trace.zip
```

### Debug a Specific Test

```bash
npm run playwright:debug -- playwright/e2e/smoke.spec.ts
```

This opens the Playwright Inspector where you can:
- Step through code
- Inspect DOM
- Evaluate expressions
- Record new actions

## Data Attributes (data-cy)

Tests rely on `data-cy` attributes in your React components. If tests fail with "element not found", add these to your components:

```jsx
// Product
<button data-cy="add-to-cart-btn">Add to Cart</button>

// Cart
<div data-cy="cart-item">Item</div>
<div data-cy="empty-cart-page">Your Cart is Empty</div>

// Checkout
<input data-cy="shipping-email" />
<input data-cy="shipping-name" />
<input data-cy="shipping-address" />
<input data-cy="shipping-city" />
<input data-cy="shipping-state" />
<input data-cy="shipping-zip" />
<button data-cy="complete-purchase-btn">Complete Purchase</button>

// Success
<div data-cy="order-number">Order #1234</div>
<div data-cy="payment-error">Payment failed</div>

// Mobile
<button data-cy="apple-pay-btn">Apple Pay</button>
<button data-cy="google-pay-btn">Google Pay</button>
```

## Common Issues

### Issue: Stripe iframe not found
**Solution:** Use `frameLocator('iframe[title*="Stripe"]')` instead of basic selectors

### Issue: Tests timeout waiting for webhook
**Solution:** Webhook is async. Use `page.waitForTimeout(1000)` before querying for results

### Issue: Mobile tests fail with button not visible
**Solution:** Some payment buttons are conditional. Check browser/device support before test

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run playwright` | Run all tests |
| `npm run playwright:ui` | Interactive UI mode |
| `npm run playwright:debug` | Step through tests |
| `npm run playwright:report` | View HTML report |
| `npx playwright test smoke.spec.ts` | Run one file |
| `npx playwright test --headed` | Run with visible browser |
| `npx playwright test --slowMo=1000` | Slow execution (1s per action) |

## Next Steps

1. ✅ Phase 1 complete: Foundation & smoke test
2. **Phase 2 next:** Implement core payment flow tests
3. Phase 3 final: Advanced edge cases

See `PLAYWRIGHT_MIGRATION_PLAN.md` in docs/ for complete strategy.

---

**Status:** Foundation Complete ✅  
**Current Phase:** Phase 1 - Foundation  
**Next Task:** Run smoke test & verify setup
