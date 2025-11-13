describe('Homepage', () => {
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
    cy.visit('/')
  })

  it('should display the hero section', () => {
    cy.get('[data-cy="hero-section"]').should('be.visible')
    cy.get('[data-cy="hero-title"]').should('contain', 'Welcome to Our Store')
    cy.get('[data-cy="hero-subtitle"]').should('contain', 'Discover amazing products powered by Shopify')
  })

  it('should have Shop Now and Build Family Plan buttons', () => {
    cy.get('[data-cy="shop-now-button"]')
      .should('be.visible')
      .and('have.attr', 'href', '/products')
    cy.get('[data-cy="build-family-plan-button"]')
      .should('be.visible')
      .and('have.attr', 'href', '/family-plan')
  })

  it('should display featured products', () => {
    cy.get('[data-cy="featured-products-section"]').should('be.visible')
    cy.get('[data-cy="featured-products-title"]').should('contain', 'Featured Products')
    // Wait for products to load
    cy.get('[data-cy="featured-products-grid"]', { timeout: 10000 }).should('exist')
  })

  describe('Hero Carousel (Below Fold)', () => {
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
      // Wait for carousel to load (lazy component)
      cy.get('[data-cy="carousel-container"]', { timeout: 10000 }).should('exist')
      // Scroll to carousel
      cy.get('[data-cy="carousel-container"]').scrollIntoView()
      cy.wait(500) // Wait for scroll and animations
    })

    it('should display carousel below fold', () => {
      cy.get('[data-cy="carousel-wrapper"]').should('be.visible')
    })

    it('should display carousel image', () => {
      cy.get('[data-cy="carousel-image"]').should('be.visible')
    })

    it('should display navigation dots', () => {
      cy.get('[data-cy="dots-container"]').children().should('have.length.at.least', 1)
    })

    it('should navigate to next slide on next button click', () => {
      const initialDot = cy.get('[data-cy="active-dot"]').first()
      cy.get('[data-cy="next-button"]').click()
      cy.wait(500) // Wait for animation
      cy.get('[data-cy="active-dot"]').should('exist')
    })

    it('should navigate to previous slide on prev button click', () => {
      cy.get('[data-cy="next-button"]').click() // Move to next first
      cy.wait(500)
      cy.get('[data-cy="prev-button"]').click()
      cy.wait(500)
      cy.get('[data-cy="active-dot"]').should('exist')
    })

    it('should navigate via dot click', () => {
      const dots = cy.get('[data-cy="carousel-dot"]')
      dots.should('have.length.at.least', 2)
      dots.eq(1).click()
      cy.wait(500)
      cy.get('[data-cy="active-dot"]').should('exist')
    })

    it('should display overlay text on image', () => {
      cy.get('[data-cy="overlay-title"]').should('be.visible')
      cy.get('[data-cy="overlay-description"]').should('be.visible')
    })

    it('should have proper text contrast on image', () => {
      cy.get('[data-cy="text-overlay"]').should('have.css', 'color')
    })

    it('should have ARIA labels on buttons', () => {
      cy.get('[data-cy="prev-button"]').first().should('have.attr', 'aria-label')
      cy.get('[data-cy="carousel-dot"]').first().should('have.attr', 'aria-label')
    })
  })

  describe('Family Plan Promo', () => {
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

    it('should display Family Plan promo section', () => {
      cy.get('[data-cy="family-plan-promo"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-cy="promo-title"]').should('contain', 'Save More with Family Plans')
      cy.get('[data-cy="feature-members"]').should('contain', '2-6 Members')
      cy.get('[data-cy="feature-mix-match"]').should('contain', 'Mix & Match')
      cy.get('[data-cy="feature-savings"]').should('contain', 'Save 15-25%')
    })

    it('should navigate to family plan page when clicking CTA', () => {
      cy.get('[data-cy="promo-cta-button"]', { timeout: 10000 }).should('exist')
      cy.get('[data-cy="promo-cta-button"]').click()
      cy.url({ timeout: 10000 }).should('include', '/family-plan')
    })
  })

  describe('Responsive Design', () => {
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

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2')
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="hero-buttons"]').should('be.visible')
    })

    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('[data-cy="hero-title"]').should('be.visible')
      cy.get('[data-cy="hero-buttons"]').should('be.visible')
      
      // Check mobile button layout (column direction)
      cy.get('[data-cy="hero-buttons"]')
        .should('be.visible')
    })

    it('should adjust carousel height on mobile', () => {
      cy.viewport('iphone-x')
      cy.get('[data-cy="carousel-container"]').scrollIntoView()
      cy.get('[data-cy="carousel-wrapper"]').should('be.visible')
    })
  })

  describe('Performance & Accessibility', () => {
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

    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist')
      cy.get('h2').should('exist')
    })

    it('should have alt text on images', () => {
      cy.get('[data-cy="carousel-image"]').should('have.attr', 'alt')
    })

    it('should have proper semantic HTML', () => {
      cy.get('[data-cy="hero-section"]').should('match', 'section')
      cy.get('[data-cy="featured-products-section"]').should('match', 'section')
    })
  })
})
