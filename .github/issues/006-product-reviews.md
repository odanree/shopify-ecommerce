# Issue #6: Add Product Reviews and Ratings

**Type:** `feat(headless)`
**Label:** `enhancement`, `headless`
**Project:** Headless Next.js

## Description
Integrate product reviews and ratings system to display customer feedback on product pages.

## Requirements

### Review Features
- [ ] Display average rating stars
- [ ] Show review count
- [ ] List individual reviews
- [ ] Pagination for reviews
- [ ] Filter reviews (helpful, recent, rating)
- [ ] Review summary breakdown (5★, 4★, etc)

### Integration Options
- Option A: Use Shopify Product Reviews app data
- Option B: Integrate third-party review service (Judge.me, Yotpo)
- Option C: Custom review system with metafields

## Acceptance Criteria
- [ ] Reviews display on product pages
- [ ] Rating visible in product cards
- [ ] Mobile-friendly review layout
- [ ] Reviews load without blocking page
- [ ] Handles products with no reviews
- [ ] SEO-friendly review markup (schema.org)

## Technical Implementation
- [ ] Add review component to product page
- [ ] Create `ProductReviews.tsx` component
- [ ] Create `ReviewCard.tsx` component
- [ ] Create `RatingStars.tsx` component
- [ ] Fetch reviews from Shopify metafields or API
- [ ] Add structured data for SEO

## Files to Create
- `components/ProductReviews.tsx`
- `components/ReviewCard.tsx`
- `components/RatingStars.tsx`
- `types/review.ts`
- Update `app/products/[handle]/page.tsx`

## API Integration
If using metafields:
```typescript
// Update shopify.ts
export async function getProductReviews(productId: string)
```

## References
- Shopify Metafields: https://shopify.dev/apps/metafields
- Product Reviews API: https://shopify.dev/apps/selling-strategies/purchase-options/product-reviews
- Schema.org Review: https://schema.org/Review
