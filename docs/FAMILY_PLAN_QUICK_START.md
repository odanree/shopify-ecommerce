# Family Plan Builder - Quick Start Guide

Get your family plan builder up and running in 5 minutes!

## 🚀 Quick Start - Next.js Version

### 1. Install Dependencies

```bash
cd shopify-headless
npm install lucide-react
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. View the Family Plan Builder

Navigate to: **http://localhost:3000/family-plan**

That's it! 🎉 The family plan builder is now running.

---

## 🛍️ Quick Start - Shopify Theme

### 1. Upload Files

1. Go to **Online Store > Themes > Actions > Edit code**
2. Upload `family-plan-builder.liquid` to `sections/` folder
3. Upload `family-plan-builder.css` to `assets/` folder

### 2. Add CSS to Theme

In `layout/theme.liquid`, add to `<head>`:

```liquid
{{ 'family-plan-builder.css' | asset_url | stylesheet_tag }}
```

### 3. Add to Page

1. Go to **Online Store > Themes > Customize**
2. Click **Add section**
3. Select **Family Plan Builder**
4. Click **Save**

Done! ✅

---

## ⚙️ Basic Configuration

### Next.js

Edit `app/family-plan/page.tsx`:

```tsx
<FamilyPlanBuilder
  config={{
    primaryLinePrice: 49,      // Change primary line price
    addonLinePrice: 24,        // Change add-on price
    maxLines: 5,               // Max lines allowed
    minLines: 2,               // Min lines required
  }}
/>
```

### Shopify Theme

In theme editor, configure:
- Primary line price: `49`
- Add-on line price: `24`
- Maximum lines: `5`
- Plan names and descriptions

---

## 🎯 What You Get

✅ **Interactive Builder** - Add/remove lines dynamically  
✅ **SIM Selection** - Physical SIM or eSIM per line  
✅ **Real-time Pricing** - Instant calculations  
✅ **Responsive Design** - Works on all devices  
✅ **Features Section** - Showcase plan benefits  
✅ **How It Works** - Step-by-step guide  

---

## 📱 Test on Mobile

1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Visit: `http://YOUR-IP:3000/family-plan` on your phone
3. Test adding/removing lines on mobile

---

## 🔥 Next Steps

1. **Customize Colors** - Edit Tailwind config or CSS
2. **Connect to Cart** - Implement `onAddToCart` function
3. **Add Analytics** - Track user interactions
4. **Customize Features** - Update feature list
5. **Add Products** - Link to your Shopify products

📖 **Full Documentation**: See `FAMILY_PLAN_BUILDER_DOCS.md`

---

## 💡 Tips

- Start with default settings and customize gradually
- Test on multiple devices and browsers
- Use browser DevTools to debug
- Check console for error messages
- Review the Ultra Mobile site for UX inspiration

---

## ❓ Need Help?

Check the full documentation or review the code comments for detailed explanations.

**Happy Building!** 🎊
