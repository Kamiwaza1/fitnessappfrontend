const MUSCLE_GROUPS = [
  {
    id: "chest",
    label: "Chest",
    keywords: ["chest", "pectoralis"],
  },
  {
    id: "back",
    label: "Back",
    keywords: ["back", "latissimus", "trapezius", "erector"],
  },
  {
    id: "legs",
    label: "Legs",
    keywords: ["quad", "femoris", "hamstring", "glute", "calf", "gastrocnemius", "soleus", "leg", "adductor", "abductor"],
  },
  {
    id: "shoulders",
    label: "Shoulders",
    keywords: ["shoulder", "deltoid"],
  },
  {
    id: "arms",
    label: "Arms",
    keywords: ["biceps brachii", "triceps brachii", "brachialis", "forearm", "arm"],
  },
  {
    id: "core",
    label: "Core",
    keywords: ["abdominis", "oblique", "obliquus", "rectus", "core"],
  },
];

function getMuscleLabel(muscle = {}) {
  return muscle.nameEn || muscle.name_en || muscle.name || `Muscle ${muscle.id}`;
}

function getMuscleSearchText(muscle = {}) {
  return `${muscle.name || ""} ${muscle.nameEn || ""} ${muscle.name_en || ""}`.toLowerCase();
}

function findLibraryCandidate() {
  return cy.apiRequest({ path: "/api/v1/exercise-library/muscles?limit=100", failOnStatusCode: false }).then((musclesResponse) => {
    if (musclesResponse.status >= 400) {
      return null;
    }

    const muscles = Array.isArray(musclesResponse.body) ? musclesResponse.body : [];
    const candidates = MUSCLE_GROUPS.flatMap((group) =>
      muscles
        .filter((muscle) => group.keywords.some((keyword) => getMuscleSearchText(muscle).includes(keyword)))
        .map((muscle) => ({ group, muscle }))
    );

    expect(candidates, "library muscle candidates").to.have.length.greaterThan(0);

    function tryCandidate(index) {
      expect(index, "exercise candidate index").to.be.lessThan(candidates.length);

      const candidate = candidates[index];

      return cy
        .apiRequest({
          path: `/api/v1/exercise-library/exercises/search?language=2&limit=5&offset=0&muscleId=${candidate.muscle.id}`,
          failOnStatusCode: false,
        })
        .then((exerciseResponse) => {
          const results = Array.isArray(exerciseResponse.body?.results) ? exerciseResponse.body.results : [];

          if (exerciseResponse.status < 400 && results.length > 0) {
            return {
              ...candidate,
              exercise: results[0],
            };
          }

          return tryCandidate(index + 1);
        });
    }

    return tryCandidate(0);
  });
}

describe("exercise library without API mocks", () => {
  it("lets a user choose a muscle, search exercises, and open exercise details", () => {
    findLibraryCandidate().then((candidate) => {
      cy.loginAndVisit("/library");

      cy.contains("Exercise Library", { timeout: 10000 }).should("be.visible");

      if (!candidate) {
        cy.contains(/Could not load exercise library|Loading muscle groups|Choose a muscle group/i, { timeout: 10000 })
          .should("be.visible");
        return;
      }

      const { group, muscle, exercise } = candidate;
      const muscleLabel = getMuscleLabel(muscle);
      const exerciseName = exercise.name;

      cy.contains("Choose a muscle group").should("be.visible");
      cy.get(`[data-cy="library-muscle-group"][data-group-id="${group.id}"]`).click();
      cy.get(`[data-cy="library-muscle-option"][data-muscle-id="${muscle.id}"]`).click();

      cy.contains("Selected muscle", { timeout: 10000 }).should("be.visible");
      cy.contains(muscleLabel).should("be.visible");
      cy.contains("button", "Change Muscle").should("be.visible");

      cy.get('input[type="search"]').type(exerciseName);
      cy.get(`[data-cy="library-exercise-card"][data-exercise-id="${exercise.id}"]`, { timeout: 15000 })
        .should("be.visible")
        .click();

      cy.get('[data-cy="library-detail-back"]', { timeout: 10000 }).should("be.visible");
      cy.contains("Selected muscle").should("not.exist");
      cy.contains("h2", exerciseName, { timeout: 10000 }).should("be.visible");
      cy.contains(/Primary muscles|Secondary muscles|Equipment|Aliases/i).should("be.visible");

      cy.get('[data-cy="library-detail-back"]').click();
      cy.contains("Selected muscle", { timeout: 10000 }).should("be.visible");
      cy.get(`[data-cy="library-exercise-card"][data-exercise-id="${exercise.id}"]`).should("be.visible");
    });
  });

  it("returns to the muscle group picker from an exercise list", () => {
    findLibraryCandidate().then((candidate) => {
      cy.loginAndVisit("/library");

      cy.contains("Exercise Library", { timeout: 10000 }).should("be.visible");

      if (!candidate) {
        cy.contains(/Could not load exercise library|Loading muscle groups|Choose a muscle group/i, { timeout: 10000 })
          .should("be.visible");
        return;
      }

      const { group, muscle } = candidate;
      cy.get(`[data-cy="library-muscle-group"][data-group-id="${group.id}"]`, { timeout: 10000 }).click();
      cy.get(`[data-cy="library-muscle-option"][data-muscle-id="${muscle.id}"]`).click();
      cy.contains("Selected muscle", { timeout: 10000 }).should("be.visible");

      cy.contains("button", "Change Muscle").click();
      cy.contains("Choose a muscle group").should("be.visible");
      cy.contains("Selected muscle").should("not.exist");
    });
  });
});
