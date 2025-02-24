import type { CreateUser } from "../../../src/types/user/CreateUser";
import type { User } from "../../../src/types/user/User";
import type { CreateRoom } from "../../../src/types/room/CreateRoom";
import { getUser, getRoom } from "../../support/helper";

describe('/rooms API', () => {
    const url: string = Cypress.env('apiUrl') + "/rooms";
    let user: User;

    beforeEach(() => {
        cy.createUser(getUser()).then((createdUser: User) => {
            user = createdUser;
        }).login();
    });

    it('should create a room', () => {
        cy.request({
            method: 'POST',
            url: url,
            body: getRoom(user.id)
        }).then((response) => {
            expect(response.status).to.eq(201);
        })
    })


})