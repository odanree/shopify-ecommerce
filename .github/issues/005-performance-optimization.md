# Issue #5: Optimize Images and Performance

**Type:** `perf(theme)` `perf(headless)`
**Label:** `performance`, `both-projects`
**Project:** Both Custom Theme & Headless Next.js

## Description
Optimize images and overall performance for faster load times and better user experience.

## Requirements

### Image Optimization
- [ ] Implement lazy loading
- [ ] Use responsive images with srcset
- [ ] Optimize image formats (WebP)
- [ ] Add image placeholders/blur effects
- [ ] Compress large images
- [ ] Use Shopify CDN effectively

### Performance Improvements
- [ ] Minimize CSS and JavaScript
- [ ] Enable caching strategies
- [ ] Reduce bundle size
- [ ] Optimize font loading
- [ ] Remove unused code
- [ ] Implement code splitting

### Theme Specific
- [ ] Use Liquid image filters
- [ ] Async/defer JavaScript loading
- [ ] Critical CSS inline
- [ ] Lazy load sections below fold

### Headless Specific
- [ ] Next.js Image component optimization
- [ ] Static generation for product pages
- [ ] API response caching
- [ ] Bundle analysis and optimization

## Acceptance Criteria
- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Images load progressively
- [ ] No layout shift on image load
- [ ] Mobile performance optimized

## Tools to Use
- [ ] Lighthouse
- [ ] WebPageTest
- [ ] Chrome DevTools Performance
- [ ] Next.js Bundle Analyzer
- [ ] ImageOptim or similar

## Files to Modify

**Theme:**
- `assets/base.css`
- `layout/theme.liquid`
- All image references in snippets

**Headless:**
- `next.config.js`
- All components using images
- `lib/shopify.ts` (add caching)

## References
- Shopify performance best practices: https://shopify.dev/themes/best-practices/performance
- Next.js Image Optimization: https://nextjs.org/docs/basic-features/image-optimization
- Web.dev Performance: https://web.dev/performance-scoring/
