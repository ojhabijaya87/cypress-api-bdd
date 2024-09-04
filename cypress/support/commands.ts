// Custom command to visit a page
Cypress.Commands.add('visitPage', (url: string) => {
    cy.visit(url);
});

// Custom command to type text into an input field
Cypress.Commands.add('typeText', (selector: string, text: string) => {
    cy.get(selector).clear().type(text, { force: true });
});

// Custom command to select an option from a dropdown
Cypress.Commands.add('selectDropdown', (selector: string, option: string) => {
    cy.get(selector).select(option);
});

// Custom command to click a hidden element
Cypress.Commands.add('clickHiddenElement', (selector: string) => {
    cy.get(selector).first().click({ force: true });
});

// Custom command to click an element
Cypress.Commands.add('clickElement', (selector: string) => {
    cy.get(selector).first().click();
});
