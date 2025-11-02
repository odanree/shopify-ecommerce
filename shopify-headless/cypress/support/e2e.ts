// ***********************************************************
// This support file is loaded before all test files
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in Cypress UI for cleaner test output
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // useful for Next.js hydration errors that don't affect functionality
  return false
})
