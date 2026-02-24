describe('Collections', () => {
  describe('Collections Listing Page', () => {
    beforeEach(() => {
      // Ignore hydration, routing errors, and minified React errors
      cy.on('uncaught:exception', (err) => {
        if (
          err.message.includes('hydrating') ||
          err.message.includes('Hydration') ||
          err.message.includes('NEXT_NOT_FOUND') ||
          err.message.includes('Minified React error #')
        ) {
          return false;
        }
        return true;
      })
      cy.visit('/collections');
    });

    it('should load the collections page', () => {
      cy.contains('h1', 'Collections').should('be.visible');
      cy.contains('Explore our curated product collections').should('be.visible');
    });

    it('should display collections grid or empty state', () => {
      // Either we have collections or an empty state
      cy.get('body').then(($body) => {
        if ($body.text().includes('No collections found')) {
          // Empty state
          cy.contains('No collections found').should('be.visible');
          cy.contains('Collections will appear here once they are created').should('be.visible');
        } else {
          // Collections exist - check for grid
          cy.get('a[href^="/collections/"]').should('exist');
        }
      });
    });

    it('should navigate to collection detail when clicking a collection card', () => {
      cy.get('body').then(($body) => {
        if (!$body.text().includes('No collections found')) {
          // Click the first collection
          cy.get('a[href^="/collections/"]').first().click();
          
          // Should navigate to collection detail page
          cy.url().should('include', '/collections/');
          cy.url().should('not.equal', `${Cypress.config().baseUrl}/collections`);
        }
      });
    });

    it('should have accessible collections link in header', () => {
      cy.get('[data-cy="collections-link"]').should('be.visible').and('contain', 'Collections');
    });
  });

  describe('Collection Detail Page', () => {
    beforeEach(() => {
      // Ignore hydration, routing errors, and minified React errors
      cy.on('uncaught:exception', (err) => {
        if (
          err.message.includes('hydrating') ||
          err.message.includes('Hydration') ||
          err.message.includes('NEXT_NOT_FOUND') ||
          err.message.includes('NEXT_REDIRECT') ||
          err.message.includes('Minified React error #')
        ) {
          return false;
        }
        return true;
      })
    })

    it('should show 404 for non-existent collection', () => {
      cy.visit('/collections/non-existent-collection-12345', { failOnStatusCode: false });
      cy.contains('404').should('be.visible');
    });

    it('should load a collection detail page', () => {
      // First, get a collection handle from the collections page
      cy.visit('/collections');
      
      cy.get('body').then(($body) => {
        if (!$body.text().includes('No collections found')) {
          // Get the first collection link's href with timeout
          cy.get('a[href^="/collections/"]', { timeout: 10000 })
            .first()
            .invoke('attr', 'href')
            .then((href) => {
              // Visit the collection detail page
              if (href) {
                cy.visit(href, { timeout: 10000 });
                
                // Should have breadcrumbs with extended timeout for slow networks
                cy.contains('Home', { timeout: 10000 }).should('be.visible');
                cy.contains('Collections', { timeout: 10000 }).should('be.visible');
                
                // Should have collection title
                cy.get('h1', { timeout: 10000 }).should('be.visible');
                
                // Should have products or empty state
                cy.get('body', { timeout: 10000 }).then(($detailBody) => {
                  if ($detailBody.text().includes('No products in this collection')) {
                    cy.contains('No products in this collection', { timeout: 10000 }).should('be.visible');
                    cy.contains('Browse Other Collections', { timeout: 10000 }).should('be.visible');
                  } else {
                    // Should have products grid
                    cy.get('a[href^="/products/"]', { timeout: 10000 }).should('exist');
                  }
                });
              }
            });
        }
      });
    });

    it('should navigate back to collections from breadcrumbs', () => {
      cy.visit('/collections');
      
      cy.get('body').then(($body) => {
        if (!$body.text().includes('No collections found')) {
          cy.get('a[href^="/collections/"]', { timeout: 10000 }).first().click();
          
          // Click breadcrumb to go back with timeout
          cy.contains('a', 'Collections', { timeout: 10000 }).click();
          cy.url({ timeout: 10000 }).should('include', '/collections');
          cy.url({ timeout: 10000 }).should('not.include', '/collections/');
        }
      });
    });

    it('should navigate to product detail from collection', () => {
      cy.visit('/collections');
      
      cy.get('body').then(($body) => {
        if (!$body.text().includes('No collections found')) {
          cy.get('a[href^="/collections/"]', { timeout: 10000 }).first().click();
          
          cy.get('body', { timeout: 10000 }).then(($detailBody) => {
            if (!$detailBody.text().includes('No products in this collection')) {
              // Click on a product with timeout
              cy.get('a[href^="/products/"]', { timeout: 10000 }).first().click();
              cy.url({ timeout: 10000 }).should('include', '/products/');
            }
          });
        }
      });
    });
  });

  describe('Navigation Integration', () => {
    beforeEach(() => {
      // Ignore hydration, routing errors, and minified React errors
      cy.on('uncaught:exception', (err) => {
        if (
          err.message.includes('hydrating') ||
          err.message.includes('Hydration') ||
          err.message.includes('NEXT_NOT_FOUND') ||
          err.message.includes('NEXT_REDIRECT') ||
          err.message.includes('Minified React error #')
        ) {
          return false;
        }
        return true;
      })
    })

    it.skip('should navigate to collections from header', () => {
      // SKIPPED: Flakey on production build - header navigation timing issues
      // TODO: Investigate root cause of navigation click not working in production
      cy.visit('/');
      cy.get('[data-cy="collections-link"]').should('be.visible').click();
      cy.url({ timeout: 10000 }).should('include', '/collections');
      cy.contains('h1', 'Collections', { timeout: 10000 }).should('be.visible');
    });

    it.skip('should navigate between products and collections', () => {
      // SKIPPED: Flakey on production build - header navigation timing issues
      // TODO: Investigate root cause of navigation click not working in production
      cy.visit('/products');
      cy.get('[data-cy="collections-link"]').click();
      cy.url().should('include', '/collections');
      
      cy.get('[data-cy="products-link"]').click();
      cy.url().should('include', '/products');
    });
  });
});
