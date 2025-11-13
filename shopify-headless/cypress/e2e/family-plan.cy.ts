describe('Family Plan Builder', () => {
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
    cy.visit('/family-plan')
  })

  it('should load the family plan builder page', () => {
    cy.get('[data-cy="family-plan-builder"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-cy="builder-title"]').should('contain', 'Build Your Family Plan')
    cy.get('[data-cy="builder-subtitle"]').should('contain', 'Select the number of lines and SIM type for each line.')
  })

  it('should display line controls', () => {
    // Check for add line button
    cy.get('[data-cy="add-line-button"]').should('be.visible').and('contain', 'Add-a-Line')
  })

  it('should allow adding lines', () => {
    // Get initial line count
    cy.get('[data-cy^="line-item-"]').its('length').then((initialCount) => {
      // Click add button
      cy.get('[data-cy="add-line-button"]').click()
      // Should have one more line
      cy.get('[data-cy^="line-item-"]').should('have.length', initialCount + 1)
    })
  })

  it('should display pricing section', () => {
    cy.get('[data-cy="pricing-summary"]').should('be.visible')
    cy.get('[data-cy="subtotal-amount"]').should('be.visible')
    cy.get('[data-cy="savings-amount"]').should('be.visible')
  })
})
