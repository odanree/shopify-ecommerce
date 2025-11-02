describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display cart link in header', () => {
    cy.contains('Cart').should('be.visible')
  })

  it('should navigate to cart page', () => {
    cy.contains('a', 'Cart').click()
    cy.url().should('include', '/cart')
  })

  it('should display empty cart message initially', () => {
    cy.visit('/cart')
    cy.contains('Your Cart is Empty', { timeout: 10000 }).should('be.visible')
  })
})
