describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the hero section', () => {
    cy.contains('Welcome to Our Store').should('be.visible')
    cy.contains('Discover amazing products powered by Shopify').should('be.visible')
  })

  it('should have Shop Now and Build Family Plan buttons', () => {
    cy.contains('a', 'Shop Now').should('be.visible').and('have.attr', 'href', '/products')
    cy.contains('a', 'Build Family Plan').should('be.visible').and('have.attr', 'href', '/family-plan')
  })

  it('should display Family Plan promo section', () => {
    cy.contains('Save More with Family Plans').should('be.visible')
    cy.contains('2-6 Members').should('be.visible')
    cy.contains('Mix & Match').should('be.visible')
    cy.contains('Save 15-25%').should('be.visible')
  })

  it('should display featured products', () => {
    cy.contains('Featured Products').should('be.visible')
    // Wait for products to load
    cy.get('[class*="productsGrid"]', { timeout: 10000 }).should('exist')
  })

  it('should navigate to family plan page when clicking CTA', () => {
    cy.contains('Start Building Your Plan').click()
    cy.url().should('include', '/family-plan')
  })

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x')
    cy.contains('Welcome to Our Store').should('be.visible')
    cy.contains('Save More with Family Plans').should('be.visible')
  })
})
