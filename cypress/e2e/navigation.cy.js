describe("app navigation without API mocks", () => {
  const pages = [
    { label: "Dashboard", path: "/dashboard", content: /Recommended For You|Weekly Training Volume/i },
    { label: "Workouts", path: "/workouts", content: /Upcoming Workouts|Add Workout/i },
    { label: "Exercise Library", path: "/library", content: /Choose a muscle group|Exercise Library/i },
    { label: "Live Workout", path: "/live-workouts", content: /Live Workout/i },
    { label: "History", path: "/workout-histories", content: /Workout History|History List/i },
    { label: "Nutrition", path: "/nutrition", content: /Food Diary/i },
    { label: "Progress", path: "/progress", content: /Volume Per|Workout Lengths/i },
    { label: "Settings", path: "/settings", content: /Settings/i },
  ];

  beforeEach(() => {
    cy.loginAndVisit("/dashboard");
  });

  pages.forEach((page) => {
    it(`navigates to ${page.label} from the sidebar`, () => {
      cy.contains("a", page.label, { timeout: 10000 }).click();
      cy.location("pathname", { timeout: 10000 }).should("eq", page.path);
      cy.contains(page.content, { timeout: 10000 }).should("be.visible");
    });
  });
});
