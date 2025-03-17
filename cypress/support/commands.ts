/// <reference types="cypress" />

import type { User } from "../../src/types/user/User";
import type { Auth } from "../../src/types/auth/Auth";
import type { Room } from "../../src/types/room/Room";
import type { CreateUser } from "../../src/types/user/CreateUser";
import type { CreateRoom } from "../../src/types/room/CreateRoom";
import type { CreatePlayer } from "../../src/types/player/CreatePlayer";
import type { CreatePayment } from "../../src/types/payment/CreatePayment";
import type { Player } from "../../src/types/player/Player";
import type { Payment } from "../../src/types/payment/Payment";

Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy="${value}"]`)
});

Cypress.Commands.add('fillLoginForm', (username: string, password: string) => {
    cy.dataCy('username').find('input').clear().type(username);
    cy.dataCy('password').find('input').clear().type(password);
});

Cypress.Commands.add('fillRegistrationForm', (username: string, password: string) => {
    cy.dataCy('username').find('input').clear().type(username);
    cy.dataCy('password').find('input').clear().type(password);
    cy.dataCy('confirm-password').find('input').clear().type(password);
});

Cypress.Commands.add('shouldBeDisabled', (dataCyValue: string) => {
    cy.dataCy(dataCyValue).should('have.class', 'v-input--disabled');
    cy.dataCy(dataCyValue).find('input').should('be.disabled');
});

Cypress.Commands.add('shouldHaveError', (message: string) => {
    cy.contains(message).should('be.visible');
});

Cypress.Commands.add('loginViaUI', (username: string, password: string) => {
    cy.visit('/login');
    cy.fillLoginForm(username, password);
    cy.dataCy('submit').click();
});

Cypress.Commands.add('createUser', (user: CreateUser) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + "/users",
        body: user
    }).then((response) => {
        let newUser: User = response.body;
        newUser.password = user.password;
        return newUser;
    });
});

Cypress.Commands.add('createRoom', (room: CreateRoom) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + "/rooms",
        body: room
    }).then((response) => {
        let newRoom: Room = response.body;
        return newRoom;
    });
});

Cypress.Commands.add('createPlayer', (player: CreatePlayer) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + "/players",
        body: player
    }).then((response) => {
        let newPlayer: Player = response.body;
        return newPlayer;
    });
});

Cypress.Commands.add('createPayment', (payment: CreatePayment) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + "/payments",
        body: payment
    }).then((response) => {
        let newPayment: Payment = response.body;
        return newPayment;
    });
});

Cypress.Commands.add('login', { prevSubject: true }, (user: User) => {
    return cy.request({
        method: 'POST',
        url: Cypress.env('apiUrl') + "/auth/login",
        body: {
            username: user.username,
            password: user.password
        } as Auth
    }).then((response) => {
        return response.body as User;
    });
});

Cypress.Commands.add('logout', () => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiUrl') + "/auth/logout"
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            dataCy(value: string): Chainable<any>
            createUser(value: CreateUser): Chainable<any>
            createRoom(value: CreateRoom): Chainable<any>
            createPlayer(value: CreatePlayer): Chainable<any>
            createPayment(value: CreatePayment): Chainable<any>
            login(): Chainable<User>
            logout(): Chainable<void>
            fillLoginForm(username: string, password: string): Chainable<void>
            fillRegistrationForm(username: string, password: string): Chainable<void>
            shouldBeDisabled(dataCyValue: string): Chainable<void>
            shouldHaveError(message: string): Chainable<void>
            loginViaUI(username: string, password: string): Chainable<void>
        }
    }
}

export { }
