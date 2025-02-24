import type { User } from "../../../src/types/user/User";
import type { Room } from "../../../src/types/room/Room";
import { getUser, getRoom } from "../../support/helper";

describe('Room UI', () => {
    let user: User;
    let room: Room;

    beforeEach(() => {
        cy.createUser(getUser()).then((createdUser: User) => {
            user = createdUser;
            cy.wrap(user).login();
        }).then(() => {
            cy.createRoom(getRoom(user?.id)).then((createdRoom: Room) => {
                room = createdRoom;
            });
        });
    });

    it('should show room details', async () => {
        cy.visit(`/room/${room.id}`);

        cy.contains(user.username).should('be.visible');
    })
})