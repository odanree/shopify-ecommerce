# Family Plan Builder - Documentation

A comprehensive family plan builder for multi-line mobile plans, available in both Shopify Liquid and Next.js/React versions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Shopify Theme (Liquid)](#shopify-theme-liquid)
  - [Next.js Headless](#nextjs-headless)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Customization](#customization)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

---

## 🎯 Overview

The Family Plan Builder is a fully-featured, interactive component that allows customers to:

- Build custom family plans with multiple lines
- Choose between physical SIM cards or eSIM for each line
- See real-time pricing calculations
- View total savings compared to individual plans
- Add the complete plan to cart in one click

### Design Principles

This component features:
- Progressive disclosure of pricing
- Clear value proposition with savings display
- Flexible per-line configuration
- Professional UI/UX with smooth interactions

---

## ✨ Features

### Core Features

- ✅ **Dynamic Line Management** - Add/remove lines up to configurable maximum
- ✅ **Dual Variant Support** - SIM Card or eSIM options per line
- ✅ **Real-time Calculations** - Instant subtotal and savings updates
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Accessibility** - WCAG compliant with keyboard navigation
- ✅ **Validation** - Enforces minimum line requirements
- ✅ **Customizable** - Extensive configuration options
- ✅ **Production Ready** - Error handling and loading states

### UI Components

1. **Hero Section** - Eye-catching introduction with CTA
2. **How It Works** - Step-by-step guide (4 steps)
3. **Interactive Builder** - Main plan configuration interface
4. **Features List** - Comprehensive feature showcase
5. **Summary Panel** - Price breakdown and cart action

---

## 🚀 Installation

### Shopify Theme (Liquid)

#### Step 1: Copy Files

Copy these files to your theme:

```
shopify-theme/
├── sections/
│   └── family-plan-builder.liquid
└── assets/
    └── family-plan-builder.css
```

#### Step 2: Include CSS

Add to your `theme.liquid` in the `<head>` section:

```liquid
{{ 'family-plan-builder.css' | asset_url | stylesheet_tag }}
```

#### Step 3: Add Section to Page

In the Shopify theme editor:

1. Go to **Online Store > Themes > Customize**
2. Navigate to the page where you want the builder
3. Click **Add section**
4. Select **Family Plan Builder**
5. Configure settings in the sidebar

#### Step 4: Configure Products

Create your products in Shopify:

1. **Primary Line Product** (e.g., "Unlimited Plan - Primary Line")
   - Create variants for SIM and eSIM
   - Note the variant IDs

2. **Add-on Line Product** (e.g., "Unlimited Plan - Add-on Line")
   - Create variants for SIM and eSIM
   - Note the variant IDs

3. In the section settings, enter these variant IDs

---

### Next.js Headless

#### Step 1: Install Dependencies

```bash
cd shopify-headless
npm install lucide-react
```

Or with yarn:

```bash
yarn add lucide-react
```

#### Step 2: Copy Component

The component file is already created at:
```
shopify-headless/components/FamilyPlanBuilder.tsx
```

#### Step 3: Use in Your App

Import and use the component:

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function FamilyPlanPage() {
  return (
    <FamilyPlanBuilder
      config={{
        primaryLinePrice: 49,
        addonLinePrice: 24,
        addonSavings: 25,
        maxLines: 5,
        minLines: 2,
      }}
      onAddToCart={handleAddToCart}
    />
  );
}
```

A complete example page is available at:
```
shopify-headless/app/family-plan/page.tsx
```

---

## ⚙️ Configuration

### Shopify Liquid Settings

Access these in the Shopify theme editor:

#### Hero Section
- `show_hero` - Show/hide hero section
- `hero_title` - Main headline
- `hero_subtitle` - Subheadline text
- `hero_cta_text` - Call-to-action button text

#### How It Works
- `show_how_it_works` - Show/hide steps section
- `steps_title` - Section title
- `step_[1-4]_title` - Individual step titles
- `step_[1-4]_description` - Individual step descriptions

#### Builder Configuration
- `builder_title` - Builder section title
- `builder_description` - Builder description text
- `primary_plan_name` - Name of primary plan
- `primary_line_price` - Monthly price for primary line
- `primary_sim_variant_id` - Shopify variant ID for primary SIM
- `addon_plan_name` - Name of add-on plan
- `addon_line_price` - Monthly price for add-on lines
- `addon_savings` - Savings amount per add-on line
- `addon_sim_variant_id` - Shopify variant ID for add-on SIM
- `max_lines` - Maximum lines allowed (2-10)

#### Features Section
- `show_features` - Show/hide features section
- `features_title` - Features section title
- `features_subtitle` - Features section subtitle
- **Blocks**: Add unlimited feature items

### Next.js React Props

```typescript
interface FamilyPlanBuilderProps {
  config?: Partial<FamilyPlanConfig>;
  onAddToCart?: (lines: FamilyPlanLine[]) => void | Promise<void>;
  showHero?: boolean;
  showSteps?: boolean;
  showFeatures?: boolean;
}

interface FamilyPlanConfig {
  primaryLinePrice: number;        // Default: 49
  addonLinePrice: number;          // Default: 24
  addonSavings: number;            // Default: 25
  maxLines: number;                // Default: 5
  minLines: number;                // Default: 2
  primaryPlanName: string;         // Default: "Unlimited Plan - Primary Line"
  addonPlanName: string;           // Default: "Unlimited Plan - Add-on Line"
  primaryProductId?: string;       // Optional Shopify product ID
  addonProductId?: string;         // Optional Shopify product ID
}
```

---

## 💻 Usage Examples

### Example 1: Basic Implementation (Next.js)

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function Page() {
  return <FamilyPlanBuilder />;
}
```

### Example 2: Custom Configuration (Next.js)

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function Page() {
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
      showHero={true}
      showSteps={true}
      showFeatures={true}
    />
  );
}
```

### Example 3: With Cart Integration (Next.js)

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';
import { useCart } from '@/hooks/useCart';

export default function Page() {
  const { addItems } = useCart();

  const handleAddToCart = async (lines) => {
    const cartItems = lines.map((line, index) => ({
      variantId: line.isPrimary 
        ? 'gid://shopify/ProductVariant/primary-id'
        : 'gid://shopify/ProductVariant/addon-id',
      quantity: 1,
      attributes: [
        { key: 'Line Number', value: `${index + 1}` },
        { key: 'SIM Type', value: line.variant },
        { key: 'Type', value: line.isPrimary ? 'Primary' : 'Add-on' }
      ]
    }));

    await addItems(cartItems);
    
    // Redirect to cart or show success message
    window.location.href = '/cart';
  };

  return (
    <FamilyPlanBuilder
      config={{
        primaryLinePrice: 49,
        addonLinePrice: 24,
        primaryProductId: 'gid://shopify/Product/primary-id',
        addonProductId: 'gid://shopify/Product/addon-id',
      }}
      onAddToCart={handleAddToCart}
    />
  );
}
```

### Example 4: Minimal Builder (Next.js)

```tsx
import FamilyPlanBuilder from '@/components/FamilyPlanBuilder';

export default function Page() {
  return (
    <FamilyPlanBuilder
      showHero={false}
      showSteps={false}
      showFeatures={false}
    />
  );
}
```

### Example 5: Shopify Liquid Template

Create a new template `templates/page.family-plan.json`:

```json
{
  "sections": {
    "main": {
      "type": "family-plan-builder",
      "settings": {
        "show_hero": true,
        "hero_title": "Save More with a Family Plan",
        "hero_subtitle": "Get up to 5 lines of unlimited data",
        "primary_line_price": 49,
        "addon_line_price": 24,
        "addon_savings": 25,
        "max_lines": 5
      },
      "blocks": {
        "feature-1": {
          "type": "feature",
          "settings": {
            "feature_text": "Unlimited 5G Data"
          }
        },
        "feature-2": {
          "type": "feature",
          "settings": {
            "feature_text": "Unlimited Talk & Text"
          }
        }
      }
    }
  },
  "order": ["main"]
}
```

---

## 🎨 Customization

### Styling (Next.js)

The component uses Tailwind CSS. Customize colors by modifying your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          // ... your brand colors
          600: '#667eea', // Main purple
          700: '#5568d3',
        },
      },
    },
  },
};
```

### Styling (Liquid)

Edit `assets/family-plan-builder.css`:

```css
/* Change primary color */
.family-plan-hero {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

.family-plan-line:hover {
  border-color: #your-brand-color;
}

/* Modify button styles */
.family-plan-summary__cta {
  background: #your-brand-color;
}
```

### Custom Features List (Next.js)

Override the default features:

```tsx
const customFeatures = [
  'Your Feature 1',
  'Your Feature 2',
  'Your Feature 3',
];

// Modify the component or create a wrapper
```

### Translation (Liquid)

Use Shopify's translation system by creating locale files:

```json
// locales/en.default.json
{
  "family_plan": {
    "add_line": "Add-a-Line for ${{ price }}/mo",
    "remove_line": "Remove line",
    "subtotal": "Subtotal:",
    "savings": "Total savings:"
  }
}
```

Then in the liquid file, use:

```liquid
{{ 'family_plan.add_line' | t: price: section.settings.addon_line_price }}
```

---

## 📚 API Reference

### Methods (JavaScript in Liquid)

```javascript
FamilyPlanBuilder.addLine()        // Add a new line
FamilyPlanBuilder.removeLine(id)   // Remove specific line
FamilyPlanBuilder.updateCalculator() // Recalculate prices
FamilyPlanBuilder.addToCart()      // Add plan to cart
```

### Events (Custom Events)

Dispatch custom events for tracking:

```javascript
// In the Liquid section
document.dispatchEvent(new CustomEvent('familyPlan:lineAdded', {
  detail: { lineNumber: currentLines }
}));

document.dispatchEvent(new CustomEvent('familyPlan:addedToCart', {
  detail: { lines: lines, total: subtotal }
}));
```

### React Hooks (Next.js)

Create custom hooks for advanced usage:

```typescript
// hooks/useFamilyPlan.ts
import { useState, useCallback } from 'react';

export function useFamilyPlan(config) {
  const [lines, setLines] = useState([/* initial state */]);
  
  const addLine = useCallback(() => {
    // Logic
  }, [lines]);
  
  return { lines, addLine, /* ... */ };
}
```

---

## 🏆 Best Practices

### Performance

1. **Lazy Load Images** - Use lazy loading for feature icons
2. **Code Splitting** - Dynamic import for heavy components
3. **Memoization** - Use `useMemo` and `useCallback` in React
4. **Debounce** - Debounce rapid add/remove actions

### Accessibility

1. **Keyboard Navigation** - All interactive elements are keyboard accessible
2. **ARIA Labels** - Proper `aria-label` attributes on buttons
3. **Focus Management** - Visible focus indicators
4. **Screen Readers** - Semantic HTML and announcements

### SEO

1. **Structured Data** - Add JSON-LD for product schema
2. **Meta Tags** - Proper title and description
3. **Heading Hierarchy** - Proper h1-h6 usage
4. **Alt Text** - Descriptive alt attributes for images

### Analytics

Track user interactions:

```javascript
// Google Analytics example
gtag('event', 'family_plan_line_added', {
  'event_category': 'Family Plan',
  'event_label': 'Line Added',
  'value': lineNumber
});

gtag('event', 'family_plan_add_to_cart', {
  'event_category': 'Family Plan',
  'event_label': 'Added to Cart',
  'value': subtotal
});
```

### Error Handling

```typescript
const handleAddToCart = async (lines) => {
  try {
    await addToCart(lines);
    showSuccessMessage();
  } catch (error) {
    console.error('Cart error:', error);
    showErrorMessage('Unable to add to cart. Please try again.');
    // Log to error tracking service
    logError(error);
  }
};
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Lines not adding to cart (Liquid)

**Solution**: Ensure variant IDs are correct in section settings:

```liquid
<!-- Check variant IDs -->
{{ section.settings.primary_sim_variant_id }}
{{ section.settings.addon_sim_variant_id }}
```

#### Issue: Styling not applied (Liquid)

**Solution**: Verify CSS is properly linked:

```liquid
{{ 'family-plan-builder.css' | asset_url | stylesheet_tag }}
```

#### Issue: TypeScript errors (Next.js)

**Solution**: Install all dependencies:

```bash
npm install lucide-react @types/react
```

#### Issue: Mobile layout breaks

**Solution**: Check viewport meta tag in layout:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 📞 Support

For questions or issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review [usage examples](#usage-examples)
3. Inspect browser console for errors
4. Check Shopify theme preview for Liquid version

---

## 📝 License

This component is part of the Shopify Ecommerce workspace project.

---

## 🙏 Credits

Built with:
- Shopify Liquid
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

---

**Last Updated**: November 1, 2025
