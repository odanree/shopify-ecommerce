import { test, expect } from '@playwright/test';

test.describe('Collections', () => {

  test.describe('Collections Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/collections');
    });

    test('should load the collections page', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Collections', level: 1 })).toBeVisible();
      await expect(page.getByText('Explore our curated product collections')).toBeVisible();
    });

    test('should display collections grid or empty state', async ({ page }) => {
      const emptyState = page.getByText('No collections found');
      const collectionLinks = page.locator('a[href^="/collections/"]');

      // Playwright lets you check for one of two states easily
      if (await emptyState.isVisible()) {
        await expect(page.getByText('Collections will appear here once they are created')).toBeVisible();
      } else {
        await expect(collectionLinks.first()).toBeVisible();
      }
    });

    test('should navigate to collection detail when clicking a collection card', async ({ page }) => {
      const collectionLinks = page.locator('a[href^="/collections/"]');
      
      if (await collectionLinks.count() > 0) {
        await collectionLinks.first().click();
        await expect(page).toHaveURL(/\/collections\/.+/);
        await expect(page).not.toHaveURL(/\/collections$/);
      }
    });
  });

  test.describe('Collection Detail Page', () => {
    test('should show 404 for non-existent collection', async ({ page }) => {
      // Playwright handles non-200 responses without needing special flags
      await page.goto('/collections/non-existent-collection-12345');
      await expect(page.getByText('404')).toBeVisible();
    });

    test('should load a collection detail page and verify contents', async ({ page }) => {
      await page.goto('/collections');
      const firstCollection = page.locator('a[href^="/collections/"]').first();

      if (await firstCollection.isVisible()) {
        await firstCollection.click();
        
        // Breadcrumbs check
        await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
        // Use class selector for breadcrumb link to avoid strict mode with header nav link
        await expect(page.locator('.page_breadcrumbLink__3h_ZG').filter({ hasText: 'Collections' })).toBeVisible();
        
        // Products vs Empty state
        const noProducts = page.getByText('No products in this collection');
        if (await noProducts.isVisible()) {
          await expect(page.getByRole('link', { name: 'Browse Other Collections' })).toBeVisible();
        } else {
          await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Navigation Integration', () => {
    // These were "skipped" in Cypress - Playwright's auto-wait should fix them!
    test('should navigate to collections from header', async ({ page }) => {
      await page.goto('/');
      // data-cy="collections-link"
      const collectionsLink = page.locator('[data-cy="collections-link"]');
      
      // Wait for the link to be 'actionable' (scrolled, visible, not obscured)
      await collectionsLink.click();
      
      await expect(page).toHaveURL(/\/collections/);
      await expect(page.getByRole('heading', { name: 'Collections' })).toBeVisible();
    });
  });
});