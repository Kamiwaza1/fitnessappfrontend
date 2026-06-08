describe("settings without API mocks", () => {
  beforeEach(() => {
    cy.setCalorieTarget(2400);
    cy.loginAndVisit("/settings");
  });

  it("updates calorie target and dashboard reflects it", () => {
    cy.contains("label", "Daily calorie target")
      .find("input")
      .should("have.value", "2400")
      .clear({ force: true })
      .type("2350", { force: true });
    cy.contains("button", "Save target").click();
    cy.contains("Calorie target saved.", { timeout: 10000 }).should("be.visible");

    cy.contains("a", "Dashboard").click();
    cy.contains("/ 2350 Kcal", { timeout: 10000 }).should("be.visible");
  });
});
