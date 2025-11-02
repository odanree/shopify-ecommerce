# Cypress E2E Testing

## 🧪 Overview

This project uses Cypress for end-to-end testing to ensure all features work correctly before deployment.

## 📁 Test Structure

```
cypress/
├── e2e/
│   ├── homepage.cy.ts       # Homepage tests
│   ├── family-plan.cy.ts    # Family plan builder tests
│   └── cart.cy.ts           # Shopping cart tests
└── support/
    ├── e2e.ts               # Test configuration
    └── commands.ts          # Custom commands
```

## 🚀 Running Tests

### Interactive Mode (Development)
```bash
npm run cypress
```
Opens Cypress Test Runner for interactive testing and debugging.

### Headless Mode (CLI)
```bash
npm run cypress:headless
```
Runs all tests in headless mode (no GUI).

### With Dev Server
```bash
npm run test:e2e
```
Starts dev server automatically and runs tests.

### CI Mode (Production Build)
```bash
npm run test:e2e:ci
```
Builds the app and runs tests against production build.

## 🔄 CI/CD Integration

Tests run automatically on every PR via GitHub Actions:
- **Trigger**: Push to `dev` or `main`, or PR to these branches
- **Environment**: Ubuntu with Chrome browser
- **Artifacts**: Screenshots (on failure) and videos uploaded
- **Status Check**: Required for PR approval

## ✅ Test Coverage

### Homepage Tests
- ✅ Hero section displays correctly
- ✅ CTA buttons are visible and functional
- ✅ Family Plan promo section renders
- ✅ Featured products load
- ✅ Navigation works
- ✅ Responsive on mobile

### Family Plan Builder Tests
- ✅ Page loads correctly
- ✅ Member selector works
- ✅ Device selection functions
- ✅ Price calculation displays

### Cart Tests
- ✅ Cart link visible in header
- ✅ Navigation to cart page works
- ✅ Empty cart state displays

## 🎯 Best Practices

### Writing Tests
- Use data attributes for stable selectors: `data-cy="element-name"`
- Keep tests independent and isolated
- Use `beforeEach` to reset state
- Add meaningful assertions

### Debugging
```bash
npm run cypress
```
- Use `.debug()` command: `cy.get('.element').debug()`
- Add `cy.pause()` to stop execution
- Use Time Travel feature in Test Runner

## 📝 Adding New Tests

1. Create test file in `cypress/e2e/`:
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/path')
  })

  it('should do something', () => {
    cy.contains('Expected Text').should('be.visible')
  })
})
```

2. Run locally:
```bash
npm run test:e2e
```

3. Push - tests run automatically in CI

## 🔧 Configuration

Edit `cypress.config.ts` to modify:
- Base URL
- Viewport size
- Video/screenshot settings
- Timeouts

## 📊 Test Reports

### Local
- View results in Terminal
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`

### CI/CD
- View in GitHub Actions tab
- Download artifacts from workflow run
- Check status in PR checks

## 🐛 Troubleshooting

### Tests failing locally but passing in CI?
- Clear Cypress cache: `npx cypress cache clear`
- Delete `node_modules` and reinstall: `npm ci`

### Timeout errors?
- Increase timeout in test: `cy.get('.element', { timeout: 10000 })`
- Check if server is running: `http://localhost:3001`

### Element not found?
- Use Cypress selector playground
- Check if element is in viewport
- Wait for API calls: `cy.wait()`

## 🎓 Resources

- [Cypress Docs](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Examples](https://github.com/cypress-io/cypress-example-recipes)

---

**Happy Testing! 🚀**
