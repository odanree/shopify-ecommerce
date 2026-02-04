# Shopify Headless Commerce with Next.js

A modern headless ecommerce storefront built with Next.js 14, TypeScript, CSS Modules, and Shopify Storefront API—featuring AI-powered product recommendations via integrated chatbot.

**🎯 [Live Demo](https://shopify-headless-lemon.vercel.app/)** — Visit the production site

## Features

- ⚡ **Next.js 14 App Router** - Latest React features with Server Components
- 🎨 **CSS Modules** - Component-scoped styling
- 📱 **Fully Responsive** - Mobile-first design
- 🛍️ **Shopify Storefront API** - Direct integration with Shopify
- 🔍 **TypeScript** - Type-safe development
- 🖼️ **Optimized Images** - Next.js Image component with CDN
- ⚡ **Fast Performance** - 99.9% CLS reduction (0.028 score), 0ms Total Blocking Time
- 🎯 **SEO Optimized** - Meta tags and structured data
- 🤖 **AI Chatbot** - GPT-4 powered product search & recommendations (see [CHATBOT.md](./docs/CHATBOT.md))

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

4. Edit `.env.local` and add your Shopify credentials:
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
SHOPIFY_ADMIN_API_TOKEN=your_admin_api_token_here
SHOPIFY_LOCATION_ID=your_location_id_here
```

> **Note:** `SHOPIFY_ADMIN_API_TOKEN` and `SHOPIFY_LOCATION_ID` are only needed if you want to use the product management scripts.

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

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage
│   ├── products/          # Products pages
│   │   ├── page.tsx       # All products listing
│   │   └── [handle]/      # Individual product page
│   ├── cart/              # Shopping cart
│   └── api/               # API routes
├── components/             # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── AddToCart.tsx
│   └── FamilyPlanBuilder.tsx  # Premium feature demo
├── lib/                    # Utility functions
│   └── shopify.ts         # Shopify API client
├── types/                  # TypeScript type definitions
│   └── shopify.ts
├── public/                 # Static assets
├── contexts/               # React Context for state management
│   └── CartContext.tsx    # Shopping cart state
├── cypress/                # E2E tests
│   └── e2e/               # Test files
├── docs/                   # Documentation
│   ├── CHATBOT.md         # AI chatbot architecture & integration
│   └── ...
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── cypress.config.ts      # Cypress configuration
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

### Fetching Products

```typescript
import { getProducts } from '@/lib/shopify';

const products = await getProducts();
```

### Fetching Single Product

```typescript
import { getProduct } from '@/lib/shopify';

const product = await getProduct('product-handle');
```

### Cart Operations

```typescript
import { createCart, addToCart } from '@/lib/shopify';

// Create a new cart
const cart = await createCart();

// Add item to cart
const updatedCart = await addToCart(cart.id, variantId, quantity);
```

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

📖 **See [VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md) for complete step-by-step instructions**

**Quick Overview:**
1. Push your code to GitHub (already done ✅)
2. Import project in [Vercel](https://vercel.com/new)
3. Root directory is already set to repo root (no subdirectory needed!)
4. Add environment variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
5. Deploy!

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

- [🤖 AI Chatbot Documentation](./docs/CHATBOT.md) - Architecture, integration, and customization
- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Cypress Documentation](https://docs.cypress.io)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Vercel Deployment Guide](./docs/VERCEL_DEPLOYMENT.md)

## Support

For issues or questions:
- Check [Shopify Dev Forums](https://community.shopify.com/c/shopify-apis-and-sdks/bd-p/shopify-apis-and-technology)
- Review [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this for your projects!
Wed Feb  4 11:44:51 PST 2026
