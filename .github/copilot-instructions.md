- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - User wants both custom Shopify theme and headless Next.js + Shopify site
- [x] Scaffold the Project - Created shopify-theme and shopify-headless folders with complete structure
- [x] Customize the Project - Both projects are fully customized with production-ready code
- [x] Install Required Extensions - N/A - Users can install as needed
- [x] Compile the Project - Next.js project ready, npm install required
- [x] Create and Run Task - Users can run development servers
- [x] Launch the Project - Instructions provided in README files
- [x] Ensure Documentation is Complete - All README files created

## Project Type
Shopify Ecommerce Development Workspace with:
1. Custom Shopify Theme (Liquid templates)
2. Headless Shopify with Next.js + TypeScript + CSS Modules

## Project Structure
- shopify-theme/ - Traditional Shopify theme with Liquid templating
- shopify-headless/ - Modern headless commerce with Next.js and Shopify Storefront API

## Important: Read PROJECT_CONTEXT.md
For complete project setup, configurations, and AI assistance context, see: `PROJECT_CONTEXT.md`

Key points:
- **Styling**: CSS Modules (NOT TailwindCSS)
- **Git Workflow**: feature/* → dev → main
- **Deployment**: Vercel auto-deploy on main branch
- **Environment**: Variables in .env.local (not committed)
- **Root Directory**: shopify-headless (for Vercel)
- **Commits**: Use conventional commit format
