# Merge Dev to Main & Deploy

## Current State
- ✅ All optimizations committed to `dev` branch (commit: 240a763)
- ✅ Build successful locally
- ❌ Vercel only deploys from `main` branch (not `dev`)
- ❌ Environment variables need to be set on Vercel first

## Workflow

### Step 1: Set Environment Variables on Vercel (FIRST)
**Critical**: Do this BEFORE merging to main, so build succeeds on first try.

1. Go to: https://vercel.com/dashboard
2. Select: `shopify-ecommerce-docs` project
3. Go to: **Settings** → **Environment Variables**
4. Add these variables (set for `Production` + `Preview`):
   - `SHOPIFY_STORE_DOMAIN` = `odanree.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = [from your .env.local]
5. Click **Save**

### Step 2: Create Pull Request (Optional but Recommended)

Verify changes before merging to main:

```bash
gh pr create --base main --head dev
# Title: "perf: 70% LCP improvement - production ready"
```

Then review and approve the PR.

### Step 3: Merge Dev to Main

**Option A: Via GitHub CLI (Recommended)**
```bash
# Ensure you're on dev branch
git checkout dev
git pull origin dev

# Create PR (if not already created)
gh pr create --base main --head dev

# After approval, merge with squash (clean history)
gh pr merge --squash --delete-branch=false

# Sync local main
git checkout main
git pull origin main
```

**Option B: Via Git**
```bash
git checkout main
git pull origin main
git merge dev --no-ff
git push origin main
```

**Option C: Merge Commit (Keeps history)**
```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

### Step 4: Wait for Vercel Deployment

Once you push to `main`:
1. Vercel automatically detects the push
2. Build starts with environment variables configured
3. All 11 pages should generate successfully ✅
4. Deployment preview URL appears
5. Production deploys to https://danhle.net (CloudFront)

## Expected Timeline

| Step | Time |
|------|------|
| Set env vars on Vercel | 2 min |
| Create PR (if needed) | 1 min |
| Review PR | 2-5 min |
| Merge to main | 1 min |
| Vercel builds | 3-5 min |
| CloudFront invalidates | 1-2 min |
| **Total** | **10-16 min** |

## Verification After Deploy

```bash
# 1. Check Vercel deployment status
vercel ls

# 2. Visit production URL
# https://danhle.net

# 3. Run Lighthouse audit on production
# Chrome DevTools → Lighthouse → Generate report
# Expected: LCP < 2.5s, FCP < 1.8s
```

## Git Vercel Config (Reference)

File: `.config/vercel.json`
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,    ← Production auto-deploy
      "dev": false     ← Dev auto-deploy disabled
    }
  }
}
```

This is correct - main deploys to production, dev is for staging/testing only.

## Summary

1. ✅ Set env vars on Vercel (blocking issue)
2. ✅ Merge dev → main via PR (recommended)
3. ✅ Vercel auto-deploys to production
4. ✅ Test on production URL
5. ✅ Monitor Lighthouse metrics
