
describe("Kompletr.js", function() {

  describe("DOM expectations", function() {

    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
    });

    it("input element is present", function() {
      cy.get('#auto-complete');
    });

    it("should be initialized with .kompletr element into DOM", function() {
      expect(cy.get('.kompletr')).to.not.be.undefined;
    });

    it("should be initialized with #result element into DOM", function() {
      expect(cy.get('#kompletr-results')).to.not.be.undefined;
    });

  });

  describe("Behaviors", function() {

    beforeEach(function() {
      cy.visit(Cypress.config('baseUrl'));
    });

    it ("should return 0 results with a value length < 2", function() {
      cy.get('#auto-complete').click().type('a').then(() => {
        cy.get('.item--row').should('not.exist');
      });
    });

    it ("should return n results with a value length >= 2", function() {
      cy.get('#auto-complete').click().type('Ter').then(() => {
        cy.get('.item--row').its('length').should('be.gte', 0);
      });
    });

    it ("should complete input when Enter key is pressed", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te')
        .type('{downarrow}')
        .type('{enter}')
        .invoke('val')
        .then((value) => {
          expect(value).to.equals('Teresina');
        })
    });

    it ("should complete input when click is done on a suggestion", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te');
      cy.get('.item--row:first-child')
        .click();
      cy.get('#auto-complete')
        .invoke('val')
        .then((value) => {
          expect(value).to.equals('Teresina');
        })
    });

    it ("should close suggestions when click is done out of the list", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te');
      cy.get('body')
        .click('topRight');
      cy.get('#kompletr-results').should('not.visible');
    });
  });
});