describe('Shopping Cart', () => {
  beforeEach(() => {
    // Ignore hydration warnings/errors, Next.js routing errors, and minified React errors
    cy.on('uncaught:exception', (err) => {
      // Suppress hydration and Next.js routing errors
      if (
        err.message.includes('hydrating') ||
        err.message.includes('Hydration') ||
        err.message.includes('NEXT_NOT_FOUND') ||
        err.message.includes('NEXT_REDIRECT')
      ) {
        return false;
      }
      // Suppress minified React errors (production build)
      if (err.message.includes('Minified React error #')) {
        return false;
      }
      return true;
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
