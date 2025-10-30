# Issue #2: Implement Product Search in Headless Storefront

**Type:** `feat(headless)`
**Label:** `enhancement`, `headless`
**Project:** Headless Next.js

## Description
Add product search functionality to the headless Next.js storefront using Shopify Storefront API.

## Requirements

### Search Features
- [ ] Search input component in header
- [ ] Real-time search suggestions (autocomplete)
- [ ] Search results page with filtering
- [ ] Product thumbnails in results
- [ ] Price display in search results
- [ ] "No results" state handling
- [ ] Search history (optional)
- [ ] Mobile-optimized search interface

### Technical Implementation
- [ ] Create `/app/search/page.tsx`
- [ ] Add Shopify predictive search API integration
- [ ] Implement debounced search input
- [ ] Create `SearchBar` component
- [ ] Create `SearchResults` component
- [ ] Add loading states
- [ ] Handle API errors gracefully

## Acceptance Criteria
- [ ] Search bar visible on all pages
- [ ] Search returns relevant products
- [ ] Results display within 500ms
- [ ] Mobile search UX is smooth
- [ ] Handles typos/partial matches
- [ ] SEO-friendly URLs for search pages

## Files to Create
- `components/SearchBar.tsx`
- `components/SearchResults.tsx`
- `app/search/page.tsx`
- `lib/shopify-search.ts`

## API Changes Needed
Update `lib/shopify.ts`:
```typescript
export async function searchProducts(query: string): Promise<ShopifyProduct[]>
export async function getPredictiveSearch(query: string)
```

## References
- Storefront API Search: https://shopify.dev/api/storefront/latest/queries/search
- Predictive Search: https://shopify.dev/api/ajax/reference/predictive-search
