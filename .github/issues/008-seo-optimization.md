# Issue #8: Add SEO and Meta Tags Optimization

**Type:** `feat(theme)` `feat(headless)`
**Label:** `enhancement`, `seo`, `both-projects`
**Project:** Both Custom Theme & Headless Next.js

## Description
Implement comprehensive SEO optimization including meta tags, structured data, sitemaps, and Open Graph tags.

## Requirements

### Meta Tags
- [ ] Dynamic page titles
- [ ] Meta descriptions
- [ ] Open Graph tags (Facebook)
- [ ] Twitter Cards
- [ ] Canonical URLs
- [ ] Robots meta tags
- [ ] Favicon and app icons

### Structured Data (Schema.org)
- [ ] Product schema
- [ ] Organization schema
- [ ] Breadcrumb schema
- [ ] Review/Rating schema
- [ ] WebSite schema with search action

### Additional SEO
- [ ] XML sitemap
- [ ] Robots.txt
- [ ] 404 page optimization
- [ ] Alt text for all images
- [ ] Semantic HTML structure
- [ ] Heading hierarchy (H1, H2, etc)

## Acceptance Criteria
- [ ] All pages have unique titles
- [ ] Meta descriptions < 160 characters
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Open Graph preview looks good
- [ ] Lighthouse SEO score > 90
- [ ] Google Search Console has no errors

## Technical Implementation

**Theme:**
- [ ] Update `snippets/meta-tags.liquid`
- [ ] Add structured data snippets
- [ ] Optimize `layout/theme.liquid`
- [ ] Add sitemap support

**Headless:**
- [ ] Add Next.js Metadata API usage
- [ ] Create SEO component
- [ ] Add JSON-LD structured data
- [ ] Configure next-sitemap

## Files to Create/Modify

**Theme:**
- Update `snippets/meta-tags.liquid`
- `snippets/structured-data-product.liquid`
- `snippets/structured-data-organization.liquid`

**Headless:**
- `components/SEO.tsx`
- `lib/seo.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- Update all page metadata

## Testing Tools
- [ ] Google Rich Results Test
- [ ] Facebook Sharing Debugger
- [ ] Twitter Card Validator
- [ ] Lighthouse SEO audit
- [ ] Google Search Console

## References
- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Schema.org: https://schema.org/
- Shopify SEO: https://shopify.dev/themes/seo
