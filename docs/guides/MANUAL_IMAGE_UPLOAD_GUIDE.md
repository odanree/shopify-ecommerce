# Manual Image Upload Guide

## Why Manual Upload?

Shopify's `productCreateMedia` API can be finicky with external URLs:
- Some domains are blocked for security
- Redirects often fail
- Processing can timeout

**Manual upload via Shopify Admin is the most reliable method.**

---

## Quick Upload Method (5-10 minutes for 11 products)

### Option 1: Use Free Stock Images

1. **Go to Shopify Admin:**
   - Navigate to: https://admin.shopify.com/store/odanree/products

2. **For each product:**
   - Click product name
   - Scroll to "Media" section
   - Click "Add media" → "Add from URL"
   - Paste one of these free t-shirt image URLs:

**Tech T-Shirt Stock Images (Free to use):**
```
https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200
https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200
https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200
https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200
https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200
https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=1200
https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200
https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200
https://images.unsplash.com/photo-1581791538302-03537b9d1f74?w=1200
https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200
https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200
```

3. **Click "Add media"** and wait for processing (usually 5-10 seconds)

---

### Option 2: Create Custom T-Shirt Mockups

For more professional-looking product images:

#### Using Printful Mockup Generator (FREE)

1. **Go to:** https://www.printful.com/mockup-generator
2. **Select:** T-shirt template
3. **Upload/Add:** Text or logo for each product:
   - "Next.js Developer"
   - "React Developer"
   - "TypeScript Master"
   - etc.
4. **Download** the mockup image
5. **Upload to Shopify:**
   - Products → Select product → Media → Upload files

#### Using Placeit (Paid, but has free trial)

1. **Go to:** https://placeit.net/c/apparel/t-shirts
2. **Choose** a t-shirt mockup
3. **Customize** with product text
4. **Download** and upload to Shopify

---

### Option 3: Use AI-Generated Images

#### Using DALL-E, Midjourney, or Stable Diffusion

**Prompt examples:**
```
"A clean, minimalist black t-shirt with 'Next.js Developer' text in white, 
product photography, centered, high quality, e-commerce style"

"Professional product photo of a blue t-shirt with 'React Developer' logo, 
white background, studio lighting, front view"

"TypeScript Master t-shirt mockup, modern design, product photography, 
high resolution"
```

Generate → Download → Upload to Shopify

---

## Bulk Upload Method

If you have multiple images ready:

1. **Prepare images:**
   - Name them clearly: `nextjs-front.jpg`, `react-front.jpg`, etc.
   - Recommended size: 1200x1200px minimum
   - Format: JPG or PNG

2. **In Shopify Admin:**
   - Products → Select product
   - Media → "Upload files"
   - Drag and drop multiple images at once

3. **Repeat** for each product

---

## Best Practices

### Image Requirements
- **Format:** JPG or PNG
- **Size:** At least 800x800px (1200x1200px recommended)
- **Aspect Ratio:** Square (1:1) or portrait (2:3)
- **File Size:** Under 20MB
- **Background:** White or transparent works best

### SEO-Friendly Alt Text
When uploading, add descriptive alt text:
- ✅ "Next.js Developer T-Shirt - Black, Front View"
- ❌ "image1.jpg"

---

## After Upload

1. **Verify on Storefront:**
   - Local: http://localhost:3000/products
   - Production: https://shopify-headless-8746.vercel.app/products

2. **Cache Refresh:**
   - May take 1-2 minutes for changes to appear
   - Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Time Estimates

| Method | Time Required | Cost | Quality |
|--------|--------------|------|---------|
| Manual URL paste | 5-10 min | Free | Basic |
| Stock images download + upload | 15-20 min | Free | Good |
| Printful mockups | 30-45 min | Free | Professional |
| AI-generated images | 20-30 min | Varies | Professional |
| Custom photography | Hours/Days | $$$ | Best |

---

## Troubleshooting

### "Media failed to process"
- ✅ Try a different image URL
- ✅ Download image first, then upload file
- ✅ Ensure image is under 20MB
- ✅ Check image format (JPG/PNG)

### Images not appearing on storefront
- ✅ Wait 60 seconds for cache refresh
- ✅ Check product is published to "headless storefront" channel
- ✅ Hard refresh browser

### Images appear pixelated
- ✅ Use larger images (1200x1200px minimum)
- ✅ Ensure original image is high quality

---

## Recommended Approach

**For this project (11 products):**

1. **Quick demo:** Use Unsplash URLs (5 minutes) ← Start here
2. **Better demo:** Create Printful mockups (30 minutes)
3. **Production:** Hire designer or use AI generation

**For now, I recommend Option 1** - paste Unsplash URLs manually in Shopify Admin. 
It's the fastest and most reliable method.
