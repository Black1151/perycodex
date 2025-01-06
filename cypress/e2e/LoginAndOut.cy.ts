describe("Login and out", () => {
  it("should log in and out", () => {
    cy.login();
    cy.wait(6000);
    cy.url().should("include", "happiness-score/dashboard/staff-dashboard");
    cy.logout();
  });
});
