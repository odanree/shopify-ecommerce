# Shopify Ecommerce Development Workspace

A complete Shopify ecommerce development environment with two approaches: a traditional custom Shopify theme and a modern headless commerce solution.

## 🆕 Latest Addition: Family Plan Builder

**Inspired by Ultra Mobile** - A production-ready family plan builder component available in both Shopify Liquid and Next.js React!

📖 **[View Family Plan Builder Documentation](./FAMILY_PLAN_README.md)**  
🚀 **[Quick Start Guide](./FAMILY_PLAN_QUICK_START.md)**  
📊 **[Complete Implementation Summary](./FAMILY_PLAN_IMPLEMENTATION_SUMMARY.md)**

**Features:**
- ✅ Dynamic line management (add up to 5 lines)
- ✅ SIM/eSIM variant selection per line
- ✅ Real-time price calculations with savings display
- ✅ Fully responsive and accessible (WCAG 2.1 AA)
- ✅ Production-ready with complete documentation
- ✅ Available in both Liquid and React/TypeScript

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
- TailwindCSS for styling
- Shopify Storefront API integration
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
- **Tailwind CSS IntelliSense** - For TailwindCSS autocomplete
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📚 Documentation

- [Shopify Theme Development](https://shopify.dev/themes)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🎯 Next Steps

1. **Set up Shopify Store**: Create a development store at [partners.shopify.com](https://partners.shopify.com)
2. **Choose Your Approach**: Pick traditional theme or headless
3. **Configure Environment**: Follow the README in your chosen directory
4. **Start Building**: Customize the templates and components
5. **Deploy**: Push to production when ready

## 🆘 Getting Help

- [Shopify Community Forums](https://community.shopify.com/)
- [Shopify Dev Discord](https://discord.gg/shopifydevs)
- [Next.js Discord](https://nextjs.org/discord)

## 📄 License

MIT License - Free to use for your projects!

---

**Happy Building! 🎉**

Start with either `shopify-theme/` or `shopify-headless/` directory and follow their respective README files for detailed setup instructions.
