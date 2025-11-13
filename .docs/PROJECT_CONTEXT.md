# Project Context & Configuration

> **Purpose**: This file tracks project setup, configurations, and workflows for AI assistance and developer reference.

---

## 🏗️ Project Overview

**Project Name**: Shopify E-commerce (Dual Approach)  
**Repository**: https://github.com/odanree/shopify-ecommerce  
**Owner**: odanree  
**Created**: October 2025  
**Last Updated**: November 6, 2025  
**Production URL**: https://shopify-headless-lemon.vercel.app

**Performance Metrics** (Lighthouse Mobile):
- ✅ Cumulative Layout Shift: 0.028 (99.9% improvement from 25)
- ✅ Total Blocking Time: 0ms (eliminated from 680ms)
- ✅ First Contentful Paint: 1.2s
- ✅ Largest Contentful Paint: 1.2s
- ✅ Speed Index: 1.2s

**Optimizations Applied**:
- Code splitting with dynamic imports (ChatWidget, FamilyPlanBuilder, FamilyPlanPromo)
- Webpack optimization with custom chunk splitting
- Image optimization with sizes attributes
- Font optimization (display: swap, preload)
- Async resource loading for third-party scripts
- Layout stability with reserved spaces and min-heights

### Project Structure
```
Jobsearch/
├── shopify-theme/          # Custom Shopify Liquid theme
└── shopify-headless/       # Next.js headless storefront
```

---

## 🔐 Environment Variables

### Shopify Headless (.env.local)
```bash
# Location: shopify-headless/.env.local (NOT committed to git)

SHOPIFY_STORE_DOMAIN=odanree.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=a9657ef8b2c6699c5fc6f7230c3ffdc1
```

### Vercel Environment Variables
**Configured in Vercel Dashboard:**
- `SHOPIFY_STORE_DOMAIN` = `odanree.myshopify.com`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = `a9657ef8b2c6699c5fc6f7230c3ffdc1`

**Environments**: Production, Preview, Development (all enabled)

---

## 🌿 Git Workflow

### Branch Strategy
```
main (production)
  ↑
dev (development/staging)
  ↑
feature/* (feature branches)
```

### Workflow
1. Create feature branch from `dev`
2. Work on feature and commit
3. Push feature branch to GitHub
4. Create PR: `feature/xxx` → `dev`
5. Merge to `dev` for testing
6. Create PR: `dev` → `main` for production
7. Merge to `main` triggers Vercel deploy

### Current Branches
- ✅ `main` - Production branch (protected, requires PR)
- ✅ `dev` - Development/staging branch
- ✅ `feat/vercel-auto-deploy` - Recently merged

### Conventional Commits
**Format**: `type(scope): description`

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance
- `ci:` - CI/CD changes

**Example**:
```bash
git commit -m "feat(headless): add shopping cart component

- Implement cart drawer UI
- Add cart context provider
- Integrate with Shopify API

Refs #3"
```

---

## 🚀 Deployment

### Vercel Configuration

**Status**: ✅ Active and deployed

**Production Branch**: `main`  
**Root Directory**: `shopify-headless`  
**Framework**: Next.js  
**Deploy Method**: One-click deploy (completed)

**Build Settings**:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

**URLs**:
- Production: https://shopify-headless-lemon.vercel.app
- Preview: Disabled (production-only deployments)

**Auto-Deploy**:
- ✅ Push to `main` → Production deploy
- ❌ Preview deployments disabled via `ignoreCommand`
- ✅ Create PR → Preview deploy
- ✅ GitHub integration active

---

## 🛠️ Tech Stack

### Shopify Headless
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (NOT TailwindCSS)
- **API**: Shopify Storefront API (GraphQL)
- **Deployment**: Vercel

### Shopify Theme
- **Template Engine**: Liquid
- **Language**: JavaScript, HTML, CSS
- **Deployment**: Shopify CLI

### Development Tools
- **Node.js**: 18+
- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **IDE**: VS Code
- **Shopify CLI**: Installed

---

## 📂 Key Files & Directories

### Configuration Files
```
.gitignore                               # Git ignore rules
.gitmessage                              # Commit message template
CONTRIBUTING.md                          # Contribution guidelines
ROADMAP.md                               # Development roadmap
PROJECT_STATUS.md                        # Current project status
PROJECT_CONTEXT.md                       # This file

shopify-headless/
├── .env.local                          # Environment variables (NOT in git)
├── vercel.json                         # Vercel configuration
├── .vercelignore                       # Vercel deployment exclusions
├── next.config.js                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies
├── VERCEL_DEPLOYMENT.md                # Deployment guide
├── VERCEL_QUICK_START.md               # Quick reference
└── VERCEL_SETUP_SUMMARY.md             # Setup overview
```

### Important Directories
```
shopify-headless/
├── app/                                # Next.js pages (App Router)
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Homepage
│   ├── products/                      # Product pages
│   ├── cart/                          # Cart page
│   └── api/                           # API routes
├── components/                         # React components
├── lib/                                # Utilities and API clients
├── types/                              # TypeScript definitions
└── public/                             # Static assets
```

---

## 🎯 Current Development Status

### Completed ✅
- [x] Project scaffolding
- [x] Next.js 14 setup with TypeScript
- [x] Shopify Storefront API integration
- [x] CSS Modules styling implementation
- [x] Vercel auto-deploy configuration
- [x] CI/CD pipeline setup
- [x] Complete deployment documentation (750+ lines)
- [x] Initial Vercel deployment
- [x] Shopping cart functionality (CartContext, cart page, localStorage)
- [x] Product search (SearchBar component, search page, API integration)
- [x] Collection pages (listing, detail pages, E2E tests)
- [x] Comprehensive test suite (109 tests, 55.18% coverage)
- [x] SEO optimization (metadata, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt)

### In Progress 🚧
- [ ] Newsletter integration
- [ ] Performance optimization

### Pending ⏳
- [ ] Customer authentication
- [ ] Product reviews
- [ ] Newsletter integration
- [ ] SEO optimization
- [ ] Performance optimization

---

## 📦 NPM Scripts

### Shopify Headless
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run cypress          # Open Cypress (if installed)
npm run cypress:headless # Run Cypress headless
```

---

## 🔑 API Integration

### Shopify Storefront API

**Version**: 2024-01  
**Type**: GraphQL  
**Endpoint**: `https://odanree.myshopify.com/api/2024-01/graphql.json`

**Authentication**:
- Header: `X-Shopify-Storefront-Access-Token`
- Value: From `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

**Client**: `lib/shopify.ts`

**Available Operations**:
- ✅ Fetch products
- ✅ Fetch single product
- ✅ Create cart
- ✅ Add to cart
- ✅ Update cart
- ✅ Search products
- ✅ Fetch collections
- ✅ Fetch collection products

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- CSS Modules for component styling
- Functional components with hooks
- Server Components by default (Next.js App Router)
- Client Components only when needed

### File Naming
- Components: PascalCase (e.g., `ProductCard.tsx`)
- CSS Modules: PascalCase (e.g., `ProductCard.module.css`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Types: PascalCase (e.g., `ShopifyProduct`)

### Component Structure
```typescript
// MyComponent.tsx
import styles from './MyComponent.module.css';

export default function MyComponent() {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
```

---

## 🐛 Known Issues

1. **Theme CLI Authentication**
   - Issue: Cannot authenticate Shopify CLI with theme
   - Workaround: Using headless approach instead
   - Status: Not blocking, low priority

2. **No Current Blockers**
   - All critical functionality working

---

## 📚 Documentation

### Internal Docs
- `README.md` - Main project overview
- `shopify-headless/README.md` - Headless app documentation
- `shopify-theme/README.md` - Theme documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `ROADMAP.md` - Development roadmap
- `PROJECT_STATUS.md` - Current status

### Deployment Docs
- `shopify-headless/VERCEL_DEPLOYMENT.md` - Complete guide
- `shopify-headless/VERCEL_QUICK_START.md` - Quick reference
- `shopify-headless/VERCEL_SETUP_SUMMARY.md` - Overview

### External Resources
- [Shopify Theme Docs](https://shopify.dev/themes)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

---

## 🤖 AI Assistant Context

### What AI Should Know

**When working with this project:**
1. Use CSS Modules, NOT TailwindCSS
2. Follow conventional commit format
3. Work on feature branches, merge to `dev` first
4. Root directory for headless app is `shopify-headless`
5. Environment variables are in `.env.local` (not in git)
6. TypeScript is required for all new code
7. Use Next.js App Router patterns (not Pages Router)

**Common Tasks:**
- Creating new components → Use TypeScript + CSS Modules
- Adding features → Create feature branch from `dev`
- Shopify API calls → Use `lib/shopify.ts` client
- Styling → Use CSS Modules, no inline styles
- Testing → Check `npm run dev` works before committing

**Files NOT to Modify:**
- `.env.local` (user-specific)
- `node_modules/` (generated)
- `.next/` (build output)
- `.vercel/` (deployment cache)

---

## 🔄 Recent Changes

### November 2, 2025
- ✅ Configured Vercel auto-deploy
- ✅ Created deployment documentation (750+ lines)
- ✅ Completed initial Vercel deployment
- ✅ Updated all documentation
- ✅ Removed TailwindCSS references (using CSS Modules)
- 🔄 Testing auto-deploy workflow (PR to main pending)

---

## 📞 Support & Resources

**GitHub Issues**: Use issue templates in `.github/ISSUE_TEMPLATE/`  
**Shopify Store**: odanree.myshopify.com  
**Vercel Dashboard**: https://vercel.com/dashboard  

---

**Last Updated**: November 2, 2025  
**Next Review**: After auto-deploy verification
