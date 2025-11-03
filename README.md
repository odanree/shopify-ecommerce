# Shopify Ecommerce Development Workspace

A complete Shopify ecommerce development environment with two approaches: a traditional custom Shopify theme and a modern headless commerce solution.

## 🚀 Production Site

**Live Demo**: https://shopify-headless-8746.vercel.app/

Features:
- ✅ Family Plan Builder with real-time pricing
- ✅ Shopping cart with Context API state management
- ✅ Product pages with Shopify integration
- ✅ Cypress E2E testing (13+ tests)
- ✅ CI/CD with GitHub Actions + Vercel auto-deploy
- ✅ TypeScript type safety throughout

📖 **[Family Plan Documentation](./docs/FAMILY_PLAN_README.md)**

## 📁 Project Structure

This workspace contains two complete Shopify ecommerce implementations:

### 1. **shopify-theme/** - Custom Shopify Theme
Traditional Shopify theme using Liquid templating, perfect for stores that want full Shopify admin integration and traditional theme customization.

**Features:**
- Complete Shopify theme structure (Liquid templates)
- Customizable sections and snippets
- Theme settings for easy customization
- Product, collection, and cart pages
- Responsive design

[→ View shopify-theme README](./shopify-theme/README.md)

### 2. **shopify-headless/** - Headless Next.js + Shopify
Modern headless commerce solution using Next.js, TypeScript, and Shopify Storefront API for maximum flexibility and performance.

**Features:**
- Next.js 14 with App Router
- TypeScript for type safety
- CSS Modules for component-scoped styling
- Shopify Storefront API integration
- Shopping cart with Context API
- Cypress E2E testing
- CI/CD with GitHub Actions
- Vercel auto-deploy
- Optimized performance and SEO
- Full control over frontend

[→ View shopify-headless README](./shopify-headless/README.md)

## 🚀 Quick Start

### Option 1: Custom Shopify Theme

```bash
cd shopify-theme

# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Connect and start development
shopify theme dev --store your-store.myshopify.com
```

### Option 2: Headless Next.js Store

```bash
cd shopify-headless

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Shopify credentials

# Start development server
npm run dev
```

## 🤔 Which Approach Should I Use?

### Use **Custom Shopify Theme** if you:
- Want to use Shopify's native checkout
- Need Shopify admin theme customization
- Prefer working within Shopify's ecosystem
- Want merchants to customize via Shopify admin
- Are building for the Shopify Theme Store

### Use **Headless Next.js** if you:
- Need complete frontend control
- Want modern React development experience
- Need custom routing and page structures
- Require advanced performance optimization
- Want to integrate with multiple data sources
- Need custom user experiences beyond Shopify's capabilities

## 📋 Prerequisites

### For Shopify Theme:
- Shopify store (trial or paid account)
- Shopify CLI installed
- Node.js 18+

### For Headless Next.js:
- Shopify store with Storefront API access
- Node.js 18+
- Shopify Storefront API access token

## 🛠️ Development Tools

### Recommended VS Code Extensions:
- **Shopify Liquid** - Syntax highlighting and snippets for Liquid
- **ES7+ React/Redux/React-Native snippets** - For Next.js components
- **TypeScript** - TypeScript language support
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Cypress** - E2E testing support

## 📚 Documentation

- [Shopify Theme Development](https://shopify.dev/themes)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Cypress Documentation](https://docs.cypress.io)
- [Project Context](./PROJECT_CONTEXT.md) - Complete project reference
- [Deployment Guide](./shopify-headless/VERCEL_DEPLOYMENT.md)

## 🎯 Project Status

### Completed ✅
- Shopping cart functionality (Context API + cart page + E2E tests)
- Family Plan Builder (Liquid + React versions)
- Vercel auto-deploy configuration
- CI/CD with GitHub Actions + Cypress
- TypeScript type safety
- Production deployment: https://shopify-headless-8746.vercel.app/

### In Progress 🚧
- Jest/React Testing Library unit tests
- Storybook component library
- Product search functionality
- Collection pages

See [ROADMAP.md](./ROADMAP.md) for complete development plan

## 🎯 Next Steps

1. **View Live Site**: Visit https://shopify-headless-8746.vercel.app/
2. **Run Locally**: `cd shopify-headless && npm install && npm run dev`
3. **Run Tests**: `npm run test:e2e` (Cypress E2E tests)
4. **Read Documentation**: Check [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for setup details
5. **Start Development**: Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow

## 🆘 Getting Help

- [Shopify Community Forums](https://community.shopify.com/)
- [Shopify Dev Discord](https://discord.gg/shopifydevs)
- [Next.js Discord](https://nextjs.org/discord)

## 📄 License

MIT License - Free to use for your projects!

---

**Happy Building! 🎉**

Start with either `shopify-theme/` or `shopify-headless/` directory and follow their respective README files for detailed setup instructions.
