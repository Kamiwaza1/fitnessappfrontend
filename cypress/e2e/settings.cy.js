describe("settings without API mocks", () => {
  beforeEach(() => {
    cy.loginAndVisit("/settings");
  });

  it("updates calorie target and dashboard reflects it", () => {
    cy.fillFieldByLabel("Daily calorie target", "2350");
    cy.contains("button", "Save target").click();
    cy.contains("Calorie target saved.", { timeout: 10000 }).should("be.visible");

    cy.contains("a", "Dashboard").click();
    cy.contains("/ 2350 Kcal", { timeout: 10000 }).should("be.visible");
  });
});
