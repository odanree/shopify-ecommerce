# 🛍️ Shopify Headless Commerce with Next.js

A high-performance headless ecommerce storefront built with **Next.js 14**, **TypeScript**, and **Shopify Storefront API**. This project features a **custom, production-grade Stripe payment engine** with a webhook-driven architecture for real-time Shopify Admin order synchronization.

🎯 **[Live Demo](https://shopify-headless-lemon.vercel.app/)** — _Experience the custom checkout flow._

---

## 🏗️ Technical Architecture: The Stripe-to-Shopify Bridge

The core of this project is a bespoke checkout system that maintains **100% brand control** while ensuring data consistency between two distinct third-party ecosystems.

### 1. Intent Orchestration & PCI Compliance

- **Elements-First Flow:** Implements Stripe's latest `PaymentElement` standards, supporting Apple Pay, Google Pay, and link-based payments.
- **Metadata Injection:** Upon `/api/payment/create-intent`, the backend injects Shopify `variant_ids` and cart snapshots into the Stripe metadata to preserve state through the payment lifecycle.

### 2. Resilience & "Ghost Order" Prevention

- **Webhook-Driven Logic:** Orders are *not* created on the frontend redirect. Instead, a Next.js API Route (`/api/payment/webhook`) listens for `payment_intent.succeeded`.
- **Signature Verification:** Employs `stripe.webhooks.constructEvent` to verify cryptographic signatures, ensuring only authentic Stripe events can trigger Shopify order creation.
- **Asynchronous Reliability:** The architecture handles "Ghost Orders"—situations where a user pays but closes their browser before the redirect—ensuring the Shopify Admin is always updated.

### 3. Shopify Admin Sync

- **Variant ID Translation:** Maps Storefront GIDs to Admin-specific numeric IDs to handle inventory decrements.
- **Race-Condition Handling:** The success page uses a polling mechanism to fetch the order number from a temporary cache, providing a seamless UX while the webhook processes in the background.
- **Idempotency:** Utilizes Payment Intent ID tagging to prevent duplicate orders during webhook retries.

---

## 🏗️ Robust Checkout Architecture

Unlike basic Shopify integrations, this project implements a **Resilient Webhook Handshake** that gracefully handles asynchronous operations and network delays:

### 1. **Frontend Payment Capture**
- User fills Shipping Address → Payment Intent created with customer data in metadata
- Stripe Elements collect payment details (no card numbers on our server)
- User clicks "Complete Purchase" → Stripe PaymentElement validates and submits

### 2. **Webhook Verification & Signature Check**
- Stripe pings `/api/payment/webhook` with signed event
- We verify cryptographic signature using `stripe.webhooks.constructEvent()`
- Only authenticated Stripe events can trigger order creation (prevents spoofing)

### 3. **Async Background Processing**
- Webhook handler returns `200 OK` to Stripe **immediately** (~50ms)
- Shopify order creation happens asynchronously in background
- This prevents Stripe's 30-second timeout during slow Admin API calls (which can take 1–3 seconds)
- Payment is confirmed to customer, order is guaranteed to eventually appear in Shopify

### 4. **Idempotency & Duplicate Prevention**
- Each Shopify order is tagged with the Payment Intent ID: `Stripe-Payment, pi_xxxxx`
- Webhook checks for existing orders before creating new ones
- If webhook is retried by Stripe, we return the existing order (no duplicates)

### 5. **Resilient Success Page Polling**
- Success page can't display order number until cache is populated
- Webhook processes asynchronously, so data arrives ~500ms–2s after payment
- Instead of showing "Processing..." forever, page polls `/api/payment/order-number` up to 10 times with 2-second intervals
- Once order is found, displays order number and provides direct link to Shopify Admin

### 6. **Shopify Admin Link for Portfolio Proof**
- Success page includes button: "Open Order in Shopify Admin ↗"
- Direct link to `admin.shopify.com/store/{store}/orders/{shopifyOrderId}`
- Recruiter/client can instantly verify the order exists in Shopify with correct customer data

### The Complete Webhook Sequence

```
┌─────────┐              ┌────────┐              ┌──────────┐              ┌────────┐
│  User   │              │ Stripe │              │ Your API │              │ Shopify│
└────┬────┘              └───┬────┘              └────┬─────┘              └───┬────┘
     │                       │                       │                         │
     │ 1. Fill Address       │                       │                         │
     ├──────────────────────>│                       │                         │
     │                       │                       │                         │
     │ 2. Click "Pay"        │                       │                         │
     ├──────────────────────>│ Create Intent         │                         │
     │                       │ (with metadata)       │                         │
     │                       ├──────────────────────>│                         │
     │                       │<─── Intent Created ───┤                         │
     │                       │                       │                         │
     │ 3. Verify Signature   │                       │                         │
     │ (Elements.submit())   │                       │                         │
     ├──────────────────────>│ Confirm Payment       │                         │
     │                       ├──────────────────────>│                         │
     │ (Waiting)             │                       │                         │
     │                       │ ✅ Payment Success   │                         │
     │                       │                       │                         │
     │                       │ POST /webhook (signed)│                         │
     │                       ├──────────────────────>│                         │
     │                       │<────── 200 OK ────────┤ (return immediately)    │
     │                       │                       │                         │
     │ 4. Redirect           │                   [async background]            │
     │ to Success            │                       ├──────Create Order─────>│
     │ (polling starts)      │                       │                         │
     │                       │                       │<─── Order Created ──────┤
     │                       │                       │ (1-3 seconds)           │
     │ 5. Poll for order     │                       │                         │
     ├──────────────────────────────> GET /order-number                        │
     │                       │                       ├─── return order # ─────>│
     │                       │                       │                         │
     │ "Order #1014 ✓"       │                       │                         │
     │ [Click: View Admin]   │                       │                         │
     ├─────────────────────────────────────────────────────────────────────────>│
     │                       │                       │                         │
     └───────────────────────────────────────────────────────────────────────────┘
     
KEY FEATURES OF THIS FLOW:
• Phase A: Stripe Elements captures payment with cart metadata
• Phase B: 200 OK returned to Stripe immediately (prevents timeout/retries)
• Phase C: Async order creation happens in background
• Phase D: Frontend polling bridges the gap between payment success and Shopify confirmation
• Phase E: Direct Shopify Admin link proves order exists (portfolio demo gold!)
```

---

## ✨ Key Features


- ⚡ **Next.js 14 App Router:** Utilizing Server Components for lightning-fast catalog browsing.
- 🔄 **Inventory Management:** Real-time stock decrements in Shopify Admin upon verified payment.
- 🤖 **AI Chatbot:** GPT-4 powered product search & recommendations (see [docs/CHATBOT.md](./docs/CHATBOT.md)).
- 🎨 **CSS Modules:** 100% component-scoped styling for zero CSS bloat.
- 🔒 **Type Safety:** End-to-end TypeScript definitions for Shopify and Stripe payloads.
- 🛒 **Cart Persistence:** LocalStorage-backed cart with hydration safety and automatic cleanup on order success.
- 📱 **Fully Responsive:** Professional UI optimized for all screen sizes.

---

## 🚀 Stripe Checkout Implementation

### 🔌 Webhook Setup (Local Development)

Webhooks allow orders to be created in Shopify Admin even if the user closes their browser after paying.

1. **Install & Login:**
   ```bash
   stripe login
   ```

2. **Listen for events:**
   ```bash
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```

3. **Configure `.env.local`:**
   Use the `whsec_` secret provided by the CLI.

### 🧪 Integration Sequence (Observed Logs)

```
✅ Payment Intent created: pi_3T4Fy...
📧 Webhook event received: payment_intent.succeeded
📦 Line item mapping: variantId=44303963652141, quantity=2
✅ Order created: #1010 (ID: 6137892339757) in Shopify Admin
📦 Cached order #1010 for frontend polling
```

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/payment/        # The "Bridge": create-intent, webhook, order-number
│   ├── checkout/           # Custom Multi-step checkout UI
│   └── success/            # Order confirmation with polling logic
├── components/
│   └── checkout/           # Stripe Element wrappers & Address forms
├── lib/
│   ├── shopify.ts          # Storefront API (Catalog)
│   └── shopify-admin.ts    # Admin API (Order Creation)
├── contexts/
│   └── CartContext.tsx     # Cart logic + persistence
└── docs/                   # Detailed feature documentation
```

---

## 🔧 Deployment

### Vercel (Recommended)

This project is optimized for Vercel. Ensure the following Environment Variables are configured:

| Variable | Source |
|----------|--------|
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify App Settings |
| `SHOPIFY_ADMIN_API_TOKEN` | Shopify Custom App (write_orders) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Webhooks |

---

## 📝 Lessons Learned

### 🎯 Idempotency & Data Mismatch
**Problem:** Stripe's metadata is flat (all keys at same level), but Shopify's REST API expects deeply nested objects. Order tags required comma-separated strings, not arrays.

**Solution:** Implemented strict data mapping layer that transforms Stripe's flat structure into Shopify's required format. Used Payment Intent IDs as idempotency keys to prevent duplicates during webhook retries.

**Impact:** Orders create reliably across mismatched API schemas without data loss or duplication.

---

### 🎯 User Experience Lifecycle  
**Problem:** Clearing the cart immediately on "Complete Purchase" button click meant failed or declined payments would lose the user's cart. If they closed the browser mid-checkout, their cart disappeared forever.

**Solution:** Moved `clearCart()` to the Success Page, triggered only after the order is confirmed (order cache is populated). This preserves progress through payment retries and browser restarts.

**Impact:** Users can safely retry payments without losing their items; failed transactions don't result in lost carts.

---

### 🎯 Handling API Latency
**Problem:** Shopify's Admin API can take 1–3 seconds to respond. The Success Page needs the order number immediately, but the webhook processes asynchronously. Without polling, users see a broken "Processing order..." state indefinitely.

**Solution:** Implemented recursive polling on the frontend (10 attempts, 2-second intervals). Success page waits for the order cache to populate instead of assuming instant completion.

**Impact:** Seamless UX even with slow backend APIs; users see their order number appear within 2–5 seconds rather than hanging indefinitely.

---

### 🎯 Serverless Webhook Constraints
**Problem:** In serverless environments (Next.js on Vercel), if the webhook handler takes too long, the request is killed before Shopify order creation completes. Stripe also has a 30-second timeout before it retries.

**Solution:** Return `200 OK` to Stripe immediately (~50ms), then process Shopify order creation asynchronously in the background via a fire-and-forget pattern. Idempotency check prevents duplicates on retry.

**Impact:** Webhooks complete within Stripe's timeout window while guaranteeing order creation in Shopify, even with slow Admin API responses.

---

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Run Local Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

**Built with ❤️ for modern ecommerce. Production-ready. Portfolio-worthy.**
