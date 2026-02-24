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

- **Data Formatting:** The Shopify REST API requires tags as comma-separated strings, while GraphQL prefers arrays—managing this mismatch was key to successful order tagging.
- **Lifecycle Awareness:** Clearing the cart on the Success Page (instead of the Checkout button) ensures a "failed payment" doesn't result in a lost cart for the user.
- **Webhook Performance:** Returning 200 OK immediately to Stripe and processing order creation asynchronously prevents timeouts during slow Admin API calls.
- **Test Reliability:** Explicit timeouts (10s+) on E2E tests account for Shopify API latency in CI environments.

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
