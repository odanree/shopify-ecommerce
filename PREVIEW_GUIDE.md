# Preview Family Plan Builder - Step by Step Guide

## 🚀 Option 1: Next.js Local Preview (5 Minutes)

### Step 1: Install Dependencies

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-headless
npm install
```

This will install:
- Next.js
- React
- Tailwind CSS
- lucide-react (icons)
- All other dependencies

### Step 2: Start Development Server

```powershell
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000/family-plan**

✅ **You should see the family plan builder working!**

### What You Can Test:
- ✅ Add/remove lines
- ✅ Switch between SIM/eSIM
- ✅ See real-time pricing
- ✅ Responsive design (resize browser)
- ✅ All animations and interactions

---

## 🛍️ Option 2: Push to Shopify Theme (For Live Preview)

### Prerequisites:
- Active Shopify store
- Shopify CLI installed
- Access to theme files

### Step 1: Install Shopify CLI (if not installed)

```powershell
npm install -g @shopify/cli @shopify/theme
```

### Step 2: Navigate to Theme Directory

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-theme
```

### Step 3: Connect to Your Store

```powershell
shopify theme dev --store your-store.myshopify.com
```

This will:
- Connect to your Shopify store
- Upload the theme
- Open a preview URL
- Watch for changes

### Step 4: Access the Section

In the Shopify theme editor:
1. Click the preview URL that appears
2. Go to any page
3. Click "Add section"
4. Select "Family Plan Builder"
5. Configure settings in the sidebar

---

## 📱 Option 3: Push to Development Theme (Recommended for Shopify)

### Step 1: Create Development Theme

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-theme
shopify theme push --development
```

### Step 2: Get Preview Link

Shopify CLI will output a link like:
```
https://your-store.myshopify.com?preview_theme_id=123456
```

### Step 3: Customize in Theme Editor

1. Click the preview link
2. Click "Customize" in the top bar
3. Add the Family Plan Builder section
4. Configure and preview

---

## 🌐 Option 4: Push to Production Theme (When Ready)

⚠️ **Warning**: This will update your live theme!

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-theme
shopify theme push
```

Select your theme when prompted.

---

## 🎯 Recommended Workflow

### For Testing (Start Here):

1. **Test Next.js Locally First**
   ```powershell
   cd shopify-headless
   npm install
   npm run dev
   ```
   - Visit: http://localhost:3000/family-plan
   - Test all functionality
   - Check mobile responsive (browser DevTools)

2. **Then Push to Shopify Development Theme**
   ```powershell
   cd ..\shopify-theme
   shopify theme dev --store your-store.myshopify.com
   ```
   - Test in real Shopify environment
   - Check theme editor integration
   - Configure all settings

3. **Finally Push to Production** (when satisfied)
   ```powershell
   shopify theme push
   ```

---

## 🔧 Configuration for Shopify

Before pushing to Shopify, you need to:

### 1. Create Products in Shopify

Create two products:
1. **"Family Plan - Primary Line"** ($49/month)
   - Create variants: "SIM Card" and "eSIM"
   - Note the variant IDs

2. **"Family Plan - Add-on Line"** ($24/month)
   - Create variants: "SIM Card" and "eSIM"
   - Note the variant IDs

### 2. Add Variant IDs to Section Settings

In Shopify theme editor:
- Primary SIM Variant ID: `paste-here`
- Add-on SIM Variant ID: `paste-here`

### 3. Test Cart Integration

- Add lines to builder
- Click "Add to Cart"
- Verify items appear in cart with correct prices

---

## 📱 Testing on Mobile

### Local Testing:
1. Get your computer's local IP:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On your phone, visit:
   ```
   http://YOUR-IP:3000/family-plan
   ```

### Shopify Testing:
- Use the preview link on your mobile device
- Test in Shopify admin mobile app

---

## ⚡ Quick Start Commands

**Next.js (Fastest):**
```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-headless
npm install
npm run dev
```

**Shopify Theme:**
```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-theme
shopify theme dev --store your-store.myshopify.com
```

---

## 🆘 Troubleshooting

### Next.js Won't Start?
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Shopify CLI Not Found?
```powershell
npm install -g @shopify/cli @shopify/theme
```

### Can't Connect to Shopify?
- Verify store URL (include .myshopify.com)
- Check you're logged in: `shopify auth logout` then `shopify auth login`
- Verify you have theme permissions

### Section Not Appearing?
- Check both files are uploaded:
  - `sections/family-plan-builder.liquid`
  - `assets/family-plan-builder.css`
- Add CSS link to `layout/theme.liquid`:
  ```liquid
  {{ 'family-plan-builder.css' | asset_url | stylesheet_tag }}
  ```

---

## 🎉 Success Checklist

- [ ] Next.js version running on localhost:3000
- [ ] Can add/remove lines
- [ ] Pricing calculates correctly
- [ ] Responsive on mobile (test with DevTools)
- [ ] Shopify CLI connected to store
- [ ] Section appears in theme editor
- [ ] CSS is applied correctly
- [ ] Settings are configurable
- [ ] Can add to cart (after product setup)
- [ ] Cart items have correct properties

---

## 📞 Next Steps After Preview

Once you've previewed and tested:

1. **Customize Colors** - Match your brand
2. **Update Copy** - Adjust text and messaging
3. **Add Products** - Create actual Shopify products
4. **Configure Settings** - Set prices and features
5. **Test Checkout** - Full end-to-end test
6. **Launch** - Push to production theme

---

**Ready to start?** Run the Quick Start commands above! 🚀
