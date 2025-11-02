describe('Family Plan Builder', () => {
  beforeEach(() => {
    cy.visit('/family-plan')
  })

  it('should load the family plan builder page', () => {
    cy.contains('Family Plan Builder', { timeout: 10000 }).should('be.visible')
  })

  it('should display member selector', () => {
    cy.contains('How many family members?').should('be.visible')
  })

  it('should allow selecting number of members', () => {
    // Test selecting 3 members
    cy.contains('button', '3').click()
    cy.contains('Member 1').should('be.visible')
    cy.contains('Member 2').should('be.visible')
    cy.contains('Member 3').should('be.visible')
  })

  it('should calculate total price', () => {
    cy.contains('Total').should('be.visible')
  })
})
