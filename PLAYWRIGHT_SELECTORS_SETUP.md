# Playwright Test Selectors Setup Guide

## Current Status

Playwright tests are running, but **some components are missing `data-cy` selectors** for reliable testing. This guide lists what needs to be added.

## ✅ Already Implemented

These components have proper `data-cy` selectors:

```
✅ Cart page:
  - [data-cy="empty-cart-page"]
  - [data-cy="empty-cart-title"]
  - [data-cy="empty-cart-message"]
  - [data-cy="cart-page"]
  - [data-cy="cart-title"]
  - [data-cy="cart-item-count"]
  - [data-cy="cart-items-list"]
  - [data-cy="cart-item"]

✅ Homepage:
  - [data-cy="homepage-container"]
  - [data-cy="hero-section"]
  - [data-cy="hero-title"]
  - [data-cy="hero-subtitle"]
  - [data-cy="hero-buttons"]
  - [data-cy="shop-now-button"]
  - [data-cy="build-family-plan-button"]
  - [data-cy="featured-products-section"]

✅ FamilyPlanBuilder:
  - [data-cy="add-to-cart-button"]
```

## ❌ Missing Selectors (Needed for Tests)

### 1. **AddToCart Component** (Product Page)
**Location:** `components/AddToCart.tsx`

**Add these selectors:**
```tsx
// Main add to cart button
<button data-cy="add-to-cart-button" /* existing props */>
  Add to Cart
</button>

// Optional: Quantity selector
<input data-cy="product-quantity-input" type="number" min="1" />

// Optional: Size/variant selector
<select data-cy="product-variant-select">
  {/* options */}
</select>

// Optional: Success message
<div data-cy="add-to-cart-success">
  Added to cart!
</div>
```

### 2. **Checkout/Payment Components**
**Location:** `components/Checkout.tsx` or `app/checkout/page.tsx`

**Add these selectors:**
```tsx
// Shipping form fields
<input data-cy="shipping-email" />
<input data-cy="shipping-name" />
<input data-cy="shipping-address" />
<input data-cy="shipping-city" />
<input data-cy="shipping-state" />
<input data-cy="shipping-zip" />
<input data-cy="shipping-country" />

// Payment form
<div data-cy="payment-element">
  {/* Stripe PaymentElement */}
</div>

// Checkout buttons
<button data-cy="checkout-btn">
  Proceed to Checkout
</button>

<button data-cy="complete-purchase-btn">
  Complete Purchase
</button>

// Error handling
<div data-cy="payment-error">
  {/* Error message */}
</div>

// Loading state
<div data-cy="checkout-loading">
  Processing...
</div>
```

### 3. **Success Page** (After Payment)
**Location:** `app/checkout/success/page.tsx`

**Add these selectors:**
```tsx
// Order confirmation
<div data-cy="order-success">
  Order Confirmed!
</div>

<h1 data-cy="order-number">
  Order #12345
</h1>

<p data-cy="order-total">
  Total: $99.99
</p>

<button data-cy="view-order-btn">
  View Order Details
</button>

<a data-cy="shopify-admin-link" href={shopifyOrderLink}>
  Open in Shopify Admin
</a>

<a data-cy="continue-shopping-link" href="/">
  Continue Shopping
</a>
```

### 4. **Cart Page** (Additional)
**Location:** `app/cart/page.tsx`

**Add these selectors:**
```tsx
// Checkout button
<button data-cy="checkout-btn">
  Proceed to Checkout
</button>

// Cart summary
<div data-cy="cart-summary">
  <p data-cy="cart-subtotal">Subtotal: $XX.XX</p>
  <p data-cy="cart-tax">Tax: $XX.XX</p>
  <p data-cy="cart-total">Total: $XX.XX</p>
</div>

// Empty cart actions
<a data-cy="continue-shopping-link" href="/products">
  Continue Shopping
</a>
```

## How to Add Selectors

### Simple Example
**Before:**
```tsx
<button onClick={handleAddToCart} className={styles.button}>
  Add to Cart
</button>
```

**After:**
```tsx
<button 
  data-cy="add-to-cart-button"  // ← ADD THIS LINE
  onClick={handleAddToCart} 
  className={styles.button}
>
  Add to Cart
</button>
```

### Complex Component
```tsx
export function AddToCart({ product }: AddToCartProps) {
  return (
    <div data-cy="add-to-cart-container">
      <select data-cy="product-variant-select">
        {product.variants.map(v => (
          <option key={v.id} value={v.id}>{v.title}</option>
        ))}
      </select>

      <input 
        data-cy="product-quantity-input"
        type="number"
        min="1"
        defaultValue="1"
      />

      <button 
        data-cy="add-to-cart-button"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      {error && (
        <div data-cy="add-to-cart-error">{error}</div>
      )}
      {success && (
        <div data-cy="add-to-cart-success">✅ Added!</div>
      )}
    </div>
  );
}
```

## Testing Workflow After Adding Selectors

1. **Add selectors to components** (follow examples above)
2. **Commit changes:**
   ```bash
   git add components/ app/
   git commit -m "test: add data-cy selectors for Playwright E2E tests"
   ```

3. **Run tests:**
   ```bash
   npm run playwright
   ```

4. **View results:**
   ```bash
   npm run playwright:report
   ```

## Priority Order

**High Priority** (add first - enables core tests):
1. AddToCart component (add-to-cart-button)
2. Checkout page (shipping fields, payment elements)
3. Success page (order confirmation)

**Medium Priority** (adds robustness):
1. Checkout buttons (checkout-btn, complete-purchase-btn)
2. Error handling (payment-error, add-to-cart-error)
3. Loading states

**Low Priority** (nice to have):
1. Quantity/variant selectors
2. Cart summary breakdown
3. Optional form fields

## Verification

After adding selectors, verify they exist:

```bash
# Find all data-cy attributes
grep -r "data-cy" app/ components/ --include="*.tsx"

# Count them
grep -r "data-cy" app/ components/ --include="*.tsx" | wc -l
```

Expected: ~30-40 `data-cy` attributes across components

---

**Next Step:** Add selectors from "High Priority" list, then re-run tests:
```bash
npm run playwright -- playwright/e2e/checkout.spec.ts
```
