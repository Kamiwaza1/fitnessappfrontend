import "./commands";

Cypress.on("uncaught:exception", (error) => {
  if (/Hydration failed because the server rendered HTML didn't match the client/i.test(error.message)) {
    return false;
  }

  return true;
});

beforeEach(() => {
  cy.clearAuthSession();
});
