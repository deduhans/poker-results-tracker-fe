import type { User } from "../../../src/types/user/User";
import type { Room } from "../../../src/types/room/Room";
import { getUser, getRoom, getPayment } from "../../support/helper";
import type { Player } from "../../../src/types/player/Player";

describe('/players API', () => {
    const url: string = Cypress.env('apiUrl') + "/payments";
    let user: User;
    let room: Room;
    let player: Player;

    beforeEach(() => {
        cy.createUser(getUser()).then((createdUser: User) => {
            user = createdUser;
            cy.wrap(user).login();
        }).then(() => {
            cy.createRoom(getRoom(user?.id)).then((createdRoom: Room) => {
                room = createdRoom;
                player = createdRoom.players[0];
            });
        });
    });

    it('should create a payment', () => {
        cy.request({
            method: 'POST',
            url: url,
            body: getPayment(room.id, player.id)
        }).then((response) => {
            expect(response.status).to.eq(201);
        })
    })
})