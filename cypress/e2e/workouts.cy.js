describe("workouts without API mocks", () => {
  const prefix = () => Cypress.env("testDataPrefix");
  const today = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  it("starts a planned workout only after confirmation and finishes without getting stuck", () => {
    const title = `${prefix()} Confirmed Active Workout`;

    cy.contains("button", /create|new|add/i).click();
    cy.fillFieldByLabel("Workout Title", title);
    cy.fillFieldByLabel("Description", "Cypress active workout flow");
    cy.fillFieldByLabel("Workout Date", today());
    cy.fillFieldByLabel("Exercise Name", `${prefix()} Row`);
    cy.contains("button", "Save Workout").click();

    cy.contains("article", title, { timeout: 10000 }).click();
    cy.contains('[role="dialog"]', title).should("be.visible");
    cy.contains("Active workout").should("not.exist");

    cy.contains("button", "Cancel").click();
    cy.contains('[role="dialog"]', title).should("not.exist");
    cy.contains("Active workout").should("not.exist");

    cy.contains("article", title).find("button").contains("Start").click();
    cy.contains('[role="dialog"]', title).should("be.visible");
    cy.contains("button", "Start active workout").click();

    cy.contains("Active workout", { timeout: 10000 }).should("be.visible");
    cy.contains("h2", title).should("be.visible");
    cy.contains("article", title).should("not.exist");

    cy.contains("button", "Finish workout").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/workout-histories");
    cy.visit("/workouts");
    cy.contains("Active workout").should("not.exist");
  });
});
