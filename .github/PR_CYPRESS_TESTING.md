# Cypress E2E Testing & GitHub Actions CI

## 📋 Description
Adds comprehensive end-to-end testing with Cypress and automated CI/CD pipeline using GitHub Actions. Tests will run automatically on every PR and must pass before approval.

## ✨ Changes

### 🧪 E2E Tests Added
- **Homepage Tests** (`homepage.cy.ts`)
  - Hero section display
  - CTA button functionality
  - Family Plan promo section
  - Featured products loading
  - Navigation
  - Mobile responsiveness
  
- **Family Plan Builder Tests** (`family-plan.cy.ts`)
  - Page loading
  - Member selector
  - Device selection
  - Price calculation
  
- **Shopping Cart Tests** (`cart.cy.ts`)
  - Cart link visibility
  - Navigation to cart
  - Empty cart state

### ⚙️ Configuration
- **Cypress Config** (`cypress.config.ts`)
  - Base URL: `http://localhost:3001`
  - Viewport: 1280x720
  - Screenshot on failure enabled
  
- **GitHub Actions** (`.github/workflows/cypress.yml`)
  - Triggers on PR to `dev`/`main`
  - Runs on Ubuntu with Chrome
  - Uploads screenshots/videos on failure
  - **Required status check for PR approval**

### 📦 Dependencies
- `cypress@^15.5.0` - E2E testing framework
- `start-server-and-test` - Utility to start server before tests
- `@cypress/webpack-dev-server` - Dev server integration

### 📝 Scripts Added
```json
{
  "cypress": "cypress open",              // Interactive mode
  "cypress:headless": "cypress run",      // Headless CLI
  "test:e2e": "start-server-and-test...", // Dev server tests
  "test:e2e:ci": "start-server-and-test..." // Production build tests
}
```

## 🎯 Benefits

1. **Quality Assurance** - Catch bugs before they reach production
2. **Automated Testing** - No manual testing needed on each PR
3. **Confidence** - Know that critical flows work before merging
4. **Documentation** - Tests serve as living documentation
5. **CI/CD Integration** - Tests run automatically in pipeline
6. **Visual Debugging** - Screenshots and videos on failure

## 🚀 Usage

### Run Tests Locally
```bash
# Interactive mode (recommended for development)
npm run cypress

# Headless mode (CLI)
npm run test:e2e
```

### CI/CD Pipeline
- **Automatic**: Tests run on every PR
- **Required**: PRs cannot be merged until tests pass
- **Artifacts**: Screenshots and videos uploaded on failure
- **Status**: Check status in PR checks section

## 🧪 Test Coverage

### Current Coverage
- ✅ Homepage (6 tests)
- ✅ Family Plan Builder (4 tests)
- ✅ Shopping Cart (3 tests)

### Future Tests (TODO)
- [ ] Product detail page
- [ ] Add to cart functionality
- [ ] Checkout flow (if applicable)
- [ ] Search functionality
- [ ] Filter/sort products

## 📊 CI Pipeline Flow

```
PR Created/Updated
    ↓
GitHub Actions Triggered
    ↓
Install Dependencies
    ↓
Build Next.js App
    ↓
Start Production Server
    ↓
Run Cypress Tests
    ↓
Upload Artifacts (if failed)
    ↓
✅ Pass → Merge allowed
❌ Fail → Fix required
```

## 🔧 Configuration Details

### Environment Variables Required (GitHub Secrets)
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

⚠️ **Note**: Make sure these are set in GitHub repository secrets!

### Branch Protection Update Needed
After merging, update branch protection rules:
1. Go to Settings → Branches
2. Edit rule for `main`/`dev`
3. Check "Require status checks to pass"
4. Select "E2E Tests / cypress-run"

## 📝 Files Changed

```
.github/
├── workflows/
│   └── cypress.yml (new)
shopify-headless/
├── cypress/
│   ├── e2e/
│   │   ├── homepage.cy.ts (new)
│   │   ├── family-plan.cy.ts (new)
│   │   └── cart.cy.ts (new)
│   ├── support/
│   │   ├── e2e.ts (new)
│   │   └── commands.ts (new)
│   └── README.md (new)
├── cypress.config.ts (new)
├── .gitignore (modified)
├── package.json (modified)
└── package-lock.json (modified)
```

## ✅ Checklist

- [x] Cypress installed and configured
- [x] E2E tests created for critical flows
- [x] GitHub Actions workflow configured
- [x] Test scripts added to package.json
- [x] Documentation created (cypress/README.md)
- [x] .gitignore updated for Cypress artifacts
- [x] Tests pass locally
- [ ] GitHub secrets configured (SHOPIFY vars)
- [ ] Branch protection updated (after merge)

## 🐛 Known Issues

None currently. If Cypress tests fail in CI but pass locally, check:
- Environment variables are set in GitHub secrets
- Base URL matches the server port
- Timeouts are sufficient for API calls

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io)
- [GitHub Actions for Cypress](https://github.com/cypress-io/github-action)
- [Testing Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Merge into:** `dev`  
**Type:** Feature  
**Breaking Changes:** None  
**Requires:** GitHub secrets configuration
