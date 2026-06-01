describe("workout history without API mocks", () => {
  beforeEach(() => {
    cy.loginAndVisit("/workout-histories");
  });

  it("renders the real workout history response", () => {
    cy.contains("Workout Histories", { timeout: 10000 }).should("be.visible");
    cy.contains(/records|No workout histories yet|Completed/i, { timeout: 10000 }).should("be.visible");
  });
});
