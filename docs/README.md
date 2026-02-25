# 📚 Documentation

Complete guide to Shopify Headless Ecommerce features, setup, and testing.

---

## 🧪 Testing & Quality Assurance

### **Playwright E2E Testing** (NEW!)
- **[Getting Started](./PLAYWRIGHT_GETTING_STARTED.md)** - Quick start guide for running tests locally
- **[Selectors & Best Practices](./PLAYWRIGHT_SELECTORS.md)** - Using `data-testid` for stable test selectors
- **[Migration Plan](./PLAYWRIGHT_MIGRATION_PLAN.md)** - Complete Cypress → Playwright migration strategy (reference)
- **[PR Merge Guide](./PR_MERGE_GUIDE.md)** - Instructions for merging the Playwright test suite

**Status:** ✅ 72/72 tests passing (100%)

### Performance & Optimization
- **[Lighthouse Optimization](./LIGHTHOUSE_OPTIMIZATION.md)** - Performance audit improvements

---

## 🛒 Feature Documentation

### Stripe Payment Integration
- **[Stripe Setup Guide](./STRIPE_SETUP.md)** - Configure Stripe webhooks locally
- **[Stripe Checkout Guide](./STRIPE_CHECKOUT_GUIDE.md)** - Payment flow architecture and implementation

### AI Chatbot
- **[Chatbot Documentation](./CHATBOT.md)** - GPT-4 powered product search and recommendations

---

## 📖 Architecture & Setup

### Reference Documentation
See `reference/` folder for detailed API and architecture documentation.

### Deployment Guides
See `deployment/` folder for production deployment instructions.

### Setup Instructions
See `setup/` folder for local development environment setup.

### Architecture Diagrams
See `architecture/` folder for system architecture diagrams and flows.

---

## 🎯 Quick Links

| Task | Document |
|------|----------|
| Run E2E tests locally | [PLAYWRIGHT_GETTING_STARTED.md](./PLAYWRIGHT_GETTING_STARTED.md) |
| Add test selectors to components | [PLAYWRIGHT_SELECTORS.md](./PLAYWRIGHT_SELECTORS.md) |
| Merge Playwright PR | [PR_MERGE_GUIDE.md](./PR_MERGE_GUIDE.md) |
| Setup Stripe webhooks | [STRIPE_SETUP.md](./STRIPE_SETUP.md) |
| Understand payment flow | [STRIPE_CHECKOUT_GUIDE.md](./STRIPE_CHECKOUT_GUIDE.md) |
| Enable AI chatbot | [CHATBOT.md](./CHATBOT.md) |
| Optimize performance | [LIGHTHOUSE_OPTIMIZATION.md](./LIGHTHOUSE_OPTIMIZATION.md) |

---

## 📁 Directory Structure

```
docs/
├── README.md                              ← You are here
├── PLAYWRIGHT_GETTING_STARTED.md          ← Test quick start
├── PLAYWRIGHT_SELECTORS.md                ← Selector patterns
├── PLAYWRIGHT_MIGRATION_PLAN.md           ← Migration reference
├── PR_MERGE_GUIDE.md                      ← PR instructions
├── STRIPE_SETUP.md                        ← Webhook setup
├── STRIPE_CHECKOUT_GUIDE.md               ← Payment architecture
├── CHATBOT.md                             ← AI assistant
├── LIGHTHOUSE_OPTIMIZATION.md             ← Performance
├── DOCUMENTATION.md                       ← General docs overview
│
├── architecture/                          ← System design
│   ├── checkout-flow.md
│   ├── webhook-handshake.md
│   └── ...
│
├── deployment/                            ← Production deployment
│   ├── vercel.md
│   ├── environment-variables.md
│   └── ...
│
├── guides/                                ← How-to guides
│   ├── local-setup.md
│   ├── contributing.md
│   └── ...
│
├── reference/                             ← API reference
│   ├── stripe-api.md
│   ├── shopify-api.md
│   └── ...
│
└── setup/                                 ← Development setup
    ├── prerequisites.md
    ├── installation.md
    └── ...
```

---

## 🚀 Getting Started

### First Time?
1. Read `README.md` (root level) for project overview
2. Follow setup steps in `setup/` folder
3. Run E2E tests: [PLAYWRIGHT_GETTING_STARTED.md](./PLAYWRIGHT_GETTING_STARTED.md)

### Developing?
1. Check relevant feature docs above
2. Use `data-testid` selectors: [PLAYWRIGHT_SELECTORS.md](./PLAYWRIGHT_SELECTORS.md)
3. Run tests frequently to catch regressions

### Deploying?
1. See `deployment/` folder for production steps
2. Verify all tests pass locally
3. Push to main branch

---

## 📊 Project Status

| Component | Status | Docs |
|-----------|--------|------|
| **Testing** | ✅ 72/72 tests passing | [PLAYWRIGHT_GETTING_STARTED.md](./PLAYWRIGHT_GETTING_STARTED.md) |
| **Stripe** | ✅ Production ready | [STRIPE_SETUP.md](./STRIPE_SETUP.md) |
| **Shopify** | ✅ Integrated | [STRIPE_CHECKOUT_GUIDE.md](./STRIPE_CHECKOUT_GUIDE.md) |
| **Chatbot** | ✅ Optional feature | [CHATBOT.md](./CHATBOT.md) |
| **Performance** | ✅ Optimized | [LIGHTHOUSE_OPTIMIZATION.md](./LIGHTHOUSE_OPTIMIZATION.md) |

---

**Last Updated:** February 25, 2026  
**Status:** ✅ Current & Maintained
