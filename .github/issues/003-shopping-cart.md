# Issue #3: Implement Shopping Cart Functionality

**Type:** `feat(headless)`
**Label:** `enhancement`, `headless`, `high-priority`
**Project:** Headless Next.js

## Description
Complete shopping cart implementation with add to cart, update quantities, remove items, and checkout integration.

## Requirements

### Cart Features
- [ ] Add to cart from product page
- [ ] Cart sidebar/drawer
- [ ] Update item quantities
- [ ] Remove items from cart
- [ ] Display cart total
- [ ] Persist cart across sessions
- [ ] Apply discount codes
- [ ] Display shipping estimates
- [ ] Checkout button redirects to Shopify checkout

### Technical Implementation
- [ ] Implement cart context/state management
- [ ] Create cart API routes
- [ ] Integrate Shopify Cart API
- [ ] Add local storage persistence
- [ ] Create `Cart` component
- [ ] Create `CartItem` component
- [ ] Create `CartDrawer` component
- [ ] Update `AddToCart` button functionality

## Acceptance Criteria
- [ ] Cart updates in real-time
- [ ] Cart persists across page refreshes
- [ ] Quantities can be updated
- [ ] Items can be removed
- [ ] Checkout redirects properly
- [ ] Loading states are shown
- [ ] Error handling works
- [ ] Mobile-optimized cart UI

## Files to Create/Modify
- `app/cart/page.tsx` (full cart page)
- `components/CartDrawer.tsx`
- `components/CartItem.tsx`
- `lib/cart-context.tsx`
- `app/api/cart/route.ts`
- Update `components/AddToCart.tsx`
- Update `components/Header.tsx` (cart icon with count)

## API Functions Needed
```typescript
// Already in lib/shopify.ts - verify implementation
createCart()
addToCart(cartId, variantId, quantity)
updateCartLine(cartId, lineId, quantity)
removeFromCart(cartId, lineId)
```

## References
- Shopify Cart API: https://shopify.dev/api/storefront/latest/objects/Cart
- Cart best practices: https://shopify.dev/custom-storefronts/cart
