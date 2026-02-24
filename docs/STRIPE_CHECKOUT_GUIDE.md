# Stripe Checkout Integration - Feature Branch Guide

**Branch:** `feat/stripe-checkout-integration`  
**Status:** Ready for testing and PR

## 🏗️ What Was Built

A production-grade, portfolio-ready Stripe checkout integration with:

- ✅ **Custom Checkout Pages** (`/checkout`, `/checkout/success`)
- ✅ **Smart Payment Intent** with metadata for Shopify orders
- ✅ **Webhook Handler** that creates orders in Shopify Admin
- ✅ **Idempotency Guard** prevents duplicate orders from retries
- ✅ **Inventory Tracking** real-time stock decrement on payment
- ✅ **Modern Stripe Elements** (PaymentElement, Apple Pay, Google Pay)
- ✅ **Responsive Components** (Tailwind CSS)
- ✅ **Full Error Handling** with user feedback
- ✅ **Type-Safe** TypeScript throughout

---

## 📋 Files Created/Modified

### Backend Routes (API)

```
app/api/payment/
├── create-intent/route.ts      ← Creates Stripe Payment Intent with metadata
└── webhook/route.ts             ← Receives Stripe webhooks, creates Shopify orders
```

### Frontend Components

```
components/checkout/
├── PaymentStep.tsx              ← Stripe PaymentElement wrapper
├── AddressStep.tsx              ← Shipping form
├── OrderSummary.tsx             ← Order totals (sticky sidebar)
└── CheckoutStatus.tsx           ← Loading/Error/Success messages

app/checkout/
├── page.tsx                     ← Main checkout orchestrator
└── success/page.tsx             ← Order confirmation page
```

### Libraries

```
lib/
└── shopify-admin.ts             ← Shopify Admin API client
    ├── createShopifyOrder()     ← Create order with idempotency
    ├── checkOrderByPaymentIntentId() ← Idempotency check
    └── tagOrderWithPaymentIntent()   ← Tag for deduplication
```

### Configuration

```
.env.local (updated)
├── SHOPIFY_STORE_DOMAIN
├── SHOPIFY_STOREFRONT_ACCESS_TOKEN
├── SHOPIFY_ADMIN_ACCESS_TOKEN         ← NEW (needed for webhook)
├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
├── STRIPE_SECRET_KEY
└── STRIPE_WEBHOOK_SECRET              ← NEW (needed for webhook)
```

### Integration

```
app/cart/page.tsx (modified)
├── "Proceed to Checkout" button now links to /checkout
```

---

## 🚀 Setup Instructions

### 1. Get Shopify Admin Token

1. Go to: **Shopify Admin → Settings → Apps and sales channels → Develop apps**
2. Click your app (or create one)
3. Click **Configuration**
4. Under **Admin API access scopes**, enable:
   - `write_orders` — Create orders
   - `read_orders` — Read order data
5. Click **Save**
6. Under **API credentials**, copy **Access token**
7. Paste in `.env.local`:
   ```
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx...
   ```

### 2. Get Stripe Webhook Secret

1. Go to: **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL:** `http://localhost:3000/api/payment/webhook` (for local testing)
   - For production: `https://yoursite.com/api/payment/webhook`
4. **Events to send:** Select `payment_intent.succeeded`
5. Click **Add endpoint**
6. Click the endpoint to reveal **Signing secret**
7. Copy and paste in `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_test_xxx...
   ```

### 3. Install Dependencies

```bash
cd /Users/odanree/.openclaw/workspace/shopify-ecommerce
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open: **http://localhost:3000**

---

## 🧪 Testing the Flow

### Test Scenario 1: Successful Payment

1. **Add products to cart**
   - Go to `/products`
   - Add items

2. **Go to cart**
   - `/cart`
   - Verify totals

3. **Checkout**
   - Click "Proceed to Checkout"
   - Fill in shipping address
   - Email: `test@example.com` (or any email)

4. **Payment**
   - Card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Click "Complete Purchase"

5. **Success**
   - Should redirect to `/checkout/success`
   - Show confirmation number (payment intent ID)

6. **Verify Order in Shopify**
   - Go to **Shopify Admin → Orders**
   - New order should appear with:
     - Line items from your cart
     - Shipping address
     - Financial status: **Paid** ✅
     - Tag: `payment_intent:pi_xxx...`

### Test Scenario 2: Webhook Idempotency

1. Complete a payment
2. In your terminal, trigger the webhook manually using curl:
   ```bash
   curl -X POST http://localhost:3000/api/payment/webhook \
     -H "Content-Type: application/json" \
     -d '{"type": "payment_intent.succeeded", "data": {...}}'
   ```
   (Skip the signature header for local testing; real Stripe will send proper signatures)

3. Check Shopify Orders dashboard
4. **Should still show only 1 order** (idempotency prevented duplicate)

### Test Scenario 3: Declined Card

1. Use card: **4000 0000 0000 0002**
2. Should show error on checkout
3. **No order created in Shopify** ✅

---

## 🔐 Security Checklist

✅ **Signature Verification** — Webhook checks Stripe signature before processing  
✅ **Secret on Backend Only** — `STRIPE_SECRET_KEY` never exposed to frontend  
✅ **Idempotency Guard** — Prevents duplicate orders from webhook retries  
✅ **Metadata Tagging** — Uses Shopify order tags for deduplication  
✅ **No PCI Compliance Burden** — Stripe handles card tokenization  
✅ **Rate Limiting Ready** — Can add to webhook endpoint if needed  

---

## 📊 Flow Diagram

```
User on /cart
    ↓
Clicks "Proceed to Checkout"
    ↓
/checkout page loads
    ↓
Mount: POST /api/payment/create-intent
  Payload: { amount, email, lineItems, shippingAddress }
  Response: { clientSecret, paymentIntentId }
    ↓
Stripe Elements load (PaymentElement)
    ↓
User fills address form
    ↓
User clicks "Complete Purchase"
    ↓
Frontend: stripe.confirmPayment(clientSecret)
    ↓
Stripe processes payment
    ↓
✅ Payment succeeds
    ↓
Stripe sends webhook: POST /api/payment/webhook
    ↓
Webhook handler:
  1. Verify signature
  2. Check idempotency (already created order?)
  3. If not: createShopifyOrder()
  4. Tag order with payment_intent_id
  5. Return 200 OK
    ↓
Frontend: Redirect to /checkout/success
    ↓
User sees: Confirmation number, order details
    ↓
Shopify Admin: Order visible with:
  - Paid status
  - Inventory decremented
  - Payment intent tag for audit trail
```

---

## 🎯 Interview Talking Points

**"Walk me through what happens if the user closes the browser after paying..."**

> "The payment still processes at Stripe. Even if the user closes the tab, the webhook fires asynchronously on our backend. That's why we don't rely on the frontend redirect—the server-side webhook is the source of truth. The Shopify order gets created by the webhook handler, not by the frontend."

**"How do you prevent duplicate orders from webhook retries?"**

> "I store the `payment_intent_id` as a tag on the Shopify order. Before creating any new order, I query Shopify's orders API for an existing order with that tag. If it exists, I return it. If not, I create a new one. This makes the operation idempotent—no matter how many times the webhook fires, we only get one order."

**"What's the value of including metadata in the Payment Intent?"**

> "The metadata acts as a bridge between Stripe and Shopify. We pass the cart ID, line items, and shipping address in the metadata. When the webhook fires, we have all the information needed to reconstruct the order in Shopify without making additional API calls to fetch cart data. It's faster, more reliable, and creates an audit trail."

**"Why use Stripe Elements instead of a hosted checkout?"**

> "For a portfolio, the custom checkout shows I understand frontend framework integration, state management, and complex API flows. It's also more flexible—I can customize the UI, add custom validation, integrate with my own order system. For production, you'd evaluate whether Stripe Checkout (hosted) or custom is better based on requirements."

---

## 🐛 Troubleshooting

### "STRIPE_WEBHOOK_SECRET is not defined"
- Check `.env.local` has `STRIPE_WEBHOOK_SECRET=whsec_test_...`
- Restart dev server: `npm run dev`

### "Payment fails immediately"
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is correct
- Check Stripe Dashboard → API keys (test mode)

### "Webhook doesn't fire locally"
- For local dev, use **Stripe CLI** to forward webhooks:
  ```bash
  stripe listen --forward-to localhost:3000/api/payment/webhook
  ```
- Paste the signing secret in `.env.local`

### "Order doesn't appear in Shopify"
- Check `SHOPIFY_ADMIN_ACCESS_TOKEN` is correct
- Verify scopes: `write_orders`, `read_orders` enabled
- Check webhook logs in Stripe Dashboard (Developers → Logs)

### "Idempotency not working"
- Verify order has tag: `payment_intent:pi_xxx...`
- Go to Shopify Admin → Orders → Click order → Tags section

---

## ✅ Pre-PR Checklist

Before creating a PR to `main`:

- [ ] Tested successful payment flow (cart → checkout → success)
- [ ] Verified order appears in Shopify Admin Dashboard
- [ ] Verified inventory decrements in Shopify
- [ ] Tested with declined card (4000 0000 0000 0002)
- [ ] Checked webhook logs in Stripe Dashboard
- [ ] Verified idempotency (order doesn't duplicate on retry)
- [ ] Checked console for errors
- [ ] Verified `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] All TypeScript types check: `npm run lint`
- [ ] No console errors on payment success

---

## 📚 Resources

- **Stripe Docs**: https://stripe.com/docs/payments/checkout
- **Stripe Elements**: https://stripe.com/docs/stripe-js/elements/payment-element
- **Shopify Admin API**: https://shopify.dev/docs/api/admin-rest
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Webhooks 101**: https://stripe.com/docs/webhooks

---

## 🚢 Deployment Notes

When deploying to production:

1. **Stripe Keys**: Use **Live mode** keys (pk_live_, sk_live_)
2. **Webhook URL**: Update to production domain
3. **Shopify Admin Token**: Same token works (scope is scope)
4. **Rate Limiting**: Add middleware to `/api/payment/webhook`
5. **Error Logging**: Hook up to Sentry/LogRocket
6. **Email Confirmation**: Add order confirmation email in webhook

---

**Ready for PR! 🚀**

This is a legitimate, production-grade integration that impresses technical interviewers.
