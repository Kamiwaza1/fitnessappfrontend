const apiUrl = () => String(Cypress.env("apiUrl") || "http://localhost:8080").replace(/\/+$/, "");
const testUserEmail = () => Cypress.env("testUserEmail");
const testUserPassword = () => Cypress.env("testUserPassword");
const testUserFullName = () => Cypress.env("testUserFullName");
const testDataPrefix = () => Cypress.env("testDataPrefix") || "cypress-e2e";

function normalizeToken(rawToken) {
  if (typeof rawToken !== "string") return "";
  return rawToken.trim().replace(/^"|"$/g, "").replace(/^Bearer\s+/i, "").trim();
}

function getNestedValue(source, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);
}

function extractAccessToken(data = {}) {
  const candidatePaths = [
    "accessToken",
    "token",
    "jwt",
    "access_token",
    "data.accessToken",
    "data.token",
    "data.jwt",
    "data.access_token",
    "result.accessToken",
    "result.token",
    "result.jwt",
    "user.accessToken",
    "user.token",
    "payload.accessToken",
    "payload.token",
  ];

  return candidatePaths.map((path) => normalizeToken(getNestedValue(data, path))).find(Boolean) || "";
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
  const token = auth.accessToken;
  const user = auth.user || {
    email: testUserEmail(),
    username: testUserEmail(),
    fullName: testUserFullName(),
  };

  ["accessToken", "authToken", "token"].forEach((key) => win.localStorage.setItem(key, token));
  win.localStorage.setItem("user", JSON.stringify(user));
  win.document.cookie = `authToken=${encodeURIComponent(token)};path=/;SameSite=Strict`;
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
    .request({
      method: "POST",
      url: `${apiUrl()}/api/v1/auth/register`,
      body: user,
      failOnStatusCode: false,
    })
    .then((registerResponse) => {
      if ([200, 201].includes(registerResponse.status)) {
        return registerResponse.body;
      }

      return cy
        .request({
          method: "POST",
          url: `${apiUrl()}/api/v1/auth/login`,
          body: {
            email: user.email,
            password: user.password,
          },
        })
        .then((loginResponse) => loginResponse.body);
    })
    .then((body) => {
      const accessToken = extractAccessToken(body);
      if (!accessToken) {
        return cy
          .request({
            method: "POST",
            url: `${apiUrl()}/api/v1/auth/login`,
            body: {
              email: user.email,
              password: user.password,
            },
          })
          .then((loginResponse) => {
            const loginAccessToken = extractAccessToken(loginResponse.body);
            expect(loginAccessToken, "test user access token").to.not.equal("");
            return {
              accessToken: loginAccessToken,
              refreshToken: loginResponse.body?.refreshToken || loginResponse.body?.data?.refreshToken || null,
              user: extractUser(loginResponse.body) || {
                email: user.email,
                username: user.email,
                fullName: user.fullName,
              },
            };
          });
      }

      return {
        accessToken,
        refreshToken: body?.refreshToken || body?.data?.refreshToken || null,
        user: extractUser(body) || {
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
      .request({
        method: "POST",
        url: `${apiUrl()}/api/v1/auth/login`,
        body: {
          email: testUserEmail(),
          password: testUserPassword(),
        },
      })
      .then((response) => {
        const accessToken = extractAccessToken(response.body);
        expect(accessToken, "login access token").to.not.equal("");
        return {
          accessToken,
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
  return cy.apiLogin().then((auth) =>
    cy.request({
      method,
      url: `${apiUrl()}${path}`,
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
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
  cy.contains("label", label).find("input, textarea, select").first().clear().type(String(value));
});

Cypress.Commands.add("findByAriaLabelFallback", (label) => {
  return cy.get(`[aria-label="${label.replace(/"/g, '\\"')}"]`);
});
