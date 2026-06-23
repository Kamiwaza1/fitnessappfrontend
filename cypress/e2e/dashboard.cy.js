describe("dashboard without API mocks", () => {
  beforeEach(() => {
    cy.cleanupE2eData();
    cy.createE2eWorkout({ workoutName: `${Cypress.env("testDataPrefix")} Dashboard Workout` });
    cy.createE2eNutritionEntry({
      mealName: `${Cypress.env("testDataPrefix")} Dashboard Protein Bowl`,
      calories: 600,
      proteinGrams: 45,
    });
    cy.setCalorieTarget(2400);
  });

  afterEach(() => {
    cy.cleanupE2eData();
  });

  it("renders real user, workout, nutrition, and calorie target data", () => {
    cy.loginAndVisit("/dashboard");

    cy.contains("Recommended For You", { timeout: 10000 }).should("be.visible");
    cy.contains("Weekly Training Volume", { timeout: 10000 }).should("be.visible");
    cy.contains("Weekly Calories", { timeout: 10000 }).should("be.visible");
    cy.contains("600", { timeout: 10000 }).should("be.visible");
    cy.contains("/ 2400 Kcal", { timeout: 10000 }).should("be.visible");
  });
});
