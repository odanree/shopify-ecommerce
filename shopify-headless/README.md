# Shopify Headless Commerce with Next.js

A modern headless ecommerce storefront built with Next.js 14, TypeScript, TailwindCSS, and Shopify Storefront API.

## Features

- ⚡ **Next.js 14 App Router** - Latest React features with Server Components
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 📱 **Fully Responsive** - Mobile-first design
- 🛍️ **Shopify Storefront API** - Direct integration with Shopify
- 🔍 **TypeScript** - Type-safe development
- 🖼️ **Optimized Images** - Next.js Image component with CDN
- ⚡ **Fast Performance** - Static generation and caching
- 🎯 **SEO Optimized** - Meta tags and structured data

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
cd shopify-headless
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
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## Project Structure

```
shopify-headless/
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
│   └── AddToCart.tsx
├── lib/                    # Utility functions
│   └── shopify.ts         # Shopify API client
├── types/                  # TypeScript type definitions
│   └── shopify.ts
├── public/                 # Static assets
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

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

This project uses TailwindCSS. Customize colors and design in:
- `tailwind.config.js` - Theme configuration
- `app/globals.css` - Global styles

### Adding Features

1. **Search** - Implement product search using Shopify Search API
2. **Collections** - Add collection pages
3. **Customer Accounts** - Integrate customer login/register
4. **Checkout** - Customize checkout experience
5. **Wishlist** - Add product wishlist functionality

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

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

- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues or questions:
- Check [Shopify Dev Forums](https://community.shopify.com/c/shopify-apis-and-sdks/bd-p/shopify-apis-and-technology)
- Review [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - feel free to use this for your projects!
