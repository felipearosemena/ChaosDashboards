/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

describe("Creating dashboards", () => {
  it("should allow user to create a dashboard with widgets", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="nav-bar-new-button"]').click();

    cy.url().should("include", "/new");

    cy.get('[data-testid="new-dashboard-title"]').type("New Dashboard");
    cy.get('[data-testid="new-dashboard-button"]').click();

    cy.url().should("include", "/dashboard");

    cy.get('[data-testid="autocomplete-input"] input')
      .should("be.enabled")
      .type("btc/eth{downArrow}{enter}");
    cy.wait(1000).get('[data-testid="stat-card-widget-btc-eth"]', { timeout: 2000 });

    cy.get('[data-testid="autocomplete-input"]').type("eth/btc{downArrow}{enter}");
    cy.wait(1000).get('[data-testid="stat-card-widget-eth-btc"]');

    cy.get('[data-testid="nav-bar-dashboards-button"]').click();

    cy.url().should("equal", "http://localhost:3000/");

    cy.get('[data-testid="delete-dashboard-new-dashboard"]').click({
      multiple: true,
    });

    cy.url().should("equal", "http://localhost:3000/");
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
