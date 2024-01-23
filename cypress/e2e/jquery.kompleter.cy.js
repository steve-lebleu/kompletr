
describe("Kompleter.js", function() {

  describe("jQuery expectations", function() {

    it("should embedd jQuery", function() {
      expect(Cypress.$).to.be.not.undefined;
    });

  });

  describe("DOM expectations", function() {

    beforeEach(() => {
      cy.visit(Cypress.config('baseUrl'));
    });

    it("input element is present", function() {
      cy.get('#auto-complete');
    });

    it("required data-url attribute is present", function() {
      cy.get('#auto-complete').invoke('attr', 'data-url').then(url => {
        expect(url).equals('files/kompleter.json');
      });
    });

    it("required data-filter-on attribute is present", function() {
      cy.get('#auto-complete').invoke('attr', 'data-filter-on').then(filter => {
        expect(filter).equals('Name');
      });
    });

    it("required data-fields attribute is present", function() {
      cy.get('#auto-complete').invoke('attr', 'data-fields').then(fields => {
        expect(fields).equals('Name,CountryCode,Population');
      });
    });

    it("should be initialized with #searcher element into DOM", function() {
      expect(cy.get('#searcher')).to.not.be.undefined;
    });

    it("should be initialized with #result element into DOM", function() {
      expect(cy.get('#result')).to.not.be.undefined;
    });

  });

  describe("Behaviors", function() {

    beforeEach(function() {
      cy.visit(Cypress.config('baseUrl'));
    });

    it ("should return 0 results with a value length < 2", function() {
      cy.get('#auto-complete').click().type('a').then(() => {
        cy.get('.item--result').should('not.exist');
      });
    });

    it ("should return n results with a value length >= 2", function() {
      cy.get('#auto-complete').click().type('Te').then(() => {
        cy.get('.item--result').its('length').should('be.gte', 0);
      });
    });

    it ("should complete input when Enter key is pressed", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te')
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
      cy.get('.item--result:first-child')
        .click();
      cy.get('#auto-complete')
        .invoke('val')
        .then((value) => {
          expect(value).to.equals('Teresina');
        })
    });

    xit ("should close suggestions when click is done out of the list", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te');
      cy.get('body')
        .click();
      cy.get('.item--result').should('not.exist');
    });

    xit ("should navigate between suggestions using keyboard", function() {
      cy.get('#auto-complete')
        .click()
        .type('Te');
      cy.get('.item--result:first-child')
        .click();
    });
  });
});