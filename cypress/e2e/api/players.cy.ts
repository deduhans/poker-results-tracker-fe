import type { User } from "../../../src/types/user/User";
import type { Room } from "../../../src/types/room/Room";
import { getUser, getRoom, getPlayer } from "../../support/helper";

describe('/players API', () => {
    const url: string = Cypress.env('apiUrl') + "/players";
    let user: User;
    let room: Room;

    beforeEach(() => {
        cy.createUser(getUser()).then((createdUser: User) => {
            user = createdUser;
        }).login()
            .then(() => {
                cy.createRoom(getRoom(user?.id)).then((createdRoom: Room) => {
                    room = createdRoom;
                });
            });
    });

    it('should create a player', () => {
        cy.request({
            method: 'POST',
            url: url,
            body: getPlayer(user.id, room.id)
        }).then((response) => {
            expect(response.status).to.eq(201);
        })
    })
})