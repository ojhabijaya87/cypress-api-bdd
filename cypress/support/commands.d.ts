/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        clickElement(locator: string): Chainable<Element>;
        typeText(locator: string, text: string): Chainable<Element>;
        visitPage(url: string): Chainable<Window>;
        selectDropdown(locator: string, value: string): Chainable<Element>;
        assertVisible(locator: string): Chainable<Element>;
        assertContains(locator: string, text: string): Chainable<Element>;
        assertUrlContains(text: string): Chainable<Window>;
        clickHiddenElement(locator: string): Chainable<Element>;
    }
}
