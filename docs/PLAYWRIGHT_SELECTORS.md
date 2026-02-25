# Playwright Test Selectors Setup Guide

## Current Status

Playwright tests are running with **42/45 passing**! Now we need to add `data-testid` attributes to components for full coverage.

**Convention:** Playwright uses `data-testid` (not `data-cy` which is Cypress-specific).

---

## ✅ Already Implemented

These components have proper selectors:

```
✅ Cart page (has data-cy, need to add data-testid):
  - [data-testid="empty-cart-page"]
  - [data-testid="cart-item"]
  - [data-testid="cart-title"]

✅ FamilyPlanBuilder:
  - [data-testid="add-to-cart-button"]
```

---

## ❌ Missing Selectors (Priority: Add Now)

### 1. **AddToCart Component** (Product Page)
**Location:** `components/AddToCart.tsx`

**Add these selectors:**
```tsx
// Main add to cart button
<button data-testid="add-to-cart-button" /* existing props */>
  Add to Cart
</button>

// Optional: Quantity selector
<input data-testid="product-quantity-input" type="number" min="1" />

// Optional: Size/variant selector
<select data-testid="product-variant-select">
  {/* options */}
</select>

// Optional: Success message
<div data-testid="add-to-cart-success">
  Added to cart!
</div>

// Optional: Error message
<div data-testid="add-to-cart-error">
  {error && <p>{error}</p>}
</div>
```

### 2. **Checkout Page / Components**
**Location:** `app/checkout/page.tsx` or `components/Checkout.tsx`

**Add these selectors:**
```tsx
// Shipping form fields
<input data-testid="shipping-email" placeholder="Email" />
<input data-testid="shipping-name" placeholder="Full Name" />
<input data-testid="shipping-address" placeholder="Address" />
<input data-testid="shipping-city" placeholder="City" />
<input data-testid="shipping-state" placeholder="State" />
<input data-testid="shipping-zip" placeholder="ZIP Code" />
<input data-testid="shipping-country" placeholder="Country" />

// Payment form
<div data-testid="payment-element">
  {/* Stripe PaymentElement */}
</div>

// Checkout buttons
<button data-testid="checkout-btn">
  Proceed to Checkout
</button>

<button data-testid="complete-purchase-btn">
  Complete Purchase
</button>

// Error & loading states
<div data-testid="payment-error">
  {error && <p>{error}</p>}
</div>

<div data-testid="checkout-loading">
  {isLoading && <p>Processing...</p>}
</div>
```

### 3. **Success Page**
**Location:** `app/checkout/success/page.tsx`

**Add these selectors:**
```tsx
// Order confirmation
<div data-testid="order-success">
  Order Confirmed!
</div>

<h1 data-testid="order-number">
  Order #{orderNumber}
</h1>

<p data-testid="order-total">
  Total: ${total}
</p>

<p data-testid="order-email">
  Confirmation sent to: {email}
</p>

<button data-testid="view-order-btn">
  View Order Details
</button>

<a data-testid="shopify-admin-link" href={shopifyAdminUrl}>
  Open in Shopify Admin
</a>

<a data-testid="continue-shopping-link" href="/">
  Continue Shopping
</a>
```

### 4. **Cart Page** (Add missing)
**Location:** `app/cart/page.tsx`

**Add these selectors:**
```tsx
// Cart items (may already have some)
<div data-testid="cart-item">
  {/* item */}
</div>

// Cart summary
<div data-testid="cart-summary">
  <p data-testid="cart-subtotal">Subtotal: $XX.XX</p>
  <p data-testid="cart-tax">Tax: $XX.XX</p>
  <p data-testid="cart-total">Total: $XX.XX</p>
</div>

// Checkout button
<button data-testid="checkout-btn">
  Proceed to Checkout
</button>

// Empty state
<div data-testid="empty-cart-page">
  Your cart is empty
</div>
```

---

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
  data-testid="add-to-cart-button"  // ← ADD THIS LINE
  onClick={handleAddToCart} 
  className={styles.button}
>
  Add to Cart
</button>
```

### With Conditional Rendering
```tsx
export function AddToCart({ product }: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <div data-testid="add-to-cart-container">
      <select data-testid="product-variant-select">
        {product.variants.map(v => (
          <option key={v.id} value={v.id}>{v.title}</option>
        ))}
      </select>

      <input 
        data-testid="product-quantity-input"
        type="number"
        min="1"
        defaultValue="1"
      />

      <button 
        data-testid="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {error && (
        <div data-testid="add-to-cart-error">{error}</div>
      )}
      {success && (
        <div data-testid="add-to-cart-success">✅ Added!</div>
      )}
    </div>
  );
}
```

---

## Key Differences: `data-testid` vs `data-cy`

| Aspect | `data-testid` | `data-cy` |
|--------|--|--|
| **Framework** | Framework-agnostic | Cypress-specific |
| **Playwright** | ✅ Native support | ✅ Works, but not recommended |
| **React Testing Library** | ✅ Native | ❌ Not used |
| **Industry Standard** | ✅ React, Playwright, etc. | Cypress only |
| **Best Practice** | ✅ Use for tests | Legacy |

**You can use both if running Cypress + Playwright together:**
```tsx
<button
  data-testid="add-to-cart-button"  // Playwright
  data-cy="add-to-cart-btn"         // Cypress (if using)
>
  Add to Cart
</button>
```

---

## Testing Workflow After Adding Selectors

1. **Add selectors to components** (follow examples above)
2. **Commit changes:**
   ```bash
   git add components/ app/
   git commit -m "test: add data-testid selectors for Playwright E2E tests"
   ```

3. **Run tests:**
   ```bash
   npm run playwright
   ```

4. **View results:**
   ```bash
   npm run playwright:report
   ```

---

## Priority Order

**🔴 High Priority** (enables 3 failing tests):
1. AddToCart component (`[data-testid="add-to-cart-button"]`)
2. Checkout page buttons (`[data-testid="complete-purchase-btn"]`)
3. Success page order number (`[data-testid="order-number"]`)

**🟡 Medium Priority** (improves robustness):
1. Checkout shipping fields (`[data-testid="shipping-*"]`)
2. Error handling (`[data-testid="payment-error"]`)
3. Cart items (`[data-testid="cart-item"]`)

**🟢 Low Priority** (nice to have):
1. Quantity/variant selectors
2. Loading states
3. Success page links

---

## Verification

After adding selectors, verify they exist:

```bash
# Find all data-testid attributes
grep -r "data-testid" app/ components/ --include="*.tsx"

# Count them
grep -r "data-testid" app/ components/ --include="*.tsx" | wc -l
```

Expected: ~25-35 `data-testid` attributes

---

## Expected Results After Adding Selectors

```
Before:  42/45 passing (3 checkout tests failing)
After:   45/45 passing ✅

Breakdown:
  Smoke:        9/9 ✅
  Webhook:     15/15 ✅
  Idempotency: 12/12 ✅
  Checkout:     9/9 ✅
```

---

**Next Step:** Add `data-testid` to the 3 priority components, then run tests:
```bash
npm run playwright
```

See this guide for exact locations and examples!
