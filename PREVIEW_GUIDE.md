# Preview Family Plan Builder - Step by Step Guide

## 🚀 Option 1: Next.js Local Preview (5 Minutes)

### Step 1: Install Dependencies

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-headless
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- CSS Modules (for styling)
- lucide-react (icons)
- Cypress (E2E testing)
- All other dependencies

### Step 2: Start Development Server

```powershell
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000/family-plan**

✅ **You should see the family plan builder working!**

### What You Can Test:
- ✅ Family plan builder (add/remove lines)
- ✅ Switch between SIM/eSIM
- ✅ See real-time pricing with bulk discounts
- ✅ Shopping cart functionality (add/remove items)
- ✅ Product pages
- ✅ Responsive design (resize browser)
- ✅ All animations and interactions
- ✅ TypeScript type safety

---

## 🌐 Option 2: View Live Production Site (Instant)

**Production URL**: https://shopify-headless-8746.vercel.app/

✅ **Already deployed and live!**

### What's Available:
- ✅ Homepage with featured products
- ✅ Family Plan Builder: https://shopify-headless-8746.vercel.app/family-plan
- ✅ Shopping Cart: https://shopify-headless-8746.vercel.app/cart
- ✅ Product pages
- ✅ Full responsive design
- ✅ Vercel CDN (fast global performance)

### Auto-Deploy Status:
- Every merge to `main` → Production deployment
- Every PR → Preview deployment
- CI/CD with GitHub Actions + Cypress E2E tests

---

## 🛍️ Option 3: Push to Shopify Theme (For Live Preview)

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

## 📱 Option 4: Push to Development Theme (Recommended for Shopify)

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

## 🌐 Option 5: Push to Production Theme (When Ready)

⚠️ **Warning**: This will update your live theme!

```powershell
cd C:\Users\Danh\Desktop\Jobsearch\shopify-theme
shopify theme push
```

Select your theme when prompted.

---

## 🎯 Recommended Workflow

### For Testing (Start Here):

1. **Check Live Production Site** (Fastest)
   - Visit: https://shopify-headless-8746.vercel.app/
   - Test family plan: https://shopify-headless-8746.vercel.app/family-plan
   - Test cart: https://shopify-headless-8746.vercel.app/cart
   - Already deployed with auto-deploy enabled!

2. **Test Next.js Locally** (For Development)
   ```powershell
   cd shopify-headless
   npm install
   npm run dev
   ```
   - Visit: http://localhost:3000/
   - Test all functionality
   - Run E2E tests: `npm run cypress`
   - Check mobile responsive (browser DevTools)

3. **Run Automated Tests**
   ```powershell
   npm run test:e2e
   ```
   - Cypress E2E tests for homepage, family-plan, cart
   - Tests run automatically on PRs via GitHub Actions

4. **Push to Shopify Development Theme** (Optional)
   ```powershell
   cd ..\shopify-theme
   shopify theme dev --store your-store.myshopify.com
   ```
   - Test in real Shopify environment
   - Check theme editor integration
   - Configure all settings

5. **Deploy Changes** (Automated)
   ```powershell
   # Make changes on a feature branch
   git checkout -b feat/my-feature
   git add .
   git commit -m "feat: description"
   git push origin feat/my-feature
   
   # Create PR to dev, then merge to main
   # Vercel auto-deploys on merge to main!
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

### Headless Next.js (shopify-headless)
- [x] Production site live at https://shopify-headless-8746.vercel.app/
- [x] Next.js version running on localhost:3000
- [x] Family Plan Builder working
- [x] Shopping cart functionality complete
- [x] Can add/remove cart items
- [x] Pricing calculates correctly
- [x] Responsive on mobile
- [x] TypeScript type safety
- [x] Cypress E2E tests (13+ tests)
- [x] CI/CD with GitHub Actions
- [x] Vercel auto-deploy configured
- [ ] Product search (planned)
- [ ] Collection pages (planned)

### Shopify Theme (shopify-theme)
- [ ] Shopify CLI connected to store
- [ ] Section appears in theme editor
- [ ] CSS is applied correctly
- [ ] Settings are configurable
- [ ] Can add to cart (after product setup)
- [ ] Cart items have correct properties

---

## 📞 Next Steps After Preview

Once you've previewed and tested:

### Completed Features ✅
1. ✅ **Shopping Cart** - Full implementation with Context API
2. ✅ **Family Plan Builder** - Both Liquid and React versions
3. ✅ **Production Deployment** - Live on Vercel with auto-deploy
4. ✅ **CI/CD Pipeline** - GitHub Actions + Cypress E2E tests
5. ✅ **TypeScript** - Complete type safety

### Planned Features 📋
1. **Add Jest/React Testing Library** - Unit tests for components
2. **Setup Storybook** - Component documentation
3. **Product Search** - Search functionality
4. **Collection Pages** - Browse products by collection
5. **Customize Colors** - Match your brand
6. **Add More Products** - Expand product catalog

### Development Workflow
See `VERCEL_DEPLOYMENT.md` for complete deployment guide
See `ROADMAP.md` for full feature roadmap

---

**Production Site**: https://shopify-headless-8746.vercel.app/ 🚀

**Ready to develop?** Run the Quick Start commands above!
