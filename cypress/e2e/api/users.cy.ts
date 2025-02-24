import type { CreateUser } from "../../../src/types/user/CreateUser";
import { getUser } from "../../support/helper";

describe('/users API', () => {
    const url: string = Cypress.env('apiUrl') + "/users";
    const user: CreateUser = getUser();

    it('should create a user', () => {
        cy.request({
            method: 'POST',
            url: url,
            body: user
        }).then((response) => {
            expect(response.status).to.eq(201);
        })
    })

    it('should not create an existing user', () => {
        cy.request({
            method: 'POST',
            url: url,
            body: user,
        });
        cy.request({
            method: 'POST',
            url: url,
            body: user,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(409);
        })
    })
})