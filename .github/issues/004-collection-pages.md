# Issue #4: Add Collection Pages to Both Projects

**Type:** `feat(theme)` `feat(headless)`
**Label:** `enhancement`, `both-projects`
**Project:** Both Custom Theme & Headless Next.js

## Description
Implement collection pages to display grouped products with filtering and sorting capabilities.

## Requirements

### Custom Shopify Theme
- [ ] Create collection template
- [ ] Collection banner with image
- [ ] Product grid layout
- [ ] Pagination
- [ ] Filter by tags
- [ ] Sort options (price, date, etc)
- [ ] Responsive design

### Headless Next.js
- [ ] Collection listing page
- [ ] Dynamic collection routes
- [ ] Product filtering UI
- [ ] Sort dropdown
- [ ] Pagination or infinite scroll
- [ ] Collection metadata display

## Acceptance Criteria

**Theme:**
- [ ] Collections display all products
- [ ] Filters work correctly
- [ ] Sorting updates product order
- [ ] Mobile-friendly grid layout
- [ ] Fast page load times

**Headless:**
- [ ] Collections fetch via Storefront API
- [ ] SEO-optimized collection pages
- [ ] Smooth filtering experience
- [ ] Works on all devices

## Files to Create

**Theme:**
- `templates/collection.liquid` (already exists - enhance)
- `sections/collection-banner.liquid`
- `sections/collection-product-grid.liquid`
- `snippets/collection-filters.liquid`
- `assets/collection.css`

**Headless:**
- `app/collections/page.tsx`
- `app/collections/[handle]/page.tsx`
- `components/CollectionGrid.tsx`
- `components/ProductFilters.tsx`
- `lib/shopify-collections.ts`

## API Functions Needed
```typescript
export async function getCollections(): Promise<ShopifyCollection[]>
export async function getCollection(handle: string): Promise<ShopifyCollection>
export async function getCollectionProducts(handle: string): Promise<ShopifyProduct[]>
```

## References
- Collection templates: https://shopify.dev/themes/architecture/templates/collection
- Collections API: https://shopify.dev/api/storefront/latest/objects/Collection
