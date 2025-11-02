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
  // Only suppress known harmless Next.js hydration errors
  // e.g., "Hydration failed" or "Minified React error #418"
  if (
    err.message?.includes('Hydration failed') ||
    err.message?.includes('Minified React error #418')
  ) {
    return false; // prevent Cypress from failing the test
  }
  // Let all other errors fail the test
  // Returning undefined allows Cypress to handle the error normally
})
