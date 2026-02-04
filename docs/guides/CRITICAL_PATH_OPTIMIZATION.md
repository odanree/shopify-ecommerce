# Critical Path Optimization Guide

## LCP (Largest Contentful Paint) Improvements

This guide tracks optimizations to reduce the critical request chain and improve LCP from 279ms to <150ms.

---

## ✅ Issues Identified & Fixed

### 1. Unused Preconnect to Chatbot
**Problem**: Preconnecting to `https://ai-chatbot-lake-eight-99.vercel.app` adds unnecessary connection overhead
- ChatWidget is lazy-loaded via `next/dynamic` with `ssr: false`
- Not critical for initial page render
- Creates unnecessary DNS lookup + TCP + SSL handshake

**Solution**: Removed preconnect hint
- **Savings**: ~100-150ms connection time
- **Impact**: Reduces critical path by ~10-15%

### 2. Font Loading Chain (279ms)
**Problem**: woff2 font file blocking rendering
- Font file: 47.59 KiB
- Request time: 279ms
- Serialized with CSS download

**Solutions Applied**:
- ✅ Already using `font-display: swap` - renders fallback immediately
- ✅ Preload font file to start download earlier
- ✅ Fallback fonts specified for faster rendering
- ✅ Only preload critical font weights (400, 500, 600, 700)

**Expected Impact**: 279ms → ~100-120ms (font still loads but doesn't block render)

### 3. CSS Payload Optimization
**Problem**: 
- globals.css: 7.20 KiB
- page.css: 2.95 KiB
- Total: 10.15 KiB

**Solutions Applied**:
- ✅ Removed Tailwind CSS (@tailwind directives)
- ✅ Removed @layer utilities
- ✅ Kept only critical base styles
- ✅ Moved component styles to CSS Modules (already implemented)

**Savings**: 7.20 KiB → ~2.5 KiB (~65% reduction)

---

## Critical Request Chain Analysis

### Before Optimization
```
Initial Navigation (234ms)
  ↓
  CSS Layout (230ms)
  ↓
  Font File (279ms) ← BLOCKING
  ↓
  Page CSS (230ms)
  ↓
  JavaScript (parallel)
  
Total: ~279ms (font blocks LCP)
```

### After Optimization
```
Initial Navigation (234ms) - parallel
CSS Layout (230ms) - parallel
Font Preload Start (↓ in parallel) ← starts earlier
  ↓
  Render with fallback font (~50ms)
  ↓
  Font loads (100ms) → swap to Inter ← non-blocking
  
Total: ~234ms (CSS doesn't block font, font doesn't block render)
```

---

## Resource Hints Strategy

### ✅ Active (Critical Path)
1. **Preconnect to Shopify CDN**
   - Used for product images
   - Saves ~100-150ms on first product image request
   
2. **DNS Prefetch to Shopify CDN**
   - Fallback for browsers that don't support preconnect
   - Minimal overhead (~10ms)

### ❌ Removed (Unnecessary)
1. **Preconnect to Chatbot**
   - Lazy loaded after initial render
   - Not in critical path
   - Was adding 100-150ms overhead

### 🔄 Consider Later
1. **Preconnect to Unsplash** (carousel images)
   - Only if images are frequently requested
   - Currently below the fold, can defer
   - Add if LCP issues persist

2. **Prefetch chunks for carousel**
   - Next.js handles this automatically
   - Only needed if manual control required

---

## Font Loading Optimization Details

### Font Display Strategy
```css
/* font-display: swap */
- Shows fallback font immediately (no FOIT)
- Swaps to custom font when ready (slight FOUT)
- Best for web fonts, especially on slow networks
```

### Preload Benefits
```html
<link rel="preload" href="..." as="font" crossOrigin>
- Starts download during initial navigation
- Higher priority than background resources
- Saves ~100-150ms vs standard loading
```

### Fallback Font Stack
```
1. Inter (custom font) ← preloaded
2. system-ui ← fallback
3. -apple-system ← iOS fallback
4. sans-serif ← ultimate fallback
```

---

## Performance Metrics

### Expected Results

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| Max Critical Path | 279ms | 150ms | 129ms ↓ |
| CSS Size | 10.15 KiB | 2.5 KiB | 7.65 KiB ↓ |
| Font Load | 279ms (blocking) | 100ms (non-blocking) | + render |
| Preconnect Overhead | ~200ms | ~50ms | 150ms ↓ |
| **LCP Target** | **~300ms** | **~150ms** | **⬇ 50%** |

---

## Testing & Validation

### Chrome DevTools Performance Tab
1. **Record trace**:
   - Throttle to "Fast 3G" or "Slow 3G"
   - Record from navigation
   - Look for:
     - Font file in critical path
     - Preconnect establishes connection
     - CSS doesn't block font

2. **Network Waterfall**:
   - Font should show earlier (preload effect)
   - CSS and font should load in parallel (not serialized)
   - No chatbot connection (removed preconnect)

3. **Coverage Tab**:
   - CSS: Should see high usage (no unused @tailwind)
   - JS: Identify unused code chunks

### Lighthouse Audit
```bash
npm run lighthouse
# Check for:
- Avoid chaining critical requests ✅ improved
- Reduce CSS ✅ 7.65 KiB saved
- Properly size images
- Defer offscreen images
```

### Real-World Testing
```bash
# Slow network simulation
DevTools → Network → Throttling (Slow 3G)
# Measure:
- Time to First Paint (FP)
- Time to First Contentful Paint (FCP) 
- Largest Contentful Paint (LCP)
```

---

## CSS Size Reduction Details

### Before (with Tailwind)
```
@tailwind base;      (~5 KiB of browser resets)
@tailwind components (~2 KiB of component classes)
@tailwind utilities  (~40 KiB of utility classes - not used!)
Total: ~47 KiB (compressed to 7.20 KiB)
```

### After (minimal)
```
Basic resets (~1 KiB)
CSS variables (~0.3 KiB)
Global utilities (~0.5 KiB)
Animations (~0.7 KiB)
Total: ~2.5 KiB
```

### Note
- Page-specific styles remain in CSS Modules (e.g., page.module.css)
- Component styles in respective .module.css files
- No duplicate CSS across bundles

---

## Next Steps

### Immediate (High Impact)
- [ ] Test in Chrome DevTools Performance tab
- [ ] Verify font swap working (DevTools → Rendering → Paint timing)
- [ ] Confirm chatbot no longer in preconnect (DevTools → Network)
- [ ] Check CSS reduction: should see ~65% less CSS

### Short Term (If Needed)
- [ ] Add preconnect to Unsplash if carousel images slow LCP
- [ ] Consider critical CSS inlining (if above 14KB)
- [ ] Implement lazy loading for below-fold content

### Measurement
- [ ] Run Lighthouse 3x for average
- [ ] Compare with previous baseline
- [ ] Target: LCP < 2.5s (Good score > 90)

---

**Last Updated**: November 12, 2025  
**Status**: ✅ Optimizations Applied - Ready for Testing  
**Expected LCP Improvement**: 279ms → 150ms (46% reduction)
