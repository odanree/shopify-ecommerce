# Modern Homepage - Quick Commands

## Installation & Setup

```powershell
# Navigate to project
cd C:\Users\Danh\Desktop\shopify-ecommerce-docs\shopify-headless

# Install dependencies (includes framer-motion)
npm install

# Start development server
npm run dev

# Open browser
Start-Process http://localhost:3000
```

## Testing

```powershell
# Run Cypress tests (interactive)
npm run cypress

# Run Cypress tests (headless)
npm run cypress:headless

# Run specific test file
npm run cypress -- --spec "cypress/e2e/homepage.cy.ts"

# Run with coverage
npm test -- --coverage
```

## Development

```powershell
# Start dev server with watch
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint

# Format code (if configured)
npm run format
```

## Deployment

```powershell
# Deploy to Vercel
vercel --prod

# Or use git workflow
git add .
git commit -m "feat: add modern homepage with carousel"
git push origin dev
# Then create PR in GitHub UI

# Check deployment status
gh pr checks <PR_NUMBER>

# Merge PR with squash
gh pr merge <PR_NUMBER> --squash --delete-branch=false
```

## File Structure

```powershell
# View component
cat components/HeroCarousel.tsx

# View styles
cat components/HeroCarousel.module.css

# View updated homepage
cat app/page.tsx

# View updated styles
cat app/page.module.css

# View full documentation
cat HOMEPAGE_GUIDE.md

# View visual architecture
cat VISUAL_ARCHITECTURE.md
```

## Performance Analysis

```powershell
# Check bundle size
npm run build -- --analyze

# Run Lighthouse locally (requires Chrome)
npx lighthouse http://localhost:3000

# Check performance with web.dev
# Visit: https://web.dev/measure/

# Check Core Web Vitals
# Visit: https://pagespeed.web.dev/
```

## Customization Examples

### Change Carousel Auto-Advance Time
```typescript
// In HeroCarousel.tsx, change from 5000ms to 3000ms:
useEffect(() => {
  const interval = setInterval(() => {
    paginate(1);
  }, 3000); // 3 seconds instead of 5
  return () => clearInterval(interval);
}, [paginate]);
```

### Update Hero Images
```typescript
// In app/page.tsx:
const heroImages = [
  {
    id: 1,
    src: 'https://your-cdn.com/image-1.jpg',
    alt: 'Product description',
    title: 'New Title',
    description: 'New description',
  },
  // Add more images...
];
```

### Adjust Carousel Height
```css
/* In HeroCarousel.module.css */
.carouselWrapper {
  height: 600px; /* Desktop: changed from 500px */
}

@media (max-width: 768px) {
  .carouselWrapper {
    height: 400px; /* Tablet: changed from 350px */
  }
}

@media (max-width: 480px) {
  .carouselWrapper {
    height: 300px; /* Mobile: changed from 250px */
  }
}
```

## Troubleshooting

```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install

# Clear Next.js cache
rm -r .next

# Check for errors
npm run build

# View dev server output in detail
npm run dev -- --debug

# Kill process on port 3000 (if stuck)
Get-NetTCPConnection -LocalPort 3000 | Stop-Process
```

## Documentation

```powershell
# View main guide
cat HOMEPAGE_GUIDE.md

# View visual architecture
cat VISUAL_ARCHITECTURE.md

# View summary
cat MODERN_HOMEPAGE_SUMMARY.md

# View tests
cat cypress/e2e/homepage.cy.ts
```

## Git Workflow

```powershell
# Create feature branch
git checkout -b feat/modern-homepage

# Make changes...

# Commit changes
git add .
git commit -m "feat: add modern homepage with carousel"

# Push to origin
git push -u origin feat/modern-homepage

# Create PR (via GitHub UI or CLI)
gh pr create --base main --head feat/modern-homepage

# Wait for CI/CD to pass
gh pr checks <PR_NUMBER>

# Merge when ready
gh pr merge <PR_NUMBER> --squash --delete-branch=false

# Sync dev branch
git checkout dev
git pull origin main
git push origin dev
```

## Quick Stats

```
Components Created:    1 (HeroCarousel)
Files Modified:        4 (page.tsx, page.module.css, package.json, cypress tests)
Files Created:         4 (HeroCarousel.module.css, HOMEPAGE_GUIDE.md, test-homepage.ps1, VISUAL_ARCHITECTURE.md)
Lines of Code:         ~800
Dependencies Added:    1 (framer-motion)
Test Coverage:         ~15 tests added/updated
Performance Gain:      +5-10 Lighthouse points
```

## Links & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Web Vitals:** https://web.dev/vitals/
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse
- **Shopify:** https://help.shopify.com
- **TypeScript:** https://www.typescriptlang.org/docs/

---

**Quick Reference Card Ready ✅**

Save this file for quick access to common commands!
