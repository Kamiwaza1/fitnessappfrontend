describe("Food diary date navigation", () => {
  it("moves one local day backward and forward", () => {
    cy.clock(new Date("2026-06-02T10:00:00+02:00").getTime(), ["Date"]);
    cy.loginAndVisit("/nutrition");

    cy.contains("Food Diary").should("be.visible");
    cy.contains("Tuesday, June 2, 2026").should("be.visible");

    cy.get('button[aria-label="Previous day"]').click();
    cy.contains("Monday, June 1, 2026").should("be.visible");

    cy.get('button[aria-label="Previous day"]').click();
    cy.contains("Sunday, May 31, 2026").should("be.visible");

    cy.get('button[aria-label="Next day"]').click();
    cy.contains("Monday, June 1, 2026").should("be.visible");

    cy.get('button[aria-label="Next day"]').click();
    cy.contains("Tuesday, June 2, 2026").should("be.visible");
  });
});
