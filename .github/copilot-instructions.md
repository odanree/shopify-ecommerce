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
- **Git Workflow**: See `.github/BRANCHING_STRATEGY.md` for complete workflow
  - feature/* → dev → main
  - Use "Squash and merge" for PRs (NOT regular merge)
  - Protected main branch requires PRs
- **Deployment**: Vercel auto-deploy on main branch
- **Environment**: Variables in .env.local (not committed)
- **Root Directory**: shopify-headless (for Vercel)
- **Commits**: Use conventional commit format

## Git Workflow (CRITICAL)
Read `.github/BRANCHING_STRATEGY.md` for complete details.

### Branch Structure
- `main` - Protected, production-ready code only
- `dev` - Default development branch (always work here)
- `feature/*`, `fix/*`, `refactor/*`, `chore/*` - Feature branches

### PR Merge Strategy (IMPORTANT)
When merging PRs to main:
- ✅ Use "Squash and merge" (creates clean commit: `feat: description (#20)`)
- ❌ DO NOT use "Merge pull request" (creates: `Merge pull request #20 from odanree/dev`)

### Workflow Steps
1. Make changes on dev or feature branch
2. Create PR from dev → main
3. Wait for CI/CD (Cypress E2E tests) to pass
4. Use "Squash and merge" when merging
5. After merge, sync dev: `git pull origin main`
