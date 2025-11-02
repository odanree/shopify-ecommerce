# Family Plan Builder - Code Examples & Best Practices

## 📝 Table of Contents
- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Integration Patterns](#integration-patterns)
- [Styling Customization](#styling-customization)
- [Error Handling](#error-handling)
- [Analytics Integration](#analytics-integration)
- [Best Practices](#best-practices)

---

## 🎯 Basic Examples

### Next.js: Minimal Setup

```tsx
// app/family-plan/page.tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function FamilyPlanPage() {
  return <FamilyPlanBuilder />;
}
```

### Next.js: Custom Configuration

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function FamilyPlanPage() {
  return (
    <FamilyPlanBuilder
      config={{
        primaryLinePrice: 59,
        addonLinePrice: 29,
        addonSavings: 30,
        maxLines: 6,
        minLines: 2,
        primaryPlanName: "Premium Unlimited",
        addonPlanName: "Premium Add-on",
      }}
    />
  );
}
```

### Next.js: Hide Sections

```tsx
export default function FamilyPlanPage() {
  return (
    <FamilyPlanBuilder
      showHero={false}        // Hide hero section
      showSteps={false}       // Hide how it works
      showFeatures={true}     // Keep features
    />
  );
}
```

---

## 🚀 Advanced Examples

### Next.js: Full Shopify Integration

```tsx
'use client';

import { useState } from 'react';
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';
import { useCart } from '@shopify/hydrogen-react';

export default function FamilyPlanPage() {
  const { linesAdd } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (lines) => {
    setIsLoading(true);
    
    try {
      // Map lines to Shopify cart format
      const cartLines = lines.map((line, index) => ({
        merchandiseId: line.isPrimary 
          ? process.env.NEXT_PUBLIC_PRIMARY_VARIANT_ID!
          : process.env.NEXT_PUBLIC_ADDON_VARIANT_ID!,
        quantity: 1,
        attributes: [
          { key: 'Line Number', value: `${index + 1}` },
          { key: 'Line Type', value: line.isPrimary ? 'Primary' : 'Add-on' },
          { key: 'SIM Type', value: line.variant === 'esim' ? 'eSIM' : 'Physical SIM' },
        ],
      }));

      // Add to Shopify cart
      await linesAdd(cartLines);

      // Track analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: calculateTotal(lines),
          items: cartLines,
        });
      }

      // Redirect to cart
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (lines) => {
    return 49 + (lines.length - 1) * 24;
  };

  return (
    <div>
      {isLoading && <LoadingOverlay />}
      <FamilyPlanBuilder
        config={{
          primaryLinePrice: 49,
          addonLinePrice: 24,
          addonSavings: 25,
          maxLines: 5,
          minLines: 2,
          primaryProductId: process.env.NEXT_PUBLIC_PRIMARY_PRODUCT_ID,
          addonProductId: process.env.NEXT_PUBLIC_ADDON_PRODUCT_ID,
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-700">Adding to cart...</p>
    </div>
  </div>
);
```

### Next.js: With Custom Cart Hook

```tsx
// hooks/useShopifyCart.ts
import { useState } from 'react';

export function useShopifyCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (items: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading, error };
}

// Usage in page
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';
import { useShopifyCart } from '@/hooks/useShopifyCart';

export default function FamilyPlanPage() {
  const { addToCart, loading, error } = useShopifyCart();

  const handleAddToCart = async (lines) => {
    const items = lines.map((line, i) => ({
      variantId: line.isPrimary ? 'primary-id' : 'addon-id',
      quantity: 1,
      properties: {
        line: i + 1,
        type: line.variant,
      },
    }));

    await addToCart(items);
    window.location.href = '/cart';
  };

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <FamilyPlanBuilder onAddToCart={handleAddToCart} />
    </>
  );
}
```

### Shopify Liquid: Custom Template

```liquid
{% comment %}
  templates/page.family-plan.json
{% endcomment %}

{
  "sections": {
    "hero": {
      "type": "family-plan-builder",
      "settings": {
        "show_hero": true,
        "hero_title": "Build Your Perfect Family Plan",
        "hero_subtitle": "Save up to $100/month with our family discount",
        "hero_cta_text": "Get Started",
        "show_how_it_works": true,
        "steps_title": "How It Works",
        "step_1_title": "Choose Your Lines",
        "step_1_description": "Select the number of lines your family needs",
        "step_2_title": "Pick SIM Type",
        "step_2_description": "Choose between physical SIM or eSIM for each line",
        "step_3_title": "See Your Savings",
        "step_3_description": "Watch your total savings grow with each line",
        "step_4_title": "Add to Cart",
        "step_4_description": "Complete your purchase and activate your plan",
        "builder_title": "Configure Your Family Plan",
        "builder_description": "Customize each line to fit your needs",
        "primary_plan_name": "Unlimited Premium - Primary Line",
        "primary_line_price": 49,
        "primary_sim_variant_id": "12345678901234",
        "addon_plan_name": "Unlimited Premium - Add-on",
        "addon_line_price": 24,
        "addon_savings": 25,
        "addon_sim_variant_id": "12345678901235",
        "max_lines": 5,
        "show_features": true,
        "features_title": "What's Included",
        "features_subtitle": "Every line gets these amazing features"
      },
      "blocks": {
        "feature-1": {
          "type": "feature",
          "settings": {
            "feature_text": "Unlimited 5G • 4G LTE Data"
          }
        },
        "feature-2": {
          "type": "feature",
          "settings": {
            "feature_text": "Unlimited Talk & Text"
          }
        },
        "feature-3": {
          "type": "feature",
          "settings": {
            "feature_text": "10GB Mobile Hotspot"
          }
        },
        "feature-4": {
          "type": "feature",
          "settings": {
            "feature_text": "International Calling Credit"
          }
        }
      },
      "block_order": [
        "feature-1",
        "feature-2",
        "feature-3",
        "feature-4"
      ]
    }
  },
  "order": ["hero"]
}
```

---

## 🔌 Integration Patterns

### Pattern 1: API Route Handler (Next.js)

```typescript
// app/api/cart/add/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    // Validate items
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items' },
        { status: 400 }
      );
    }

    // Call Shopify Storefront API
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({
          query: `
            mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
              cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                  id
                  lines(first: 10) {
                    edges {
                      node {
                        id
                        quantity
                        merchandise {
                          ... on ProductVariant {
                            id
                            title
                          }
                        }
                      }
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            cartId: 'cart-id',
            lines: items,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json(data.data.cartLinesAdd.cart);
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
```

### Pattern 2: Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-token
NEXT_PUBLIC_PRIMARY_VARIANT_ID=gid://shopify/ProductVariant/123
NEXT_PUBLIC_ADDON_VARIANT_ID=gid://shopify/ProductVariant/456
NEXT_PUBLIC_PRIMARY_PRODUCT_ID=gid://shopify/Product/789
NEXT_PUBLIC_ADDON_PRODUCT_ID=gid://shopify/Product/012
```

### Pattern 3: Context Provider

```tsx
// context/FamilyPlanContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FamilyPlanContextType {
  selectedLines: any[];
  setSelectedLines: (lines: any[]) => void;
  totalPrice: number;
  totalSavings: number;
}

const FamilyPlanContext = createContext<FamilyPlanContextType | undefined>(undefined);

export function FamilyPlanProvider({ children }: { children: ReactNode }) {
  const [selectedLines, setSelectedLines] = useState<any[]>([]);

  const totalPrice = 49 + (selectedLines.length - 1) * 24;
  const totalSavings = (selectedLines.length - 1) * 25;

  return (
    <FamilyPlanContext.Provider
      value={{ selectedLines, setSelectedLines, totalPrice, totalSavings }}
    >
      {children}
    </FamilyPlanContext.Provider>
  );
}

export function useFamilyPlan() {
  const context = useContext(FamilyPlanContext);
  if (!context) {
    throw new Error('useFamilyPlan must be used within FamilyPlanProvider');
  }
  return context;
}
```

---

## 🎨 Styling Customization

### Tailwind: Custom Theme Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Your main brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

### CSS: Override Liquid Styles

```css
/* assets/custom-family-plan.css */

/* Change primary color */
:root {
  --family-plan-primary: #0ea5e9;
  --family-plan-primary-hover: #0284c7;
  --family-plan-success: #10b981;
}

.family-plan-hero {
  background: linear-gradient(135deg, var(--family-plan-primary), #7c3aed) !important;
}

.family-plan-summary__cta {
  background: var(--family-plan-primary) !important;
}

.family-plan-summary__cta:hover {
  background: var(--family-plan-primary-hover) !important;
}

/* Custom animations */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.family-plan-line {
  animation: slide-up 0.3s ease-out;
}
```

---

## 🛡️ Error Handling

### Comprehensive Error Handler

```typescript
class FamilyPlanError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'FamilyPlanError';
  }
}

async function handleAddToCart(lines: any[]) {
  try {
    // Validation
    if (lines.length < 2) {
      throw new FamilyPlanError(
        'Please add at least 2 lines',
        'MIN_LINES_NOT_MET',
        false
      );
    }

    if (lines.length > 5) {
      throw new FamilyPlanError(
        'Maximum 5 lines allowed',
        'MAX_LINES_EXCEEDED',
        false
      );
    }

    // API call
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new FamilyPlanError(
          'Too many requests. Please wait a moment.',
          'RATE_LIMITED',
          true
        );
      }
      throw new FamilyPlanError(
        'Failed to add to cart',
        'CART_ADD_FAILED',
        true
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FamilyPlanError) {
      // Show user-friendly message
      showErrorToast(error.message);
      
      // Log for debugging
      console.error(`[${error.code}]`, error.message);
      
      // Track in analytics
      trackError(error.code, error.message);
      
      // Retry if applicable
      if (error.retryable) {
        return retryWithBackoff(() => handleAddToCart(lines));
      }
    } else {
      // Unknown error
      console.error('Unexpected error:', error);
      showErrorToast('Something went wrong. Please try again.');
    }
    
    throw error;
  }
}

// Retry with exponential backoff
async function retryWithBackoff(
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}
```

---

## 📊 Analytics Integration

### Google Analytics 4

```typescript
// utils/analytics.ts
export const trackFamilyPlanEvent = (
  action: string,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: 'Family Plan',
    ...params,
  });
};

// Usage in component
import { trackFamilyPlanEvent } from '@/utils/analytics';

// Track line added
const addLine = () => {
  // ... add line logic
  trackFamilyPlanEvent('line_added', {
    line_number: lines.length + 1,
    total_lines: lines.length + 1,
  });
};

// Track variant changed
const updateVariant = (lineId: number, variant: string) => {
  // ... update logic
  trackFamilyPlanEvent('variant_changed', {
    line_id: lineId,
    variant: variant,
  });
};

// Track add to cart
const handleAddToCart = async (lines: any[]) => {
  const subtotal = calculateSubtotal(lines);
  const savings = calculateSavings(lines);
  
  trackFamilyPlanEvent('add_to_cart', {
    value: subtotal,
    currency: 'USD',
    items: lines.length,
    savings: savings,
  });
  
  // ... cart logic
};
```

### Facebook Pixel

```typescript
// utils/facebook-pixel.ts
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      data?: Record<string, any>
    ) => void;
  }
}

export const trackFacebookEvent = (
  event: string,
  data?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', event, data);
};

// Usage
trackFacebookEvent('AddToCart', {
  content_type: 'product',
  content_ids: ['family-plan'],
  value: subtotal,
  currency: 'USD',
  num_items: lines.length,
});
```

---

## ✅ Best Practices

### 1. Performance Optimization

```tsx
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const { subtotal, savings } = useMemo(() => {
  const addonCount = Math.max(0, lines.length - 1);
  return {
    subtotal: config.primaryLinePrice + addonCount * config.addonLinePrice,
    savings: addonCount * config.addonSavings,
  };
}, [lines.length, config]);

// Memoize callbacks
const handleAddLine = useCallback(() => {
  setLines(prev => [...prev, newLine]);
}, []);
```

### 2. Accessibility

```tsx
// Proper ARIA labels
<button
  onClick={() => removeLine(line.id)}
  aria-label={`Remove line ${line.id}`}
  className="..."
>
  <X aria-hidden="true" />
</button>

// Keyboard navigation
<div
  role="radiogroup"
  aria-labelledby="sim-type-label"
>
  <label id="sim-type-label">Select SIM Type</label>
  <input type="radio" name="sim-type" ... />
</div>

// Screen reader announcements
const [announcement, setAnnouncement] = useState('');

<div role="status" aria-live="polite" className="sr-only">
  {announcement}
</div>

// When line is added
setAnnouncement(`Line ${newLineNumber} added to your plan`);
```

### 3. Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

<button
  onClick={handleAddToCart}
  disabled={isLoading || !canAddToCart}
  className="..."
>
  {isLoading ? (
    <>
      <Spinner />
      Adding to Cart...
    </>
  ) : (
    <>
      <ShoppingCart />
      Add to Cart
    </>
  )}
</button>
```

### 4. Input Validation

```typescript
const validateLines = (lines: any[]): string | null => {
  if (lines.length < config.minLines) {
    return `Please add at least ${config.minLines} lines`;
  }
  
  if (lines.length > config.maxLines) {
    return `Maximum ${config.maxLines} lines allowed`;
  }
  
  // Check for duplicate IDs
  const ids = lines.map(l => l.id);
  if (new Set(ids).size !== ids.length) {
    return 'Duplicate line IDs detected';
  }
  
  // Check all lines have variants
  if (lines.some(l => !l.variant)) {
    return 'Please select a SIM type for all lines';
  }
  
  return null;
};
```

### 5. SEO Optimization

```tsx
// app/family-plan/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family Plan Builder | Save Up to $125/Month',
  description: 'Build your perfect family plan with unlimited data, talk, and text. Add up to 5 lines and save $25 per line.',
  openGraph: {
    title: 'Family Plan Builder',
    description: 'Save big with our family plan - up to 5 lines from $24/mo',
    images: ['/og-family-plan.jpg'],
  },
};

// Add structured data
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Family Plan - Unlimited',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '24',
      highPrice: '49',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FamilyPlanBuilder />
    </>
  );
}
```

---

## 🎯 Summary

These examples cover:
- ✅ Basic to advanced implementation
- ✅ Multiple integration patterns
- ✅ Complete error handling
- ✅ Analytics tracking
- ✅ Performance optimization
- ✅ Accessibility best practices
- ✅ SEO optimization

Pick the patterns that fit your needs and customize as required!

---

**Ready to implement?** Start with the basic examples and gradually add advanced features as needed.
