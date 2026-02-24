# Stripe Sandbox Setup Guide

## Overview

This guide walks you through integrating Stripe sandbox payments into your headless Shopify ecommerce site.

## Prerequisites

- Node.js 18+
- npm or yarn
- A Stripe account (free at https://stripe.com)
- Your Shopify development store credentials

## Step 1: Get Stripe API Keys

1. **Create/Login to Stripe Account**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Sign up if you don't have an account (free)

2. **Switch to Test Mode**
   - Top right corner: Toggle to **Test mode** (if not already in test mode)
   - You should see "Test mode" displayed

3. **Get Your API Keys**
   - Navigate to: **Developers** → **API keys**
   - You'll see two keys:
     - **Publishable Key** (starts with `pk_test_`)
     - **Secret Key** (starts with `sk_test_`)
   - Copy both keys (you'll need them in Step 2)

## Step 2: Configure Environment Variables

1. **Update `.env.local`** in the project root:

```bash
# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-dev-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-api-access-token

# Stripe Configuration (Test Mode - paste your keys from Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

**⚠️ Important:**
- `.env.local` is **NEVER** committed to Git (it's in `.gitignore`)
- Keep your `STRIPE_SECRET_KEY` private — never share or expose it
- The `NEXT_PUBLIC_` prefix means the publishable key is safe to expose in the browser

## Step 3: Install Dependencies

```bash
npm install
```

This will install:
- `stripe` - Backend payment processing
- `@stripe/react-stripe-js` - React components
- `@stripe/stripe-js` - Stripe client library

## Step 4: Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   - App runs at `http://localhost:3000`

2. **Add items to cart:**
   - Browse products
   - Add items to your cart
   - Navigate to `/cart`

3. **Proceed to checkout:**
   - Click "Proceed to Checkout"
   - You should be taken to `/checkout`
   - The Stripe payment form should load

## Step 5: Make a Test Payment

### Test Card Numbers

Stripe provides test card numbers for different scenarios:

| Card Number | Description | CVV | Exp Date |
|---|---|---|---|
| `4242 4242 4242 4242` | Visa (Success) | Any 3 digits | Any future date |
| `4000 0000 0000 0002` | Visa (Decline) | Any 3 digits | Any future date |
| `5555 5555 5555 4444` | Mastercard (Success) | Any 3 digits | Any future date |

### To Process a Payment:

1. **Fill in the checkout form:**
   - Email: Any email (e.g., `test@example.com`)
   - Card Number: `4242 4242 4242 4242`
   - Expiration: Any future month/year
   - CVC: Any 3 digits

2. **Click "Pay"**
   - Payment processes in test mode (no real charge)
   - On success, you'll be redirected to `/checkout/success`

3. **Verify in Stripe Dashboard:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - **Payments** → You should see your test payment
   - Status: `Succeeded`

## Step 6: Monitor Payments

### In Your App:

```bash
# Check API logs
npm run dev
# Look for console output when payments are processed
```

### In Stripe Dashboard:

1. Navigate to **Payments**
2. Click on a payment to see details:
   - Payment Intent ID
   - Amount
   - Status
   - Billing details
   - Charge ID

## Project Structure

Files added/modified for Stripe integration:

```
app/
  ├── api/payment/
  │   ├── create-intent/route.ts       (Backend: Creates payment intent)
  │   └── confirm/route.ts              (Backend: Confirms payment status)
  ├── checkout/
  │   ├── page.tsx                      (Checkout form page)
  │   ├── CheckoutPage.module.css       (Checkout styling)
  │   └── success/
  │       ├── page.tsx                  (Success confirmation page)
  │       └── SuccessPage.module.css    (Success styling)
  └── cart/
      └── page.tsx                      (Updated: Button now links to checkout)

components/
  ├── CheckoutForm.tsx                  (Stripe form component)
  └── CheckoutForm.module.css           (Form styling)

.env.local                              (Environment variables - not committed)
```

## How It Works

### Flow Diagram

```
1. User adds items to cart
   ↓
2. Clicks "Proceed to Checkout" → /checkout
   ↓
3. Fills out checkout form (email + card)
   ↓
4. Frontend calls POST /api/payment/create-intent
   ↓
5. Backend (Stripe SDK) creates Payment Intent
   ↓
6. Frontend receives clientSecret
   ↓
7. Frontend confirms payment with Stripe using clientSecret
   ↓
8. If successful → Redirect to /checkout/success
   ↓
9. Cart is cleared
```

### Backend Endpoints

#### `POST /api/payment/create-intent`

Creates a Stripe Payment Intent on your backend.

**Request:**
```json
{
  "amount": 5000,  // Amount in cents (e.g., $50.00)
  "currency": "usd",
  "description": "Order for user@example.com",
  "metadata": { "email": "user@example.com" }
}
```

**Response:**
```json
{
  "clientSecret": "pi_1234_secret_5678",
  "paymentIntentId": "pi_1234"
}
```

#### `GET /api/payment/confirm`

Retrieves payment status.

**Query Parameter:**
```
/api/payment/confirm?payment_intent=pi_1234
```

**Response:**
```json
{
  "status": "succeeded",
  "amount": 5000,
  "currency": "usd",
  "charges": [...]
}
```

## Security Best Practices

### ✅ What We Did Right

1. **Secret Key on Backend Only**
   - `STRIPE_SECRET_KEY` only used in `/api/payment/` routes
   - Never exposed to frontend

2. **Publishable Key in Frontend**
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` safe to expose
   - Used for client-side token creation

3. **Environment Variables**
   - Keys stored in `.env.local`
   - Never committed to Git

4. **Payment Intent on Backend**
   - Server creates Payment Intent
   - Frontend only receives client secret
   - Card never touches your server

### ⚠️ Production Checklist

Before going live:

- [ ] Switch Stripe to **Live mode**
- [ ] Replace test keys with **live keys** (pk_live_ and sk_live_)
- [ ] Implement webhook handling (optional, for confirmations)
- [ ] Add rate limiting to payment endpoints
- [ ] Implement CORS if frontend is on different domain
- [ ] Enable HTTPS in production (Stripe requires it)
- [ ] Add logging for payment events
- [ ] Set up payment confirmation emails
- [ ] Test with real cards (use very small amounts)

## Troubleshooting

### "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set"

**Solution:** Check `.env.local` — make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly

```bash
# Verify it's set
echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### "Stripe not loaded" Error

**Solution:** Wait for Stripe to load. The CheckoutForm component loads Stripe asynchronously.

### Payment fails with "Card declined"

**Solution:** Check that you're using test cards. Test cards in test mode won't work with Stripe live API.

### "Missing environment variables"

**Solution:** Run `npm run dev` and check that `.env.local` exists with all required keys.

## Next Steps

### Optional Enhancements

1. **Webhook Handling** (for production)
   ```typescript
   // POST /api/webhooks/stripe
   // Listen for events like charge.succeeded, charge.failed
   ```

2. **Order Storage**
   ```typescript
   // Save orders to database after payment
   // Link to Shopify orders via API
   ```

3. **Confirmation Emails**
   ```typescript
   // Send order confirmation emails via SendGrid, Resend, etc.
   ```

4. **Subscription Support**
   ```typescript
   // If you add recurring billing
   // Use Stripe Billing API
   ```

## Useful Links

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe API Documentation](https://stripe.com/docs)
- [Stripe Test Card Numbers](https://stripe.com/docs/testing)
- [Stripe React Components](https://stripe.com/docs/stripe-js/react)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

If you encounter issues:

1. Check Stripe Dashboard logs (Developers → Logs)
2. Check Next.js console for error messages
3. Verify `.env.local` is correct
4. Try test card `4242 4242 4242 4242`

---

**You're all set!** 🎉 Your headless Shopify store now accepts payments via Stripe.
