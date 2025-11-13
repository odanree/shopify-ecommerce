# Vercel Build Failure - Missing Environment Variables

## Issue
Vercel build failed during static generation of `/collections` page:
```
Error: Missing required environment variables: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

## Root Cause
Environment variables are not configured in Vercel project settings. They need to be added to build successfully.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Project Settings
1. Open: https://vercel.com/dashboard
2. Select project: `shopify-ecommerce-docs`
3. Go to: **Settings** → **Environment Variables**

### Step 2: Add Required Variables

From your `.env.local`, add these environment variables:

| Variable | Value | Source |
|----------|-------|--------|
| `SHOPIFY_STORE_DOMAIN` | `odanree.myshopify.com` | From copilot-instructions.md |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | [Your token] | From .env.local (already configured) |

### Step 3: Configuration
For each variable:
- **Name**: Exact variable name
- **Value**: Your Shopify storefront token
- **Environments**: Select `Production` and `Preview`
- Click **Add**

### Step 4: Redeploy
After adding variables:
```bash
git push origin dev
```

Vercel will automatically redeploy with new environment variables.

## Why This Happens

**Local Development** (working ✅):
- `.env.local` file contains variables
- `npm run dev` reads from local file
- Build succeeds

**Vercel Deployment** (failing ❌):
- `.env.local` is NOT in git (for security)
- Vercel doesn't have variables configured
- Build fails during static generation
- Collections page tries to fetch Shopify data

## Verification

After adding variables, you should see:
1. ✅ Vercel redeploy starts automatically
2. ✅ Build completes without env variable errors
3. ✅ All 11 pages generate successfully (including `/collections`)
4. ✅ Deployment preview available

## From Copilot Instructions

From `.github/copilot-instructions.md`:
```
- ✅ SHOPIFY_ADMIN_API_TOKEN - Already configured for Admin API access
- ✅ SHOPIFY_STOREFRONT_ACCESS_TOKEN - For frontend product queries
- ✅ SHOPIFY_LOCATION_ID - 80318955565 (470 S Alpine Rd)
- ✅ SHOPIFY_STORE_DOMAIN - odanree.myshopify.com
```

These are your values to add.

## Additional Notes

- Don't commit `.env.local` (already in .gitignore ✅)
- Environment variables must match exactly
- Can also use Vercel CLI: `vercel env pull`
- Test locally: `npm run dev` should still work with local .env.local
