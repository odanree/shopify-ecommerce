describe('Family Plan Builder', () => {
  beforeEach(() => {
    cy.visit('/family-plan')
  })

  it('should load the family plan builder page', () => {
    cy.contains('Select the number of lines', { timeout: 10000 }).should('be.visible')
  })

  it('should display line controls', () => {
    // Check for add line button
    cy.get('button').contains('Add').should('exist')
  })

  it('should allow adding lines', () => {
    // Get initial line count
    cy.get('[class*="lineItem"]').its('length').then((initialCount) => {
      // Click add button
      cy.contains('button', 'Add').first().click()
      // Should have one more line
      cy.get('[class*="lineItem"]').should('have.length', initialCount + 1)
    })
  })

  it('should display pricing section', () => {
    cy.contains('Total').should('be.visible')
  })
})
