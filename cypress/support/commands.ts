/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

///<reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in the user.
     * @param email - The email of the user (optional, defaults to Cypress.env("email"))
     * @param password - The password of the user (optional, defaults to Cypress.env("password"))
     */
    login(email?: string, password?: string): Chainable<void>;
    logout(): Chainable<void>;
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add(
  "getByTestId",
  (testId: string): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get(`[data-testid="${testId}"]`);
  }
);

Cypress.Commands.add("login", (email?: string, password?: string) => {
  const userEmail = email || Cypress.env("email") || "rocco.volpe@sedulo.co.uk";
  const userPassword = password || Cypress.env("password") || "Rocco123!!";
  const baseUrl = Cypress.config("baseUrl") || "https://dev.perygon.co.uk";

  // cy.visit(`${baseUrl}/login`);
  // cy.get('input[name="email"]').type(userEmail);
  // cy.get('input[name="password"]').type(userPassword);
  // cy.get('button[type="submit"]').click();
  // cy.url().should("not.include", "/login");
  cy.visit(`${baseUrl}/login`);
  cy.getByTestId("login-form-email-input").type(userEmail);
  cy.getByTestId("login-form-password-input").type(userPassword);
  cy.getByTestId("login-form-login-button").click();
  cy.url().should("not.include", "/login");
});

Cypress.Commands.add("logout", () => {
  // Open the profile menu
  cy.getByTestId("navbar-profile-menu-button").click();

  // Click the logout button
  cy.getByTestId("navbar-logout-button").click();

  // Confirm that the user is redirected to the login page
  cy.url().should("include", "/login");
});
