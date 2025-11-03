# Shopify Admin Scripts

This directory contains scripts for managing products in your Shopify store via the Admin API and Storefront API.

## 📋 Available Scripts

### 1. **create-collections.ts** - Create Collections 🆕
Creates themed collections and assigns products to them automatically.

**Collections Created:**
- **All Products** (11 products) - Complete catalog
- **Frontend Frameworks** (5 products) - Next.js, React, TypeScript, Hydrogen
- **Backend & APIs** (3 products) - Shopify, GraphQL, Headless Commerce
- **Development Tools** (3 products) - VS Code, Cypress, CSS Modules
- **Headless Commerce** (6 products) - Modern commerce stack

**What it does:**
- Creates 5 themed collections with descriptions and hero images
- Assigns products to collections using smart rules
- Publishes collections to "headless storefront" sales channel
- Uses Unsplash images for collection headers
- Rate-limited to avoid API throttling

**Usage:**
```bash
npx tsx scripts/create-collections.ts
```

**Output:**
- Collections visible at `/collections` on your storefront
- Each collection has SEO-friendly descriptions
- Professional hero images from Unsplash

**Note:** Safe to run multiple times, but will create duplicate collections if they already exist. Check Shopify Admin first.

---

### 2. **add-product-images.ts** - Add Product Images
Adds placeholder images to all products using the Shopify Admin API.

**What it does:**
- Adds 2 images per product (front and back views)
- Uses placeholder images with product-specific colors
- Updates existing products without duplicating
- Rate-limited to avoid API throttling

**Usage:**
```bash
npx tsx scripts/add-product-images.ts
```

**Note:** Currently uses placeholder.com images. For production:
1. Replace URLs in the script with actual image URLs
2. Or upload images via Shopify Admin UI
3. Or use a CDN (Cloudinary, Imgix)

---

### 4. **test-collections-data.ts** - Debug Collections Data 🆕
Tests the collections data returned by `getCollections()` to debug product count issues.

**What it does:**
- Fetches all collections from Storefront API
- Displays detailed information about each collection
- Shows productsCount vs products array length
- Helps debug why collection cards show incorrect counts

**Usage:**
```bash
npx tsx scripts/test-collections-data.ts
```

**Output:**
- Collection title, handle, and ID
- Products count from API
- Products array length (if populated)
- Helps identify data mapping issues

**Note:** Use this when collection product counts appear incorrect on the frontend.

---

### 5. **create-products.ts** - Mass Product Creator
Creates 10 tech-themed t-shirt products (customized to the tech stack used in this repo).

**What it creates:**
- 10 unique t-shirt products
- 42 variants per product (6 colors × 7 sizes)
- 100 units inventory per variant
- HTML-formatted descriptions
- Prices: $24.99 - $32.99
- Tags: tech, developer, programmer, geek, coding, apparel

**Tech stack themes:**
- Next.js Developer, React Developer, TypeScript Master
- Shopify Developer, Headless Commerce, Hydrogen React
- Cypress E2E, CSS Modules, VS Code Developer, GraphQL Expert

**Usage:**
```bash
npx tsx scripts/create-products.ts
```

---

### 3. **publish-to-channel.ts** - Publish Products to Sales Channel
Publishes all products to the "headless storefront" sales channel so they appear in the Storefront API.

**Usage:**
```bash
npx tsx scripts/publish-to-channel.ts
```

**Important:** Products must be published to the "headless storefront" channel to be visible in your Next.js app.

---

### 4. **verify-products.ts** - Verify Storefront API Access
Checks if products are accessible via the Storefront API (what your Next.js app uses).

**Usage:**
```bash
npx tsx scripts/verify-products.ts
```

**Shows:**
- Total products found
- Product details (title, handle, availability, price)
- Variant information
- Inventory levels

---

### 5. **test-storefront-api.ts** - Diagnostic Tool
Comprehensive test of Storefront API access with multiple query types.

**Usage:**
```bash
npx tsx scripts/test-storefront-api.ts
```

**Tests:**
- Shop information query
- Collections query
- Products query with detailed fields

---

### 6. **delete-products.ts** - Bulk Product Deletion
Deletes all products from your store (use with caution!).

**Usage:**
```bash
npx tsx scripts/delete-products.ts
```

⚠️ **Warning:** This permanently deletes all products. Use only for development/testing.

---

## 🔧 Setup

### Prerequisites

1. **Shopify Admin API Access Token**
   - Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
   - Create a new app or use existing
   - Configure Admin API scopes: `write_products`, `read_products`, `write_inventory`, `read_inventory`
   - Install the app and copy the Admin API access token

2. **Shopify Storefront API Access Token**
   - Same app as above
   - Configure Storefront API scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`
   - Copy the Storefront API access token

3. **Environment Variables**
   Add to `.env.local` in the `shopify-headless` directory:
   ```env
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxx
   SHOPIFY_LOCATION_ID=your_location_id
   ```

4. **Install tsx** (if not already installed)
   ```bash
   npm install -D tsx
   ```

---

## 📝 Typical Workflow

1. **Create products:**
   ```bash
   npx tsx scripts/create-products.ts
   ```

2. **Publish to headless storefront:**
   ```bash
   npx tsx scripts/publish-to-channel.ts
   ```
   
   Or manually in Shopify Admin:
   - Products → Select all → Bulk Actions → Make available → "headless storefront"

3. **Add product images:**
   ```bash
   npx tsx scripts/add-product-images.ts
   ```
   
   Or manually in Shopify Admin:
   - Products → Select product → Media → Add from URL or upload

4. **Verify they're visible:**
   ```bash
   npx tsx scripts/verify-products.ts
   ```

5. **Check your live site:**
   - Local: http://localhost:3000/products
   - Production: https://your-site.vercel.app/products

---

## 🐛 Troubleshooting

### Products not showing in Storefront API?
1. Check if published to "headless storefront" channel (not just "Online Store")
2. Run `npx tsx scripts/test-storefront-api.ts` to diagnose
3. Verify Storefront API token has correct scopes

### Inventory not tracking?
1. Ensure `SHOPIFY_LOCATION_ID` is set in `.env.local`
2. Products must have `inventory_management: 'shopify'` set
3. Run create-products script which handles this automatically

### Products not on Vercel?
1. Products must be published to "headless storefront" channel
2. Wait 60 seconds for cache revalidation
3. Check Vercel environment variables are set correctly

---

## 📚 Additional Resources

- [Shopify Admin API Docs](https://shopify.dev/docs/api/admin)
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Product Management](https://shopify.dev/docs/api/admin-rest/latest/resources/product)
- Cloud & DevOps (AWS, Docker, Kubernetes)
- Data & AI (Machine Learning, Neural Networks)
- And many more!

### Colors Available
- Black
- White
- Navy
- Gray
- Red
- Blue

### Sizes Available
XS, S, M, L, XL, 2XL, 3XL

### Rate Limiting

The script respects Shopify's API rate limits:
- Creates products in batches of 2
- 1 second delay between batches
- Total execution time: ~2-3 minutes

### Troubleshooting

**Error: Missing environment variables**
- Make sure `.env.local` has both required variables
- Restart your terminal/IDE after adding variables

**Error: 401 Unauthorized**
- Check your Admin API token is correct
- Ensure the app has `write_products` scope

**Error: 429 Too Many Requests**
- The script already handles rate limiting
- If you still see this, you may have other API requests running

**Error: Invalid product data**
- Check your Shopify plan supports the number of variants
- Some plans limit variants per product

### Customization

Edit `create-products.ts` to customize:
- `techDesigns` array - Add your own design phrases
- `colors` array - Change available colors
- `sizes` array - Modify size options
- `getPrice()` - Adjust pricing logic
- `generateDescription()` - Change product descriptions

### Next Steps

After creating products:
1. Add product images in Shopify Admin
2. Organize products into collections
3. Set up product metafields if needed
4. Configure shipping weights
5. Update SEO titles and descriptions
6. Test checkout flow

### CSV Alternative

If you prefer CSV import:
1. Create a CSV with columns: Handle, Title, Body, Vendor, Type, Tags, Option1 Name, Option1 Value, Option2 Name, Option2 Value, Variant Price, Variant Inventory Qty
2. Import via Shopify Admin → Products → Import

### GraphQL Alternative

For more control, use GraphQL Admin API:
```graphql
mutation {
  productCreate(input: {
    title: "Your Product"
    productType: "T-Shirts"
    vendor: "Your Vendor"
  }) {
    product {
      id
      title
    }
  }
}
```
