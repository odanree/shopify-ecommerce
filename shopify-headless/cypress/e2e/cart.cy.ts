describe('Shopping Cart', () => {
  beforeEach(() => {
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
