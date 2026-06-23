describe("auth without API mocks", () => {
  before(() => {
    cy.ensureTestUser();
  });

  it("redirects protected routes to login when unauthenticated", () => {
    cy.visit("/dashboard");
    cy.location("pathname", { timeout: 10000 }).should("eq", "/login");
  });

  it("logs in with the real backend", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type(Cypress.env("testUserEmail"));
    cy.get('input[type="password"]').type(Cypress.env("testUserPassword"), { log: false });
    cy.contains("button", /Login|Sign In/).click();

    cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
    cy.contains("Recommended For You", { timeout: 10000 }).should("be.visible");
    cy.contains("Weekly Training Volume", { timeout: 10000 }).should("be.visible");
  });

  it("shows an error for invalid credentials", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').type(`missing-${Date.now()}@example.com`);
    cy.get('input[type="password"]').type("WrongPassword123!", { log: false });
    cy.contains("button", /Login|Sign In/).click();

    cy.location("pathname").should("eq", "/login");
    cy.contains(/failed|invalid|unauthorized|not found|incorrect/i, { timeout: 10000 }).should("be.visible");
  });
});
