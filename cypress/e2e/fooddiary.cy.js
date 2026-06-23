describe("Food diary date navigation", () => {
  const localDate = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date;
  };

  const longDate = (offsetDays = 0) => {
    return localDate(offsetDays).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  it("moves one local day backward and forward", () => {
    cy.loginAndVisit("/nutrition");

    cy.contains("Food Diary").should("be.visible");
    cy.contains(longDate()).should("be.visible");

    cy.get('button[aria-label="Previous day"]').click();
    cy.contains(longDate(-1)).should("be.visible");

    cy.get('button[aria-label="Previous day"]').click();
    cy.contains(longDate(-2)).should("be.visible");

    cy.get('button[aria-label="Next day"]').click();
    cy.contains(longDate(-1)).should("be.visible");

    cy.get('button[aria-label="Next day"]').click();
    cy.contains(longDate()).should("be.visible");
  });
});
