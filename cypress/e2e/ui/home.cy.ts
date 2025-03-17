import type { CreateUser } from '../../../src/types/user/CreateUser';
import type { Room } from '../../../src/types/room/Room';
import { RoomStatusEnum } from '../../../src/types/room/RoomStatusEnum';
import { getUser, getRoom } from '../../support/helper';

describe('Home Page', () => {
    const createUser: CreateUser = getUser();
    let user: any;

    beforeEach(() => {
        cy.createUser(createUser)
            .then((newUser) => {
                user = newUser;
                cy.wrap(newUser).login();
            });
    });

    describe('Navigation and Authentication', () => {
        it('should redirect to login when not authenticated', () => {
            // Clear any existing session
            cy.clearCookies();
            cy.clearLocalStorage();

            // Try to access home page
            cy.visit('/home');
            cy.url().should('include', '/login');
        });

        it('should logout and redirect to login when clicking logout button', () => {
            cy.visit('/home');

            // Click logout in overflow menu
            cy.dataCy('overflow-menu').click();
            cy.dataCy('logout-button').click();

            // Verify redirect and session cleared
            cy.url().should('include', '/login');
        });

        it('should persist user session on page reload', () => {
            cy.visit('/home');
            cy.dataCy('home-page').should('be.visible');

            // Reload and check if still logged in
            cy.reload();
            cy.dataCy('home-page').should('be.visible');
            cy.url().should('include', '/home');
        });
    });

    describe('Page Layout', () => {
        beforeEach(() => {
            cy.visit('/home');
        });

        it('should display all main sections (header, room lists, create button)', () => {
            cy.dataCy('home-page').should('be.visible');
            cy.contains('Rooms').should('be.visible');
            cy.dataCy('new-room-button').should('be.visible');
            cy.dataCy('open-rooms').should('be.visible');
            cy.dataCy('closed-rooms').should('be.visible');
        });

        it('should show correct navigation elements', () => {
            cy.dataCy('overflow-menu').should('be.visible');
            cy.dataCy('overflow-menu').click();
            cy.dataCy('logout-button').should('be.visible');
        });
    });

    describe('Room Lists Display', () => {
        it('should display open rooms list with correct information', () => {
            // Create a room via API
            const room = getRoom(user.id, { name: 'Test Room 1', exchange: 10 });
            cy.createRoom(room);

            cy.visit('/home');

            cy.dataCy('home-page').within(() => {
                cy.contains('Open Rooms').should('be.visible');
                cy.contains('Test Room 1').should('be.visible');
                cy.contains('Exchange rate: 10€').should('be.visible');
                cy.get('.mdi-door-open').should('be.visible');
                cy.contains('opened').should('be.visible');
            });
        });

        it('should display closed rooms list with correct information', () => {
            // Create a room and close it via API
            const room = getRoom(user.id, { name: 'Test Room 2', exchange: 20 });
            cy.createRoom(room).then((newRoom) => {
                cy.request({
                    method: 'PATCH',
                    url: `${Cypress.env('apiUrl')}/rooms/${newRoom.id}/status`,
                    body: { status: RoomStatusEnum.Closed }
                });
            });

            cy.visit('/home');

            cy.dataCy('home-page').within(() => {
                cy.contains('Closed Rooms').should('be.visible');
                cy.contains('Test Room 2').should('be.visible');
                cy.contains('Exchange rate: 20€').should('be.visible');
                cy.get('.mdi-door-closed').should('be.visible');
                cy.contains('closed').should('be.visible');
            });
        });

        it('should show empty state when no rooms available', () => {
            cy.visit('/home');

            cy.dataCy('open-rooms').within(() => {
                cy.contains('No open rooms available').should('be.visible');
            });
            cy.dataCy('closed-rooms').within(() => {
                cy.contains('No closed rooms available').should('be.visible');
            });
        });
    });

    describe('Room Creation', () => {
        beforeEach(() => {
            cy.visit('/home');
            cy.dataCy('new-room-button').click();
        });

        it('should open create room dialog when clicking new room button', () => {
            cy.contains('Create New Room').should('be.visible');
            cy.dataCy('room-name').should('be.visible');
            cy.dataCy('room-exchange').should('be.visible');
            cy.dataCy('create-button').should('be.visible');
            cy.dataCy('cancel-button').should('be.visible');
        });

        it('should validate room name input', () => {
            const nameInput = cy.dataCy('room-name').find('input');

            // Empty validation
            nameInput.focus().blur();
            cy.contains('Room name is required').should('be.visible');

            // Min length validation
            nameInput.type('ab');
            cy.contains('Name must be at least 3 characters').should('be.visible');

            // Max length validation
            nameInput.clear().type('a'.repeat(51));
            cy.contains('Name must be less than 50 characters').should('be.visible');

            // Valid input
            nameInput.clear().type('Valid Room Name');
            cy.contains('Room name is required').should('not.exist');
        });

        it('should validate exchange rate input', () => {
            const exchangeInput = cy.dataCy('room-exchange').find('input');

            // Empty validation
            exchangeInput.focus().blur();
            cy.contains('Exchange rate is required').should('be.visible');

            // Min value validation
            exchangeInput.type('0');
            cy.contains('Exchange rate must be greater than 0').should('be.visible');

            // Max value validation
            exchangeInput.clear().type('1001');
            cy.contains('Exchange rate must be less than 1000€').should('be.visible');

            // Valid input
            exchangeInput.clear().type('50');
            cy.contains('Exchange rate is required').should('not.exist');
        });

        it('should create room successfully with valid inputs', () => {
            const roomName = 'New Test Room';
            const exchange = 30;

            cy.dataCy('room-name').find('input').type(roomName);
            cy.dataCy('room-exchange').find('input').type(exchange.toString());
            cy.dataCy('create-button').click();

            // Verify room was created and we're redirected
            cy.url().should('match', /\/room\/\d+$/);

            // Verify room exists in the database
            cy.request({
                method: 'GET',
                url: Cypress.env('apiUrl') + '/rooms'
            }).then((response) => {
                const rooms = response.body;
                const createdRoom = rooms.find((r: Room) => r.name === roomName && r.exchange === exchange);
                expect(createdRoom).to.exist;
            });
        });

        it('should show error message when room creation fails', () => {
            // First create a room
            const roomName = 'Test Room';
            cy.createRoom(getRoom(user.id, { name: roomName, exchange: 30 }));

            // Try to create another room with the same name
            cy.dataCy('room-name').find('input').type(roomName);
            cy.dataCy('room-exchange').find('input').type('30');
            cy.dataCy('create-button').click();

            cy.dataCy('error-alert').should('be.visible');
            cy.contains('Room name already exists').should('be.visible');
        });

        it('should disable form during submission', () => {
            cy.dataCy('room-name').find('input').type('Test Room');
            cy.dataCy('room-exchange').find('input').type('30');
            cy.dataCy('create-button').click();

            // Check disabled state during submission
            cy.dataCy('room-name').should('have.class', 'v-input--disabled');
            cy.dataCy('room-exchange').should('have.class', 'v-input--disabled');
            cy.dataCy('create-button').should('be.disabled');
            cy.dataCy('cancel-button').should('be.disabled');

            // Wait for redirect after creation
            cy.url().should('match', /\/room\/\d+$/);
        });

        it('should close dialog on successful creation', () => {
            cy.dataCy('room-name').find('input').type('Test Room');
            cy.dataCy('room-exchange').find('input').type('30');
            cy.dataCy('create-button').click();

            cy.contains('Create New Room').should('not.exist');
            cy.url().should('match', /\/room\/\d+$/);
        });

        it('should close dialog on cancel', () => {
            cy.dataCy('cancel-button').click();
            cy.contains('Create New Room').should('not.exist');
        });
    });
});