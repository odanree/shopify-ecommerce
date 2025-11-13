describe('Shopping Cart', () => {
  beforeEach(() => {
    // Ignore hydration warnings/errors
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('hydrating') || err.message.includes('Hydration')) {
        return false; // Ignore hydration errors
      }
      return true; // Let other errors fail the test
    })
    cy.visit('/')
  })

  it('should display cart link in header', () => {
    cy.get('[data-cy="cart-link"]').should('be.visible').and('contain', 'Cart')
  })

  it('should navigate to cart page', () => {
    cy.get('[data-cy="cart-link"]').click()
    cy.url().should('include', '/cart')
  })

  it('should display empty cart message initially', () => {
    cy.visit('/cart')
    cy.get('[data-cy="empty-cart-page"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="empty-cart-title"]').should('contain', 'Your Cart is Empty')
  })
})
