describe("workouts without API mocks", () => {
  const prefix = () => Cypress.env("testDataPrefix");
  const today = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fillRequiredWorkoutFields = ({ title, description, date, exerciseName }) => {
    cy.fillFieldByLabel("Workout Title", title);
    cy.fillFieldByLabel("Description", description);
    cy.fillFieldByLabel("Category", "STRENGTH");
    cy.fillFieldByLabel("Workout Date", date);
    cy.fillFieldByLabel("Exercise Name", exerciseName);
    cy.fillFieldByLabel("Muscle Type", "CHEST");
    cy.fillFieldByLabel("Sets", "3");
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

    cy.intercept("POST", "**/api/v1/workouts").as("createWorkout");
    cy.contains("button", /create|new|add/i).click();
    cy.contains("Upcoming Workouts").should("not.exist");
    fillRequiredWorkoutFields({
      title,
      description: "Cypress real backend workout",
      date: tomorrow,
      exerciseName: `${prefix()} Bench Press`,
    });
    cy.contains("button", "Save Workout").click();
    cy.wait("@createWorkout").its("request.body").should((body) => {
      expect(body).not.to.have.property("durationMinutes");
    });

    cy.contains(title, { timeout: 10000 }).should("be.visible");
    cy.reload();
    cy.contains(title, { timeout: 10000 }).should("be.visible");

    cy.contains("article", title).find('[aria-label="Edit workout"]').click();
    cy.fillFieldByLabel("Workout Title", updatedTitle);
    cy.contains("button", "Update Workout").click();
    cy.contains(updatedTitle, { timeout: 10000 }).should("be.visible");

    cy.on("window:confirm", (message) => {
      expect(message).to.contain(updatedTitle);
      return true;
    });
    cy.contains("article", updatedTitle).find('[aria-label="Delete workout"]').click();
    cy.contains(updatedTitle).should("not.exist");
  });

  it("starts a planned workout only after confirmation and finishes without getting stuck", () => {
    const title = `${prefix()} Confirmed Active Workout`;

    cy.contains("button", /create|new|add/i).click();
    fillRequiredWorkoutFields({
      title,
      description: "Cypress active workout flow",
      date: today(),
      exerciseName: `${prefix()} Row`,
    });
    cy.contains("button", "Save Workout").click();

    cy.contains("article", title, { timeout: 10000 }).click();
    cy.contains('[role="dialog"]', title).should("be.visible");
    cy.contains("Rest timer").should("not.exist");
    cy.contains('[role="dialog"]', title).contains("Duration").should("not.exist");

    cy.contains("button", "Cancel").click();
    cy.contains('[role="dialog"]', title).should("not.exist");
    cy.contains("Rest timer").should("not.exist");

    cy.contains("article", title).find("button").contains("Start").click();
    cy.contains('[role="dialog"]', title).should("be.visible");
    cy.contains("button", "Start active workout").click();

    cy.contains("Rest timer", { timeout: 10000 }).should("be.visible");
    cy.contains("h2", title).should("be.visible");
    cy.contains("article", title).should("not.exist");
    cy.contains("Upcoming Workouts").should("not.exist");

    cy.fillFieldByLabel("Actual reps", "8");
    cy.fillFieldByLabel("Lift weight kg", "45");
    cy.contains("button", "Log set").click();
    cy.contains("Set 1", { timeout: 10000 }).should("be.visible");
    cy.contains("label", "Actual reps").find("input").should("have.value", "");
    cy.contains("label", "Lift weight kg").find("input").should("have.value", "");

    let removeConfirmCount = 0;
    cy.on("window:confirm", (message) => {
      removeConfirmCount += 1;
      expect(message).to.contain("Remove set 1");
      return removeConfirmCount > 1;
    });
    cy.contains("button", "Remove").click();
    cy.contains("Set 1").should("be.visible");

    cy.contains("button", "Remove").click();
    cy.contains("Set 1").should("not.exist");

    cy.fillFieldByLabel("Actual reps", "6");
    cy.fillFieldByLabel("Lift weight kg", "50");
    cy.contains("button", "Log set").click();

    cy.intercept("POST", "**/api/v1/workout-history").as("saveWorkoutHistory");
    cy.contains("button", "Finish workout").click();
    cy.wait("@saveWorkoutHistory").its("request.body").should((body) => {
      expect(body).not.to.have.property("durationMinutes");
      expect(body.startedAt).to.be.a("string").and.not.be.empty;
      expect(body.finishedAt).to.be.a("string").and.not.be.empty;
      expect(body.sets).to.eq(1);
    });
    cy.location("pathname", { timeout: 10000 }).should("eq", "/workout-histories");
    cy.visit("/workouts");
    cy.contains("Rest timer").should("not.exist");
  });

  it("does not discard an active workout unless the user confirms", () => {
    const title = `${prefix()} Discard Guard Workout`;

    cy.contains("button", /create|new|add/i).click();
    fillRequiredWorkoutFields({
      title,
      description: "Cypress discard confirmation flow",
      date: today(),
      exerciseName: `${prefix()} Squat`,
    });
    cy.contains("button", "Save Workout").click();
    cy.contains("article", title, { timeout: 10000 }).find("button").contains("Start").click();
    cy.contains("button", "Start active workout").click();
    cy.contains("Rest timer", { timeout: 10000 }).should("be.visible");

    let discardConfirmCount = 0;
    cy.on("window:confirm", (message) => {
      discardConfirmCount += 1;
      expect(message).to.contain("Discard this active workout session");
      return discardConfirmCount > 1;
    });
    cy.contains("button", "Discard session").click();
    cy.contains("Rest timer").should("be.visible");

    cy.contains("button", "Discard session").click();
    cy.contains("Rest timer").should("not.exist");
  });
});
