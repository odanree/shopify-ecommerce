# Shopify Headless Commerce with Next.js

A modern headless ecommerce storefront built with Next.js 14, TypeScript, CSS Modules, and Shopify Storefront API—featuring **production-grade Stripe payment processing with webhook-driven Shopify Admin order creation**.

**🎯 [Live Demo](https://shopify-headless-lemon.vercel.app/)** — Visit the production site

## ✨ Key Features

### 💳 Production-Grade Payment Processing
- **Stripe PaymentElement** - Modern payment form supporting cards, Apple Pay, Google Pay, and ACH transfers
- **Elements-First Flow** - Implements Stripe's latest API standards with client-side form validation
- **Webhook-Driven Orders** - Orders created server-side via Stripe webhook to prevent ghost orders
- **Idempotency** - Payment intent tagging prevents duplicate orders from webhook retries
- **Non-Blocking Tagging** - Graceful degradation if order tagging fails

### 🔄 Shopify Admin API Integration
- **Direct Order Creation** - Orders created in Shopify Admin via REST API with full line items, customer data, and inventory decrement
- **Inventory Management** - Real-time inventory updates when orders are processed
- **Secure Webhooks** - Signature verification using Stripe webhook secrets
- **GraphQL to REST Conversion** - Seamless variant ID translation between APIs

### 🏗️ Architecture & Performance
- ⚡ **Next.js 14 App Router** - Latest React features with Server Components
- 🎨 **CSS Modules** - Component-scoped styling (no Tailwind bloat)
- 📱 **Fully Responsive** - Mobile-first design with professional UI
- 🛍️ **Shopify Storefront API** - Direct integration with Shopify product catalog
- 🔍 **TypeScript** - Full type safety throughout
- 🖼️ **Optimized Images** - Next.js Image component with CDN
- ⚡ **Fast Performance** - Lighthouse scores: 99.9% CLS, 0ms Total Blocking Time
- 🎯 **SEO Optimized** - Meta tags and structured data

### 🤖 Enhanced Features
- **AI Chatbot** - GPT-4 powered product search & recommendations (see [docs/CHATBOT.md](./docs/CHATBOT.md))
- **Cart Persistence** - LocalStorage-backed cart with hydration safety
- **Responsive Checkout** - Professional multi-step checkout with address collection and order summary

## Prerequisites

- Node.js 18+ installed
- A Shopify store (development or production)
- Shopify Storefront API access token

## Getting Started

### 1. Shopify Setup

First, you need to create a Storefront API access token in your Shopify admin:

1. Go to your Shopify Admin
2. Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app** (or use an existing one)
4. Go to **API credentials** tab
5. Under **Storefront API**, click **Configure**
6. Enable the following permissions:
   - Read products
   - Read product listings
   - Read customer tags
   - Read inventory
7. Click **Save**
8. Go back to **API credentials** and copy the **Storefront API access token**

### 2. Environment Setup

1. Clone or navigate to this project directory:
```bash
git clone https://github.com/odanree/shopify-ecommerce.git
cd shopify-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your Shopify + Stripe credentials:
```env
# Shopify Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here

# Shopify Admin API (required for order creation)
SHOPIFY_ADMIN_API_TOKEN=your_admin_api_token_here
SHOPIFY_LOCATION_ID=your_location_id_here

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

> **Note:** 
> - `SHOPIFY_ADMIN_API_TOKEN` and `SHOPIFY_LOCATION_ID` are required for webhook-driven order creation
> - `STRIPE_WEBHOOK_SECRET` is obtained from `stripe listen` (see Stripe Webhook Setup below)
> - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is safe to expose (client-side); secret keys are server-only

### 3. Create Demo Products (Optional)

If your store is empty, you can create demo products using our automated scripts:

```bash
# Create 10 tech-themed t-shirt products
npx tsx scripts/create-products.ts

# Publish them to the headless storefront channel
npx tsx scripts/publish-to-channel.ts

# Verify they're visible
npx tsx scripts/verify-products.ts
```

Or manually create products in your Shopify Admin and make sure to publish them to the **"headless storefront"** sales channel.

See [scripts/README.md](./scripts/README.md) for more details.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## 💳 Stripe Payment Integration

This storefront includes a **production-ready Stripe checkout** with webhook-driven Shopify Admin order creation.

### Setup Stripe Account

1. Create a [Stripe account](https://stripe.com) (test or live mode)
2. Go to **Developers** → **API Keys** and copy:
   - **Publishable key** (starts with `pk_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_`) → `STRIPE_SECRET_KEY`

### Configure Stripe Webhooks (Local Development)

Webhooks allow orders to be created in Shopify Admin even if the user closes their browser after paying.

**Install Stripe CLI:**
```bash
# macOS with Homebrew
brew install stripe/stripe-cli/stripe

# Or download from https://stripe.com/docs/stripe-cli
```

**Listen for webhook events:**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/payment/webhook
```

This will output your **webhook signing secret** (starts with `whsec_`):
```
Ready! Your webhook signing secret is whsec_test_xxxxx
```

Copy this to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### How Payment Flow Works

1. **User adds items to cart** → Clicks "Proceed to Checkout"
2. **Checkout page** → Creates Stripe PaymentIntent via `/api/payment/create-intent`
3. **Payment form** → User enters payment details (PaymentElement)
4. **Submit payment** → Calls `stripe.confirmPayment()` with Elements-First validation
5. **Stripe processes** → Sends `payment_intent.succeeded` webhook
6. **Webhook handler** (`/api/payment/webhook`):
   - ✓ Verifies signature with `STRIPE_WEBHOOK_SECRET`
   - ✓ Creates order in Shopify Admin with line items, customer, address
   - ✓ Tags order with payment intent ID (for duplicate prevention)
   - ✓ Decrements inventory in Shopify
7. **Success page** → Fetches order number and displays confirmation

**Key features:**
- 🔒 **Server-side verification** - Stripe secret key never exposed
- 🔄 **Idempotent** - Payment intent ID tagging prevents duplicate orders from webhook retries
- 📦 **Full inventory sync** - Orders decrement stock in real-time
- 🛡️ **Ghost order prevention** - Orders created via webhook, not after page redirect

For detailed setup guide, see [docs/STRIPE_CHECKOUT_GUIDE.md](./docs/STRIPE_CHECKOUT_GUIDE.md).

## 🛒 Shopping Cart

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage with hero carousel
│   ├── products/          # Products pages
│   │   ├── page.tsx       # All products listing
│   │   └── [handle]/      # Individual product page
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Multi-step checkout
│   │   ├── page.tsx       # Main checkout form
│   │   └── success/       # Order confirmation page
│   └── api/               # API routes
│       └── payment/       # Stripe payment endpoints
│           ├── create-intent.ts   # Create PaymentIntent
│           ├── webhook.ts         # Stripe webhook receiver
│           └── order-number.ts    # Fetch order number
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── AddToCart.tsx
│   ├── HeroCarousel.tsx
│   ├── checkout/         # Checkout-specific components
│   │   ├── PaymentStep.tsx
│   │   ├── AddressStep.tsx
│   │   ├── OrderSummary.tsx
│   │   └── CheckoutStatus.tsx
│   └── FamilyPlanBuilder.tsx
├── lib/                   # Utility functions
│   ├── shopify.ts        # Shopify Storefront API client
│   └── shopify-admin.ts  # Shopify Admin API client
├── types/                 # TypeScript definitions
│   └── shopify.ts
├── contexts/              # React Context
│   └── CartContext.tsx   # Cart state + localStorage persistence
├── public/                # Static assets
├── cypress/               # E2E tests
│   └── e2e/
├── docs/                  # Documentation
│   ├── CHATBOT.md
│   ├── STRIPE_CHECKOUT_GUIDE.md
│   └── STRIPE_SETUP.md
├── next.config.js         # Next.js config (image optimization)
├── tsconfig.json
├── cypress.config.ts
└── package.json
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Testing
- `npm run cypress` - Open Cypress test runner
- `npm run test:e2e` - Run E2E tests (requires dev server running)
- `npm run test:e2e:ci` - Run E2E tests in CI mode

### Product Management
- `npx tsx scripts/create-products.ts` - Create 10 tech-themed t-shirt products
- `npx tsx scripts/publish-to-channel.ts` - Publish products to headless storefront
- `npx tsx scripts/verify-products.ts` - Verify products are visible in Storefront API
- `npx tsx scripts/delete-products.ts` - Delete all products (use with caution!)

See [scripts/README.md](./scripts/README.md) for detailed script documentation.

## Shopify API Integration

### Storefront API - Fetching Products

```typescript
import { getProducts } from '@/lib/shopify';

const products = await getProducts();
const product = await getProduct('product-handle');
```

### Admin API - Webhook Order Creation

When a Stripe payment succeeds, the webhook handler automatically creates orders in Shopify:

```typescript
// From /api/payment/webhook
const shopifyAdminClient = new ShopifyAdminClient(
  process.env.SHOPIFY_ADMIN_API_TOKEN,
  process.env.SHOPIFY_STORE_DOMAIN
);

// Create order with line items, customer info, and inventory decrement
const order = await shopifyAdminClient.createOrder({
  lineItems: cartItems,
  address: checkoutAddress,
  email: customerEmail,
  inventoryBehavior: 'decrement_ignoring_policy',
  tags: [`payment_intent_${paymentIntentId}`],
});
```

**Key webhook features:**
- 🔐 **Signature verification** - Only processes authentic Stripe events
- ✅ **Idempotent** - Duplicate webhook calls don't create duplicate orders
- 📦 **Inventory sync** - Stock is decremented in real-time
- 🏷️ **Order tagging** - Payment intent ID stored as tag for tracking
- 🔄 **Non-blocking** - Order creation succeeds even if tagging fails

See [docs/STRIPE_CHECKOUT_GUIDE.md](./docs/STRIPE_CHECKOUT_GUIDE.md) for detailed webhook architecture.

## Cart Persistence

Cart state is managed via `CartContext` with localStorage persistence:

## Customization

### Styling

This project uses CSS Modules for component-scoped styling:
- `components/*.module.css` - Component-specific styles
- `app/globals.css` - Global styles and CSS variables
- Create new `.module.css` files for new components

### Adding Features

1. **Search** - Implement product search using Shopify Search API
2. **Collections** - Add collection pages
3. **Customer Accounts** - Integrate customer login/register
4. **Checkout** - Customize checkout experience
5. **Wishlist** - Add product wishlist functionality

## Deployment

### Vercel (Recommended) - Auto Deploy Enabled ✅

This project is configured for automatic deployment to Vercel with GitHub integration.

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/odanree/shopify-ecommerce&env=SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN&envDescription=Shopify%20API%20credentials%20required&project-name=shopify-headless-store)

**Manual Setup with Auto-Deploy:**

📖 **See [docs/VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for complete step-by-step instructions**

**Quick Overview:**
1. Push your code to GitHub (already done ✅)
2. Import project in [Vercel](https://vercel.com/new)
3. Root directory is already set to repo root (no subdirectory needed!)
4. Add environment variables:
   - **Shopify**: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - **Shopify Admin**: `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_LOCATION_ID`
   - **Stripe**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
5. Deploy!

**Setting up Stripe webhooks in production:**
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/payment/webhook`
4. Select events: `payment_intent.succeeded`
5. Copy the **signing secret** to `STRIPE_WEBHOOK_SECRET` in Vercel

**Auto-Deploy Features:**
- ✅ Every push to `main` branch deploys to production
- ✅ Pull requests get automatic preview deployments
- ✅ Instant rollback to previous versions
- ✅ Built-in CI/CD pipeline

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting

Make sure to set environment variables on your hosting platform.

## Performance Optimization

- **Image Optimization**: Uses Next.js Image component
- **Caching**: API responses cached for 60 seconds
- **Static Generation**: Product pages pre-rendered at build time
- **Code Splitting**: Automatic code splitting with App Router

## TypeScript

The project is fully typed with TypeScript. Main types are in `types/shopify.ts`:
- `ShopifyProduct` - Product data structure
- `ShopifyVariant` - Product variant
- `ShopifyCart` - Cart data structure
- `ShopifyCartLine` - Cart line item

## Troubleshooting

### "Cannot connect to Shopify API"
- Verify your `.env.local` file has correct credentials
- Check your Storefront API token is valid
- Ensure your store domain is correct (include `.myshopify.com`)

### Images not loading
- Verify `next.config.js` has Shopify CDN in `remotePatterns`
- Check products have featured images in Shopify admin

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (18+ required)

## Resources

- 🎯 **Stripe Checkout Integration**:
  - [docs/STRIPE_CHECKOUT_GUIDE.md](./docs/STRIPE_CHECKOUT_GUIDE.md) - Complete implementation guide
  - [docs/STRIPE_SETUP.md](./docs/STRIPE_SETUP.md) - Setup and testing
  - [Stripe PaymentElement Docs](https://stripe.com/docs/elements/payment-element)
  - [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)

- 🤖 [AI Chatbot Documentation](./docs/CHATBOT.md) - Architecture, integration, and customization

- 📚 **Framework & API Docs**:
  - [Next.js Documentation](https://nextjs.org/docs)
  - [Shopify Storefront API](https://shopify.dev/api/storefront)
  - [Shopify Admin API](https://shopify.dev/api/admin-rest)
  - [TypeScript Documentation](https://www.typescriptlang.org/docs)
  - [Cypress Documentation](https://docs.cypress.io)
  - [CSS Modules Documentation](https://github.com/css-modules/css-modules)
  - [Framer Motion Docs](https://www.framer.com/motion)

- 🚀 [Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md)

## Support

For issues or questions:
- Check [Shopify Dev Forums](https://community.shopify.com/c/shopify-apis-and-sdks/bd-p/shopify-apis-and-technology)
- Review [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this for your projects!
Wed Feb  4 11:44:51 PST 2026
