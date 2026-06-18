const apiUrl = () => String(Cypress.env("apiUrl") || "http://localhost:8080").replace(/\/+$/, "");
const testUserEmail = () => Cypress.env("testUserEmail");
const testUserPassword = () => Cypress.env("testUserPassword");
const testUserFullName = () => Cypress.env("testUserFullName");
const testDataPrefix = () => Cypress.env("testDataPrefix") || "cypress-e2e";

function getNestedValue(source, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);
}

function extractUser(data = {}) {
  return data.user || data.data?.user || data.result?.user || data.payload?.user || null;
}

function extractCollection(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function getWorkoutId(workout) {
  return workout?.workoutId || workout?.id || workout?._id;
}

function getNutritionId(entry) {
  return entry?.nutritionId || entry?.id || entry?._id;
}

function storeAuthSession(win, auth) {
  const user = auth.user || {
    email: testUserEmail(),
    username: testUserEmail(),
    fullName: testUserFullName(),
  };

  win.localStorage.setItem("user", JSON.stringify(user));
}

function isUnsafeMethod(method = "GET") {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(String(method).toUpperCase());
}

function getCsrfToken() {
  return cy
    .request({
      method: "GET",
      url: `${apiUrl()}/api/v1/auth/csrf`,
    })
    .then((response) => response.body?.token);
}

function requestWithCsrf(options) {
  if (!isUnsafeMethod(options.method)) {
    return cy.request(options);
  }

  return getCsrfToken().then((csrfToken) =>
    cy.request({
      ...options,
      headers: {
        ...(options.headers || {}),
        "X-XSRF-TOKEN": csrfToken,
      },
    })
  );
}

Cypress.Commands.add("clearAuthSession", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.Commands.add("ensureTestUser", () => {
  const user = {
    fullName: testUserFullName(),
    email: testUserEmail(),
    password: testUserPassword(),
  };

  return cy
    .then(() =>
      requestWithCsrf({
        method: "POST",
        url: `${apiUrl()}/api/v1/auth/register`,
        body: user,
        failOnStatusCode: false,
      })
    )
    .then((registerResponse) => {
      if ([200, 201].includes(registerResponse.status)) {
        return registerResponse.body;
      }

      return cy
        .then(() =>
          requestWithCsrf({
            method: "POST",
            url: `${apiUrl()}/api/v1/auth/login`,
            body: {
              email: user.email,
              password: user.password,
            },
          })
        )
        .then((loginResponse) => loginResponse.body);
    })
    .then((body) => {
      const userFromBody = extractUser(body);
      if (!userFromBody) {
        return cy
          .then(() =>
            requestWithCsrf({
              method: "POST",
              url: `${apiUrl()}/api/v1/auth/login`,
              body: {
                email: user.email,
                password: user.password,
              },
            })
          )
          .then((loginResponse) => {
            return {
              user: extractUser(loginResponse.body) || {
                email: user.email,
                username: user.email,
                fullName: user.fullName,
              },
            };
          });
      }

      return {
        user: userFromBody || {
          email: user.email,
          username: user.email,
          fullName: user.fullName,
        },
      };
    });
});

Cypress.Commands.add("apiLogin", () => {
  return cy.ensureTestUser().then(() =>
    cy
      .then(() =>
        requestWithCsrf({
          method: "POST",
          url: `${apiUrl()}/api/v1/auth/login`,
          body: {
            email: testUserEmail(),
            password: testUserPassword(),
          },
        })
      )
      .then((response) => {
        return {
          user: extractUser(response.body) || {
            email: testUserEmail(),
            username: testUserEmail(),
            fullName: testUserFullName(),
          },
        };
      })
  );
});

Cypress.Commands.add("loginAndVisit", (path = "/dashboard") => {
  return cy.apiLogin().then((auth) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        storeAuthSession(win, auth);
      },
    });
  });
});

Cypress.Commands.add("apiRequest", ({ method = "GET", path, body, failOnStatusCode = true }) => {
  return cy.apiLogin().then(() =>
    requestWithCsrf({
      method,
      url: `${apiUrl()}${path}`,
      body,
      failOnStatusCode,
    })
  );
});

Cypress.Commands.add("cleanupE2eData", () => {
  const prefix = testDataPrefix();

  cy.apiRequest({ path: "/api/v1/workouts", failOnStatusCode: false }).then((response) => {
    if (response.status >= 400) return;
    const workouts = extractCollection(response.body, ["workouts"]);
    workouts
      .filter((workout) => String(workout?.workoutName || workout?.title || workout?.name || "").includes(prefix))
      .forEach((workout) => {
        const id = getWorkoutId(workout);
        if (id) cy.apiRequest({ method: "DELETE", path: `/api/v1/workouts/${id}`, failOnStatusCode: false });
      });
  });

  cy.apiRequest({ path: "/api/v1/nutrition", failOnStatusCode: false }).then((response) => {
    if (response.status >= 400) return;
    const entries = extractCollection(response.body, ["entries", "nutrition"]);
    entries
      .filter((entry) => String(entry?.mealName || entry?.name || "").includes(prefix))
      .forEach((entry) => {
        const id = getNutritionId(entry);
        if (id) cy.apiRequest({ method: "DELETE", path: `/api/v1/nutrition/${id}`, failOnStatusCode: false });
      });
  });
});

Cypress.Commands.add("createE2eWorkout", (overrides = {}) => {
  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    workoutName: `${testDataPrefix()} Workout`,
    workoutDate: today,
    durationMinutes: 45,
    sets: 3,
    reps: 10,
    weightKg: 25,
    notes: `${testDataPrefix()} notes`,
    description: "Created by Cypress without mocks",
    category: "STRENGTH",
    muscleType: "CHEST",
    exercises: [
      {
        name: `${testDataPrefix()} Bench Press`,
        muscleType: "CHEST",
        sets: 3,
        reps: 10,
        weightKg: 25,
        notes: "",
      },
    ],
    ...overrides,
  };

  return cy.apiRequest({ method: "POST", path: "/api/v1/workouts", body: payload });
});

Cypress.Commands.add("createE2eNutritionEntry", (overrides = {}) => {
  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    mealName: `${testDataPrefix()} Protein Bowl`,
    mealDate: today,
    calories: 520,
    proteinGrams: 42,
    carbsGrams: 48,
    fatGrams: 14,
    notes: `${testDataPrefix()} nutrition notes`,
    category: "LUNCH",
    ...overrides,
  };

  return cy.apiRequest({ method: "POST", path: "/api/v1/nutrition", body: payload });
});

Cypress.Commands.add("setCalorieTarget", (dailyCalorieTarget) => {
  return cy.apiRequest({
    method: "PATCH",
    path: "/api/v1/users/me",
    body: { dailyCalorieTarget },
  });
});

Cypress.Commands.add("fillFieldByLabel", (label, value) => {
  cy.contains("label", label).find("input, textarea, select").first().then(($field) => {
    const tagName = $field[0].tagName.toLowerCase();
    const nextValue = String(value);

    if (tagName === "select") {
      cy.wrap($field).select(nextValue);
      return;
    }

    cy.wrap($field).clear({ force: true });
    cy.contains("label", label).find("input, textarea").first().type(nextValue, { force: true });
  });
});

Cypress.Commands.add("findByAriaLabelFallback", (label) => {
  return cy.get(`[aria-label="${label.replace(/"/g, '\\"')}"]`);
});
