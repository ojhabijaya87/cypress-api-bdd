import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { BookingDTO } from '../dtos/UserDTO';

let bookingPayload: BookingDTO;
let updatedBookingPayload: BookingDTO;
let bookingId: number;
let authToken: string;

Given(
    /^I have a new booking with firstname "([^"]*)", lastname "([^"]*)", totalprice "([^"]*)", depositpaid "([^"]*)", checkin "([^"]*)", checkout "([^"]*)"$/,
    (
        firstname: string,
        lastname: string,
        totalprice: string, // keep as string to convert later
        depositpaid: string,
        checkin: string,
        checkout: string,
    ) => {
        bookingPayload = {
            firstname,
            lastname,
            totalprice: parseInt(totalprice, 10), // Convert to integer
            depositpaid: depositpaid.toLowerCase() === 'true', // Convert string to boolean
            bookingdates: { checkin, checkout },
        };
    },
);

When('I send a POST request to the booking endpoint', () => {
    const bookingEndpoint = Cypress.env('bookingEndpoint');
    debugger;
    cy.intercept('POST', bookingEndpoint).as('createBooking');
    cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}${bookingEndpoint}`,
        body: bookingPayload,
    }).as('createBookingResponse');

    cy.get('@createBookingResponse').then((response) => {
        cy.log(JSON.stringify(response.body));
        bookingId = response.body.bookingid;
        expect(bookingId).to.exist;
    });
});

Then(
    'I should receive a {int} status code for the POST request',
    (statusCode: number) => {
        cy.get('@createBookingResponse').its('status').should('eq', statusCode);
    },
);

Then(
    'I should receive a {int} status code for the PUT request',
    (statusCode: number) => {
        cy.get('@updateBookingResponse').its('status').should('eq', statusCode);
    },
);

Then(
    'I should receive a {int} status code for the GET request',
    (statusCode: number) => {
        cy.get('@getBookingResponse').its('status').should('eq', statusCode);
    },
);
Then(
    'I should receive a {int} status code for the DELETE request',
    (statusCode: number) => {
        cy.get('@deleteBookingResponse').its('status').should('eq', statusCode);
    },
);
Then('the response body should include the booking data', () => {
    cy.get('@createBookingResponse')
        .its('body.booking')
        .then((responseBody) => {
            expect(responseBody.firstname).to.eq(bookingPayload.firstname);
            expect(responseBody.lastname).to.eq(bookingPayload.lastname);
            expect(responseBody.totalprice).to.eq(bookingPayload.totalprice);
            expect(responseBody.depositpaid).to.eq(bookingPayload.depositpaid);
            expect(responseBody.bookingdates.checkin).to.eq(
                bookingPayload.bookingdates.checkin,
            );
            expect(responseBody.bookingdates.checkout).to.eq(
                bookingPayload.bookingdates.checkout,
            );
        });
});

Then(
    /^the response body should include the booking data for get request$/,
    () => {
        cy.get('@getBookingResponse').then((response) => {
            const responseBody = response.body;
            expect(responseBody.firstname).to.eq(bookingPayload.firstname);
            expect(responseBody.lastname).to.eq(bookingPayload.lastname);
            expect(responseBody.totalprice).to.eq(bookingPayload.totalprice);
            expect(responseBody.depositpaid).to.eq(bookingPayload.depositpaid);
            expect(responseBody.bookingdates.checkin).to.eq(
                bookingPayload.bookingdates.checkin,
            );
            expect(responseBody.bookingdates.checkout).to.eq(
                bookingPayload.bookingdates.checkout,
            );
        });
    },
);

When('I obtain an authorization token from the auth endpoint', () => {
    const authEndpoint = Cypress.env('authEndpoint');

    cy.request({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}${authEndpoint}`,
        body: {
            username: 'admin', // Replace with actual credentials if needed
            password: 'password123',
        },
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        authToken = response.body.token; // Store the token for future requests
        expect(authToken).to.exist;
    });
});

Given(
    'I have updated booking data with firstname {string} and lastname {string}',
    (firstname: string, lastname: string) => {
        updatedBookingPayload = {
            ...bookingPayload,
            firstname,
            lastname,
        };
    },
);

When(
    /^I send a PUT request to the booking endpoint with updated firstname "([^"]*)" and lastname "([^"]*)"$/,
    (updatedFirstName: string, updatedLastName: string) => {
        updatedBookingPayload.firstname = updatedFirstName;
        updatedBookingPayload.lastname = updatedLastName;

        const bookingEndpoint = Cypress.env('bookingEndpoint');

        cy.intercept('PUT', `${bookingEndpoint}/${bookingId}`).as(
            'updateBooking',
        );
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('baseUrl')}${bookingEndpoint}/${bookingId}`,
            body: updatedBookingPayload,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Cookie: `token=${authToken}`, // Use the obtained token
            },
        }).as('updateBookingResponse');
    },
);

When(/^I send a GET request with the created booking ID$/, () => {
    const bookingEndpoint = Cypress.env('bookingEndpoint');
    cy.intercept('PUT', `${bookingEndpoint}/${bookingId}`).as('getBooking');
    cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}${bookingEndpoint}/${bookingId}`,
    }).as('getBookingResponse');
});

Then('the response body should include the updated booking data', () => {
    cy.get('@updateBookingResponse')
        .its('body')
        .then((responseBody) => {
            expect(responseBody.firstname).to.eq(
                updatedBookingPayload.firstname,
            );
            expect(responseBody.lastname).to.eq(updatedBookingPayload.lastname);
        });
});

When('I send a DELETE request to the booking endpoint', () => {
    const bookingEndpoint = Cypress.env('bookingEndpoint');

    cy.intercept('DELETE', `${bookingEndpoint}/${bookingId}`).as(
        'deleteBooking',
    );
    cy.request({
        method: 'DELETE',
        url: `${Cypress.config('baseUrl')}${bookingEndpoint}/${bookingId}`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: `token=${authToken}`, // Use the obtained token
        },
        failOnStatusCode: false, // Ignore failures (optional)
    }).as('deleteBookingResponse');
});
