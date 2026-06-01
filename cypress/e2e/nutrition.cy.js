describe("nutrition without API mocks", () => {
  const prefix = () => Cypress.env("testDataPrefix");

  beforeEach(() => {
    cy.cleanupE2eData();
    cy.loginAndVisit("/nutrition");
  });

  afterEach(() => {
    cy.cleanupE2eData();
  });

  it("creates, edits, and deletes a nutrition entry through the UI", () => {
    const meal = `${prefix()} UI Meal`;
    const updatedMeal = `${prefix()} UI Meal Updated`;

    cy.fillFieldByLabel("Food name", meal);
    cy.fillFieldByLabel("Calories", "410");
    cy.fillFieldByLabel("Protein", "32");
    cy.fillFieldByLabel("Carbs", "35");
    cy.fillFieldByLabel("Fat", "11");
    cy.fillFieldByLabel("Notes", "Cypress real backend nutrition");
    cy.contains("button", "Add food").click();

    cy.contains(meal, { timeout: 10000 }).should("be.visible");

    cy.findByAriaLabelFallback(`Edit ${meal}`).click();
    cy.fillFieldByLabel("Food name", updatedMeal);
    cy.contains("button", "Update food").click();
    cy.contains(updatedMeal, { timeout: 10000 }).should("be.visible");

    cy.findByAriaLabelFallback(`Delete ${updatedMeal}`).click();
    cy.contains(updatedMeal).should("not.exist");
  });

  it("uses the real food search endpoint", () => {
    cy.contains("button", "Foods").click();
    cy.get('input[placeholder="Search foods database..."]').type("banana");

    cy.contains(/Searching foods|No matching foods found|kcal/i, { timeout: 15000 }).should("be.visible");
  });
});
