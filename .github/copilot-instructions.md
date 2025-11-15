- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - User wants both custom Shopify theme and headless Next.js + Shopify site
- [x] Scaffold the Project - Created shopify-theme and shopify-headless folders with complete structure
- [x] Customize the Project - Both projects are fully customized with production-ready code
- [x] Install Required Extensions - N/A - Users can install as needed
- [x] Compile the Project - Next.js project ready, npm install required
- [x] Create and Run Task - Users can run development servers
- [x] Launch the Project - Instructions provided in README files
- [x] Ensure Documentation is Complete - All README files created

## ⚠️ CRITICAL: PowerShell Syntax for All Commands

**ALWAYS use PowerShell syntax for terminal commands:**
- ✅ Use `|` for piping and `Select-Object`, `Select-String` for filtering
- ✅ Use `;` to separate commands on one line: `git add file.ts; git commit -m "msg"`
- ✅ Use PowerShell path separators: `\` (backslashes) or `/` (forward slashes work too)
- ✅ Use `$LASTEXITCODE` instead of `$?` for exit code checks
- ✅ Use `Start-Sleep -Seconds 5` instead of `sleep 5`
- ❌ **NEVER** use Unix/bash commands: `head`, `tail`, `grep`, `sed`, `awk`
- ❌ **NEVER** use pipes like `| head -20` (bash syntax)

**PowerShell Equivalent Commands:**
| Bash | PowerShell |
|------|-----------|
| `grep pattern file` | `Select-String -Pattern "pattern" file` |
| `\| head -20` | `\| Select-Object -First 20` |
| `\| tail -20` | `\| Select-Object -Last 20` |
| `ls -la` | `Get-ChildItem -Force` or `dir` |
| `cat file` | `Get-Content file` or `cat file` |
| `export VAR=value` | `$env:VAR = "value"` |
| `sleep 5` | `Start-Sleep -Seconds 5` |
| `&& next_cmd` | `; next_cmd` |

## Project Type
Shopify Ecommerce Development Workspace with:
1. Custom Shopify Theme (Liquid templates)
2. Headless Shopify with Next.js + TypeScript + CSS Modules

## Project Structure
```
shopify-ecommerce-docs/          # Repository root
├── vercel.json                  # ⚠️ CRITICAL - Vercel reads THIS file (repository root)
├── shopify-theme/               # Traditional Shopify theme with Liquid templating
└── shopify-headless/            # Headless commerce with Next.js
    ├── package.json
    ├── app/
    ├── components/
    └── ...
```

**⚠️ CRITICAL: Vercel Configuration**
- **vercel.json MUST be at REPOSITORY ROOT** (not in subdirectories)
- Vercel only reads `./vercel.json` at the repository root
- Configuration includes:
  - `"dev": false` - Prevents deployments on dev branch (IMPORTANT)
  - `"productionBranch": "main"` - Only main branch deploys to production
  - Build commands: `cd shopify-headless && npm run build`
  - Root directory setting in Vercel dashboard: `shopify-headless/`
- **NEVER move vercel.json to `.config/` or `shopify-headless/`** - It will be ignored
- If deployments are happening on unexpected branches, verify:
  1. `vercel.json` exists at repository root with `"dev": false`
  2. Vercel dashboard Root Directory is set to `shopify-headless/`
  3. Check git status: `git ls-files vercel.json` (must show `vercel.json` at root)

## Important: Read PROJECT_CONTEXT.md
For complete project setup, configurations, and AI assistance context, see: `PROJECT_CONTEXT.md`

Key points:
- **Styling**: CSS Modules (NOT TailwindCSS) - Tailwind dependencies removed from package.json
  - ⚠️ **DO NOT add back**: tailwindcss, autoprefixer, postcss
  - ⚠️ **DO NOT create**: tailwind.config.js or postcss.config.js
  - All styling uses custom CSS in `app/globals.css` and CSS Modules
- **Git Workflow**: See `.github/BRANCHING_STRATEGY.md` for complete workflow
  - feature/* → dev → main
  - Use "Squash and merge" for PRs (NOT regular merge)
  - Protected main branch requires PRs
- **Deployment**: Vercel auto-deploy on main branch
- **Environment**: Variables in .env.local (not committed)
  - ✅ SHOPIFY_ADMIN_API_TOKEN - Already configured for Admin API access
  - ✅ SHOPIFY_STOREFRONT_ACCESS_TOKEN - For frontend product queries
  - ✅ SHOPIFY_LOCATION_ID - 80318955565 (470 S Alpine Rd)
  - ✅ SHOPIFY_STORE_DOMAIN - odanree.myshopify.com
- **Root Directory**: shopify-headless (for Vercel)
- **Commits**: Use conventional commit format
- **Products**: 10 tech-themed t-shirts live on production (420 variants, 100 units each)
- **Sales Channel**: Products must be published to "headless storefront" channel to appear in Storefront API

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
2. Create PR from dev → main: `gh pr create --base main --head dev`
3. **⚠️ WAIT for CI/CD to complete** (CRITICAL - DO NOT skip):
   - Check status: `gh pr checks <PR_NUMBER>`
   - Cypress E2E tests must pass ✓
   - Vercel preview deployment must succeed ✓
   - All checks must show ✓ before merging
   - Typical wait time: 2-5 minutes
4. **After ALL checks pass ✓**, merge with squash: `gh pr merge <PR_NUMBER> --squash --delete-branch=false`
5. After merge, sync dev: `git checkout dev && git pull origin main && git push origin dev`

### CI/CD Pipeline (CRITICAL)
**NEVER merge a PR before CI/CD completes!**

Every PR triggers:
- ✅ Cypress E2E tests (cart, products, homepage)
- ✅ Vercel preview deployment
- ✅ TypeScript compilation check
- ✅ Build verification

**To check CI/CD status:**
```bash
gh pr checks <PR_NUMBER>
```

**Wait until you see:**
```
All checks have passed
✓ E2E Tests/cypress-run (pull_request)
✓ Vercel
✓ Vercel Preview Comments
```

**Common CI/CD wait times:**
- Vercel deployment: ~1-2 minutes
- Cypress E2E tests: ~2-4 minutes
- Total: ~3-5 minutes

### Product Management Scripts (shopify-headless/scripts/)
- `create-products.ts` - Mass create 10 tech-themed t-shirts with variants
- `publish-to-channel.ts` - Publish products to "headless storefront" sales channel
- `verify-products.ts` - Verify products are visible in Storefront API
- `test-storefront-api.ts` - Comprehensive API diagnostics
- `delete-products.ts` - Bulk delete all products (use with caution)
- See scripts/README.md for detailed documentation

### Critical: TypeScript in Scripts
- All scripts must have explicit type annotations
- Example: `const url: string = ...` not `const url = ...`
- Next.js build runs TypeScript checks on ALL .ts files including scripts/
- Build will fail if implicit types are detected

### Documentation Policy
- ⚠️ **DO NOT** create summary/completion/status report files after every prompt
- ⚠️ **DO NOT** create separate session summary files
- ⚠️ **DO NOT** create temporary documentation unless explicitly requested
- ✅ **DO** update existing documentation only when necessary
- ✅ **DO** keep responses concise and focused on implementation
- ✅ **DO** only create documentation when user explicitly asks for it
- When tasks are complete: provide brief confirmation, no automatic summary files
