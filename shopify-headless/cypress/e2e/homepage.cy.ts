describe('Homepage', () => {
  beforeEach(() => {
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

  it('should display Family Plan promo section', () => {
    cy.get('[data-cy="family-plan-promo"]').should('be.visible')
    cy.get('[data-cy="promo-title"]').should('contain', 'Save More with Family Plans')
    cy.get('[data-cy="feature-members"]').should('contain', '2-6 Members')
    cy.get('[data-cy="feature-mix-match"]').should('contain', 'Mix & Match')
    cy.get('[data-cy="feature-savings"]').should('contain', 'Save 15-25%')
  })

  it('should display featured products', () => {
    cy.get('[data-cy="featured-products-section"]').should('be.visible')
    cy.get('[data-cy="featured-products-title"]').should('contain', 'Featured Products')
    // Wait for products to load
    cy.get('[data-cy="featured-products-grid"]', { timeout: 10000 }).should('exist')
  })

  it('should navigate to family plan page when clicking CTA', () => {
    cy.get('[data-cy="promo-cta-button"]').click()
    cy.url().should('include', '/family-plan')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.get('[data-cy="hero-title"]').should('be.visible')
    cy.get('[data-cy="promo-title"]').should('be.visible')
  })
})
