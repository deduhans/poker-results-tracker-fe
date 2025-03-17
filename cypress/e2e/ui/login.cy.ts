import type { CreateUser } from '../../../src/types/user/CreateUser';
import { getUser } from '../../support/helper';

describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login form with all fields', () => {
        cy.dataCy('username').should('be.visible');
        cy.dataCy('password').should('be.visible');
        cy.dataCy('submit').should('be.visible');
        cy.dataCy('register').should('be.visible');
    });

    describe('Form Validation', () => {
        it('should validate username requirements', () => {
            cy.dataCy('username').find('input').as('usernameInput');
            
            cy.get('@usernameInput').focus().blur();
            cy.shouldHaveError('Username is required');

            cy.get('@usernameInput').type('ab');
            cy.shouldHaveError('Username must be at least 3 characters');

            cy.get('@usernameInput').clear().type('thisusernameiswaytoolongtobevalid');
            cy.shouldHaveError('Username must be less than 20 characters');

            cy.get('@usernameInput').clear().type('user@name');
            cy.shouldHaveError('Username can only contain letters, numbers, underscores and dashes');

            cy.get('@usernameInput').clear().type('valid_user123');
            cy.contains('Username is required').should('not.exist');
        });

        it('should validate password requirements', () => {
            cy.dataCy('password').find('input').as('passwordInput');
            
            cy.get('@passwordInput').focus().blur();
            cy.shouldHaveError('Password is required');

            cy.get('@passwordInput').type('123');
            cy.shouldHaveError('Password must be at least 8 characters');

            cy.get('@passwordInput').clear().type('abcdefghi');
            cy.shouldHaveError('Password must contain at least one number');

            cy.get('@passwordInput').clear().type('123456789');
            cy.shouldHaveError('Password must contain at least one letter');

            cy.get('@passwordInput').clear().type('ValidPass123');
            cy.contains('Password is required').should('not.exist');
        });
    });

    describe('UI Interactions', () => {
        it('should toggle password visibility', () => {
            cy.dataCy('password').find('input')
                .type('ValidPass123')
                .should('have.attr', 'type', 'password');

            cy.get('.mdi-eye-off').click();
            cy.dataCy('password').find('input').should('have.attr', 'type', 'text');

            cy.get('.mdi-eye').click();
            cy.dataCy('password').find('input').should('have.attr', 'type', 'password');
        });

        it('should navigate to registration page', () => {
            cy.dataCy('register').click();
            cy.url().should('include', '/register');
        });
    });

    describe('Login Flow', () => {
        let testUser: CreateUser;

        beforeEach(() => {
            testUser = getUser();
            cy.createUser(testUser);
        });

        it('should handle successful login', () => {
            cy.intercept('POST', '/auth/login', (req) => {
                req.reply({
                    statusCode: 200,
                    body: {
                        userId: '123',
                        username: testUser.username
                    }
                });
            }).as('loginUser');

            cy.fillLoginForm(testUser.username, testUser.password);
            cy.dataCy('submit').click();
            cy.wait('@loginUser');
            cy.url().should('include', '/home');
        });

        it('should handle login error', () => {
            cy.intercept('POST', '/auth/login', (req) => {
                req.reply({
                    statusCode: 401,
                    body: { message: 'Invalid credentials' }
                });
            }).as('loginError');

            cy.fillLoginForm(testUser.username, testUser.password);
            cy.dataCy('submit').click();
            cy.wait('@loginError');
            cy.dataCy('error-alert').should('be.visible');
            cy.shouldHaveError('Invalid credentials');
            cy.url().should('include', '/login');
        });

        it('should disable form during submission', () => {
            cy.intercept('POST', '/auth/login', (req) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        req.reply({
                            statusCode: 200,
                            body: {
                                userId: '123',
                                username: testUser.username
                            }
                        });
                        resolve();
                    }, 1000);
                });
            }).as('loginDelay');

            cy.fillLoginForm(testUser.username, testUser.password);
            cy.dataCy('submit').click();
            
            // Check form fields disabled state
            ['username', 'password'].forEach(field => {
                cy.shouldBeDisabled(field);
            });

            // Check buttons disabled state
            cy.dataCy('submit').should('be.disabled');
            cy.dataCy('register').should('be.disabled');

            cy.wait('@loginDelay');
            cy.url().should('include', '/home');
        });
    });
});