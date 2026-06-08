describe("workouts without API mocks", () => {
  const prefix = () => Cypress.env("testDataPrefix");

  beforeEach(() => {
    cy.cleanupE2eData();
    cy.loginAndVisit("/workouts");
  });

  afterEach(() => {
    cy.cleanupE2eData();
  });

  it("creates, edits, persists, and deletes a workout through the UI", () => {
    const title = `${prefix()} UI Workout`;
    const updatedTitle = `${prefix()} UI Workout Updated`;
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    cy.contains("button", /create|new|add/i).click();
    cy.fillFieldByLabel("Workout Title", title);
    cy.fillFieldByLabel("Description", "Cypress real backend workout");
    cy.fillFieldByLabel("Workout Date", tomorrow);
    cy.fillFieldByLabel("Exercise Name", `${prefix()} Bench Press`);
    cy.contains("button", "Save Workout").click();

    cy.contains(title, { timeout: 10000 }).should("be.visible");
    cy.reload();
    cy.contains(title, { timeout: 10000 }).should("be.visible");

    cy.contains("article", title).find('[aria-label="Edit workout"]').click();
    cy.fillFieldByLabel("Workout Title", updatedTitle);
    cy.contains("button", "Update Workout").click();
    cy.contains(updatedTitle, { timeout: 10000 }).should("be.visible");

    cy.contains("article", updatedTitle).find('[aria-label="Delete workout"]').click();
    cy.contains(updatedTitle).should("not.exist");
  });
});
