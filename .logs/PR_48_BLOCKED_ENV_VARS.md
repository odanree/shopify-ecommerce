# PR #48 - Checks Failing - Action Required

## Current Status: ❌ BLOCKED

### Check Results (Latest)
```
0 cancelled, 3 failing, 1 successful, 0 skipped, 0 pending checks

X  Vercel                                Deployment has failed
X  E2E Tests/cypress-run (push)          Failed (2m2s)
X  E2E Tests/cypress-run (pull_request)  Failed (2m6s)
✓  Vercel Preview Comments               Success
```

## Root Cause

**Missing Shopify Environment Variables on Vercel** 🔴

The Vercel build fails with:
```
Error: Missing required environment variables: 
SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

This cascade failure causes:
1. ✗ Vercel preview deployment fails
2. ✗ E2E tests fail (can't connect to broken preview + missing env vars)
3. ✗ Cannot merge to main until all checks pass

## How to Fix

### Step 1: Set Environment Variables on Vercel (CRITICAL)

**Go to**: https://vercel.com/dashboard

1. Select project: **shopify-headless**
2. Click: **Settings** tab
3. Navigate to: **Environment Variables**

### Step 2: Add Shopify Credentials

Add these **TWO** variables (one at a time):

#### Variable 1: Store Domain
- **Name**: `SHOPIFY_STORE_DOMAIN`
- **Value**: `odanree.myshopify.com`
- **Environments**: Check `Production` and `Preview`
- Click **Add**

#### Variable 2: Storefront Token
- **Name**: `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Value**: [Your token from `.env.local`]
- **Environments**: Check `Production` and `Preview`
- Click **Add**

### Step 3: Trigger Rebuild

Option A (Manual):
```bash
vercel redeploy
```

Option B (Auto):
```bash
# Push any commit to trigger rebuild
git push origin dev
```

Option C (GitHub UI):
- Go to PR #48
- Click the failed Vercel check
- Click "Redeploy" button

## Expected Outcome

Once env vars are set and rebuild completes:

1. ✅ Vercel build succeeds
2. ✅ E2E tests pass
3. ✅ All checks green
4. ✅ PR ready to merge

## Timeline

```
Current: 23:22 UTC
- Vercel build: FAILED (env vars missing)
- E2E Tests: FAILED (cascade failure)
- Status: BLOCKED

After setting env vars:
- Vercel rebuild: ~3-5 min
- E2E tests run: ~2-5 min
- All checks pass: ~10 min total
- Ready to merge: Automatic
```

## Next Step for Agent

Once you set the env vars on Vercel:
1. Monitor will automatically detect check status change
2. When all checks ✅ pass
3. Execute: `gh pr merge 48 --squash --delete-branch=false`
4. Triggers production deployment to `main`

**Currently Waiting**: For you to set Shopify env vars on Vercel

---

**PR #48**: "perf: 70% LCP improvement - SSR carousel, inline CSS, bundle optimization"
**Blocked By**: Missing SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN on Vercel
