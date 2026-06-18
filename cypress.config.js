const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1366,
    viewportHeight: 768,
    video: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      apiUrl: process.env.CYPRESS_API_URL || process.env.BACKEND_URL || "http://localhost:8080",
      testUserEmail: process.env.CYPRESS_TEST_USER_EMAIL || "cypress.e2e@example.com",
      testUserPassword: process.env.CYPRESS_TEST_USER_PASSWORD || "CypressTest123!",
      testUserFullName: process.env.CYPRESS_TEST_USER_FULL_NAME || "Cypress E2E User",
      testDataPrefix: process.env.CYPRESS_TEST_DATA_PREFIX || "cypress-e2e",
    },
    setupNodeEvents(on) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
