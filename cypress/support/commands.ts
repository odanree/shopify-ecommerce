// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command types here
    }
  }
}

// Example custom command:
// Cypress.Commands.add('login', (email, password) => { ... })

export {}
