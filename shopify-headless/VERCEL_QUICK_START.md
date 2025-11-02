# Vercel Deployment - Quick Reference

## 🚀 One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/odanree/shopify-ecommerce&root-directory=shopify-headless&env=SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN&envDescription=Shopify%20API%20credentials%20required&project-name=shopify-headless-store)

## ⚡ Quick Setup (5 minutes)

### 1. Go to Vercel
👉 [vercel.com/new](https://vercel.com/new)

### 2. Import GitHub Repo
- Select: `odanree/shopify-ecommerce`
- Root Directory: `shopify-headless` ⚠️

### 3. Add Environment Variables
```
SHOPIFY_STORE_DOMAIN=odanree.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

### 4. Click Deploy 🎉

---

## 🔄 Auto-Deploy Behavior

| Action | Result |
|--------|--------|
| Push to `main` | 🟢 Deploy to Production |
| Create PR | 🔵 Preview Deployment |
| Push to any branch | 🔵 Preview Deployment |
| Merge PR | 🟢 Deploy to Production |

---

## 📁 Configuration Files

✅ `vercel.json` - Vercel build configuration  
✅ `.vercelignore` - Files to exclude from deployment  
✅ `VERCEL_DEPLOYMENT.md` - Complete deployment guide  

---

## 🛠️ Common Commands

```bash
# Deploy from CLI
npm i -g vercel
vercel login
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

---

## 🐛 Troubleshooting

**Build Fails?**
- Check Root Directory is set to `shopify-headless`
- Verify environment variables are correct
- View build logs in Vercel dashboard

**Runtime Errors?**
- Check Functions tab in Vercel deployment
- Verify Shopify credentials are valid
- Check browser console for errors

---

## 📚 Documentation

- 📖 Full Guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- 🌐 Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- 🔧 Next.js on Vercel: [vercel.com/docs/frameworks/nextjs](https://vercel.com/docs/frameworks/nextjs)

---

## 🎯 After Deployment

- [ ] Test all pages and functionality
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics
- [ ] Configure deployment protection
- [ ] Set up Shopify webhooks for real-time updates

**Your site will be live at:**  
`https://your-project-name.vercel.app`

---

Need help? See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions!
