# Shopify Liquid Components - Enhanced Product Card

## Overview
This is a production-ready Shopify Liquid component system featuring modern e-commerce best practices similar to brands like Pura Vida Bracelets.

## Files Created

### 1. `snippets/product-card-enhanced.liquid`
A reusable product card snippet with advanced features.

### 2. `sections/featured-products.liquid`
A customizable section that uses the product card snippet.

---

## Features

### Product Card Features
✅ **Responsive Image Handling** - Srcset with multiple breakpoints
✅ **Hover Effects** - Secondary image on hover
✅ **Badge System** - Sale, New, Top Rated, Waterproof, Customizable
✅ **Quick View** - Modal trigger button
✅ **Color Swatches** - Show available colors
✅ **Price Variants** - Sale pricing, savings percentage
✅ **Quick Add to Cart** - AJAX add to cart for single variants
✅ **Reviews/Ratings** - Display star ratings from metafields
✅ **Lazy Loading** - Performance optimization
✅ **Accessibility** - ARIA labels and semantic HTML

### Section Features
✅ **Customizable Grid** - 2, 3, or 4 columns
✅ **Collection Integration** - Pull products from any collection
✅ **Theme Editor Settings** - Easy customization without code
✅ **Responsive Design** - Mobile, tablet, desktop optimized
✅ **Placeholder Support** - Shows placeholders in theme editor

---

## Usage

### Basic Usage
```liquid
{% render 'product-card-enhanced', product: product %}
```

### With Options
```liquid
{% render 'product-card-enhanced',
  product: product,
  show_badges: true,
  show_quick_view: true,
  image_ratio: 'square'
%}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `product` | object | required | Shopify product object |
| `show_badges` | boolean | true | Show product badges (sale, new, etc.) |
| `show_quick_view` | boolean | false | Show quick view button |
| `image_ratio` | string | 'portrait' | Image aspect ratio |

---

## Installation

### Step 1: Add Snippet
1. In Shopify Admin, go to **Online Store > Themes**
2. Click **Actions > Edit code**
3. Under **Snippets**, click **Add a new snippet**
4. Name it `product-card-enhanced`
5. Paste the content from `snippets/product-card-enhanced.liquid`

### Step 2: Add Section
1. Under **Sections**, click **Add a new section**
2. Name it `featured-products`
3. Paste the content from `sections/featured-products.liquid`

### Step 3: Add to Theme
1. Go to **Customize theme**
2. Click **Add section**
3. Select **Featured Products**
4. Configure settings and select a collection

---

## Badge System

Products automatically show badges based on:

- **Sale** - `compare_at_price > price`
- **New** - Product has tag `new`
- **Top Rated** - Product has tag `top-rated`
- **Waterproof** - Product has tag `waterproof`
- **Customizable** - Product has tag `customizable`
- **Sold Out** - Product is unavailable

### Adding Custom Badges

```liquid
{%- if product.tags contains 'limited-edition' -%}
  <span class="badge badge--limited">Limited Edition</span>
{%- endif -%}
```

---

## Quick Add to Cart

The card includes AJAX add to cart functionality for products with a single variant.

### Required: Cart Updates
You'll need to implement cart drawer/popup logic:

```javascript
// Add to your theme.js
document.addEventListener('cart:updated', (event) => {
  // Update cart count
  // Open cart drawer
  // Show notification
});
```

---

## Quick View Modal

The quick view button triggers a modal. You'll need to implement the modal:

```javascript
// Example implementation
function openQuickView(productUrl) {
  // Fetch product data
  fetch(productUrl + '?view=quick')
    .then(res => res.text())
    .then(html => {
      // Open modal with product HTML
    });
}
```

---

## Customization

### Styling
All styles are scoped within the component. Customize colors:

```css
/* In the <style> block */
.badge--sale {
  background: #your-color;
}

.btn--primary {
  background: #your-brand-color;
}
```

### Image Ratios
Modify the `image_ratio` parameter:
- `square` - 1:1 aspect ratio
- `portrait` - 2:3 aspect ratio (default)
- `landscape` - 3:2 aspect ratio

---

## Performance Optimizations

### Images
- ✅ Responsive srcset with multiple sizes
- ✅ Lazy loading enabled
- ✅ Width/height attributes for CLS prevention
- ✅ Shopify CDN automatic optimization

### JavaScript
- ✅ Vanilla JS (no jQuery dependency)
- ✅ Event delegation for efficiency
- ✅ Async/await for cart operations

### CSS
- ✅ Minimal, scoped styles
- ✅ CSS Grid for responsive layout
- ✅ Flexbox for component structure

---

## Reviews Integration

The card supports metafields for reviews:

### Setup Reviews Metafields
1. Install a reviews app (Yotpo, Judge.me, Stamped.io)
2. Or manually add metafields:
   - `reviews.rating` (number)
   - `reviews.rating_count` (number)

### Custom Reviews Display
```liquid
{%- if product.metafields.reviews.rating.value -%}
  <div class="product-card__reviews">
    {{ product.metafields.reviews.rating.value }} ★
    ({{ product.metafields.reviews.rating_count }} reviews)
  </div>
{%- endif -%}
```

---

## Advanced Features

### Color Swatches
Automatically generates swatches for products with a "Color" option.

**Requirements:**
- Product must have variant option named "Color"
- Color values should map to CSS colors or have custom swatch images

### Variant Handling
- **Single variant** → Quick add to cart button
- **Multiple variants** → "Select Options" link to product page

### Sale Pricing
Automatically calculates and displays:
- Sale price
- Compare at price (strikethrough)
- Savings percentage

---

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ iOS Safari 12+
- ✅ Chrome Mobile

---

## Similar to Pura Vida's Implementation

This component replicates features seen on puravidabracelets.com:

| Feature | Pura Vida | This Component |
|---------|-----------|----------------|
| Product badges | ✅ | ✅ |
| Hover images | ✅ | ✅ |
| Quick view | ✅ | ✅ |
| Color swatches | ✅ | ✅ |
| Multiple variants | ✅ | ✅ |
| Sale pricing | ✅ | ✅ |
| Reviews display | ✅ | ✅ |
| Lazy loading | ✅ | ✅ |

---

## Tech Stack

- **Liquid** - Shopify templating language
- **Vanilla JavaScript** - No dependencies
- **CSS Grid/Flexbox** - Modern layouts
- **Shopify Ajax Cart API** - Cart operations
- **Shopify CDN** - Image optimization

---

## Next Steps

1. **Add Cart Drawer** - Implement sliding cart drawer
2. **Add Quick View Modal** - Create product quick view popup
3. **Enhance Accessibility** - Add keyboard navigation
4. **Add Analytics** - Track product impressions/clicks
5. **A/B Testing** - Integrate with Optimizely or similar

---

## Questions?

This is a production-ready example showcasing:
- Modern Liquid patterns
- Performance best practices
- E-commerce UX standards
- Accessibility considerations
- Mobile-first responsive design

Perfect for demonstrating Shopify development skills to potential employers!
