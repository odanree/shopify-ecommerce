# Vercel Auto-Deploy Setup Guide

This guide will help you set up automatic deployments to Vercel for your Shopify headless Next.js project.

## Prerequisites

- GitHub repository: `https://github.com/odanree/shopify-ecommerce`
- Vercel account (free tier is sufficient)
- Shopify Store Domain and Storefront Access Token

## Step-by-Step Setup

### 1. Create/Login to Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub" for seamless integration
4. Authorize Vercel to access your GitHub account

### 2. Import Your Project

1. Once logged in, click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select `odanree/shopify-ecommerce`
4. If you don't see it, click **"Adjust GitHub App Permissions"** to grant access

### 3. Configure Project Settings

When importing, configure these settings:

#### Framework Preset
- **Framework Preset**: Next.js (should auto-detect)

#### Root Directory
- **Root Directory**: `shopify-headless`
- ⚠️ **Important**: Click "Edit" and set this to `shopify-headless` since your Next.js app is in a subdirectory

#### Build & Output Settings
These should auto-populate from `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Node.js Version
- **Node.js Version**: 18.x or 20.x (recommended)

### 4. Configure Environment Variables

Add these environment variables in Vercel:

```
SHOPIFY_STORE_DOMAIN=odanree.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=a9657ef8b2c6699c5fc6f7230c3ffdc1
```

**How to add them:**
1. In the import screen, expand **"Environment Variables"**
2. Add each variable:
   - Name: `SHOPIFY_STORE_DOMAIN`
   - Value: `odanree.myshopify.com`
   - Environment: Select all (Production, Preview, Development)
3. Click "Add" for each variable

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the deployment to complete (usually 2-3 minutes)
3. You'll get a live URL like: `https://your-project-name.vercel.app`

---

## Auto-Deploy Configuration

Once deployed, auto-deploy is automatically enabled:

### Production Deployments
- **Trigger**: Push to `main` branch
- **URL**: Your production domain (e.g., `your-project-name.vercel.app`)

### Preview Deployments
- **Trigger**: Push to any branch or Pull Request
- **URL**: Unique preview URL for each deployment
- **Example**: `your-project-name-git-feature-branch.vercel.app`

---

## Managing Your Deployment

### Access Your Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. View deployments, logs, and analytics

### Update Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add, edit, or delete variables
3. **Important**: Redeploy for changes to take effect

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel provides free SSL certificates

### Deployment Protection

1. Go to **Project Settings** → **Deployment Protection**
2. Enable password protection or Vercel Authentication
3. Useful for staging/preview environments

---

## Troubleshooting

### Build Failures

**Check Build Logs:**
1. Go to your deployment in Vercel dashboard
2. Click on the failed deployment
3. View "Building" tab for error details

**Common Issues:**

#### TypeScript Errors
```bash
# Make sure your code passes type checking locally
npm run build
```

#### Missing Environment Variables
- Verify all required env vars are set in Vercel
- Check for typos in variable names

#### Root Directory Not Set
- Ensure "Root Directory" is set to `shopify-headless`
- Redeploy after changing this setting

### Runtime Errors

1. Check **Functions** tab in deployment details
2. View server logs for API routes
3. Use `console.log()` statements (visible in logs)

### Slow Deployments

- Vercel caches dependencies between builds
- First deployment takes longer
- Subsequent deployments are faster (usually < 1 minute)

---

## Vercel CLI (Optional)

Install Vercel CLI for local development and manual deployments:

```bash
# Install globally
npm i -g vercel

# Login
vercel login

# Deploy from local machine
cd shopify-headless
vercel

# Deploy to production
vercel --prod
```

---

## Monitoring & Analytics

Vercel provides built-in monitoring:

1. **Analytics**: Page views, performance metrics
2. **Speed Insights**: Core Web Vitals
3. **Logs**: Real-time function logs
4. **Deployments**: History of all deployments

Enable in: **Project Settings** → **Analytics**

---

## GitHub Integration Features

✅ **Automatic Deployments**: Every push triggers a deployment  
✅ **PR Previews**: Each PR gets a unique preview URL  
✅ **Deploy Comments**: Vercel bot comments on PRs with preview links  
✅ **Status Checks**: Deployment status visible in GitHub PRs  
✅ **Rollback**: Easy rollback to previous deployments  

---

## Cost Considerations

**Vercel Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth/month
- Serverless functions
- Preview deployments

**Upgrade if needed:**
- More team members
- Higher bandwidth
- Advanced features
- Custom deployment settings

---

## Security Best Practices

1. **Never commit `.env.local`** (already in `.gitignore`)
2. **Use Vercel Environment Variables** for secrets
3. **Enable Deployment Protection** for non-production environments
4. **Regularly rotate** Shopify access tokens
5. **Monitor** deployment logs for suspicious activity

---

## Next Steps After Deployment

1. **Test Your Site**: Verify all functionality works in production
2. **Set Up Custom Domain**: Add your own domain name
3. **Enable Analytics**: Track site performance
4. **Configure Webhooks**: Set up Shopify webhooks for real-time updates
5. **Set Up Monitoring**: Use Vercel monitoring or third-party tools

---

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

---

## Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

---

**Ready to deploy?** Follow the steps above and your site will be live in minutes! 🚀
