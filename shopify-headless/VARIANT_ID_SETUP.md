# Shopify Variant ID Setup Guide

## Your Current Variant ID
- **Unlimited Plan**: `44300835815469`
- URL: https://odanree.myshopify.com/products/unlimited-plan?variant=44300835815469

## How to Find More Variant IDs

### Method 1: Product URL
1. Go to your product page on Shopify
2. If the product has variants, select different options
3. Look at the URL - it will show `?variant=XXXXX`
4. Copy that number

### Method 2: Shopify Admin
1. Go to **Products** in Shopify Admin
2. Click on a product
3. Scroll to **Variants** section
4. Click on a variant to see its ID in the URL
5. Example: `admin.shopify.com/store/odanree/products/XXXXX/variants/44300835815469`

### Method 3: GraphQL API
```graphql
query {
  product(id: "gid://shopify/Product/YOUR_PRODUCT_ID") {
    variants(first: 10) {
      edges {
        node {
          id
          title
          sku
          price
        }
      }
    }
  }
}
```

## Where to Update Variant IDs

### Next.js Headless Version
Update in **2 places**:

#### 1. Component Default Config
File: `shopify-headless/components/FamilyPlanBuilder.tsx` (lines 28-39)
```typescript
const defaultConfig: FamilyPlanConfig = {
  primarySimVariantId: '44300835815469',      // ← Update this
  primaryEsimVariantId: '44300835815469',     // ← Update this
  addonSimVariantId: '44300835815469',        // ← Update this
  addonEsimVariantId: '44300835815469',       // ← Update this
};
```

#### 2. Page Component Config
File: `shopify-headless/app/family-plan/page.tsx` (lines 76-83)
```typescript
<FamilyPlanBuilder
  config={{
    primarySimVariantId: '44300835815469',    // ← Update this
    primaryEsimVariantId: '44300835815469',   // ← Update this
    addonSimVariantId: '44300835815469',      // ← Update this
    addonEsimVariantId: '44300835815469',     // ← Update this
  }}
/>
```

### Shopify Liquid Theme Version
File: `shopify-theme/sections/family-plan-builder.liquid`

1. Go to Shopify Admin → Online Store → Themes
2. Click **Customize** on your theme
3. Find the **Family Plan Builder** section
4. In the section settings, you'll see fields for:
   - Line 1 variant ID
   - Line 2 variant ID
   - Line 3 variant ID
   - Line 4 variant ID
   - Line 5 variant ID

## Product Structure Recommendations

### Option A: Single Product with Variants (Simpler)
Create one product "Unlimited Plan" with variants:
- Primary Line - Physical SIM ($49)
- Primary Line - eSIM ($49)
- Add-on Line - Physical SIM ($24)
- Add-on Line - eSIM ($24)

**Example Variant IDs:**
```typescript
primarySimVariantId: '44300835815469'
primaryEsimVariantId: '44300835815470'
addonSimVariantId: '44300835815471'
addonEsimVariantId: '44300835815472'
```

### Option B: Separate Products (More Control)
Create separate products:
- "Unlimited Plan - Primary Line" (2 variants: SIM/eSIM)
- "Unlimited Plan - Add-on Line" (2 variants: SIM/eSIM)

## Testing the Setup

### 1. Check Console Logs
When you click "Add to Cart", check the browser console:
```javascript
🛒 Add to Cart clicked!
📦 Lines to add: [...]
🔑 Cart items with variant IDs: [...]
✅ Successfully added to cart
📊 Variant IDs used: [...]
```

### 2. Verify Variant IDs
Make sure each line has a `variantId` property:
```javascript
{
  id: 1,
  variant: 'sim',
  isPrimary: true,
  variantId: '44300835815469'  // ← Should be present
}
```

### 3. Test Different Scenarios
- Add multiple lines
- Switch between SIM and eSIM
- Check that each line gets the correct variant ID

## Current Status ✅

**Updated Files:**
- ✅ `FamilyPlanBuilder.tsx` - Added variant ID support
- ✅ `page.tsx` - Configured with your variant ID
- ✅ Console logs show variant IDs when adding to cart

**Next Steps:**
1. **Get additional variant IDs** for eSIM and add-on lines
2. **Update the config** in both files above
3. **Test** by checking console logs
4. **Integrate** with actual Shopify Storefront API (replace TODO in page.tsx)

## Shopify Storefront API Integration (Future)

Once you have all variant IDs, you can integrate with real cart API:

```typescript
// app/api/cart/add/route.ts
export async function POST(request: Request) {
  const { items } = await request.json();
  
  const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate($cartInput: CartInput) {
          cartCreate(input: $cartInput) {
            cart {
              id
              checkoutUrl
            }
          }
        }
      `,
      variables: {
        cartInput: {
          lines: items
        }
      }
    })
  });
  
  return Response.json(await response.json());
}
```

## Need Help?

**To get more variant IDs:**
1. Create the products/variants in Shopify Admin
2. Use Method 1 or 2 above to find the IDs
3. Update the config files
4. Test in the browser console

**Current variant ID:** `44300835815469` is set as default for all 4 variants. Update them once you have the actual IDs!
