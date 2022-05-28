describe("Add Note", () => {
  it("user can add notes", () => {
    // login
    cy.visit("http://localhost:3000");
    cy.findByRole("textbox", { name: /email address/i }).type("test@notes.com");
    cy.get('input[name="password"]').type("test@test");
    cy.findByRole("button", { name: /sign in/i }).click();

    // add note
    cy.findByRole("button", { name: /add/i }).click();
    cy.findByRole("textbox", { name: /note \*/i }).type("This is a test note");
    cy.findByRole("button", { name: /add/i }).click();

    // find recenlty added note
    cy.findByText(/this is a test note/i);

    // copy
    cy.findByTestId("MoreVertIcon").click();
    cy.findByRole("menuitem", { name: /copy/i }).click();
    cy.findByText(/text copied/i);

    // toggle complete note
    cy.findByTestId("MoreVertIcon").click();
    cy.findByRole("menuitem", { name: /done/i }).click();
    cy.findByTestId("MoreVertIcon").click();
    cy.findByRole("menuitem", { name: /undone/i }).click();

    // delete note
    cy.findByTestId("MoreVertIcon").click();
    cy.findByRole("menuitem", { name: /delete/i }).click();
    cy.findByRole("button", { name: /delete/i }).click();
    cy.findByText(/text copied/i);
  });
});
