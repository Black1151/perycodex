describe("Login Test", () => {
  it("should log in successfully with valid credentials", () => {
    cy.login("rocco.volpe@sedulo.co.uk", "Rocco123!!");
  });

  describe("Redirect to happiness score", () => {
    it("should redirect to happiness score", () => {
      cy.url().should("include", "happiness-score/dashboard/staff-dashboard");
    });
  });
});
