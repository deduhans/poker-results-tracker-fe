import type { CreateUser } from '../../../src/types/user/CreateUser';

describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form with all fields', () => {
    cy.dataCy('username').should('be.visible');
    cy.dataCy('password').should('be.visible');
    cy.dataCy('confirm-password').should('be.visible');
    cy.dataCy('submit').should('be.visible');
    cy.dataCy('back-to-login').should('be.visible');
  });

  describe('Form Validation', () => {
    it('should validate username requirements', () => {
      // Target the actual input element
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
      // Target the actual input element
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

    it('should validate password confirmation', () => {
      // Target the actual input element
      cy.dataCy('password').find('input').as('passwordInput');
      cy.dataCy('confirm-password').find('input').as('confirmPasswordInput');

      cy.get('@passwordInput').type('ValidPass123');
      cy.get('@confirmPasswordInput').type('DifferentPass123');
      cy.shouldHaveError('Passwords must match');

      cy.get('@confirmPasswordInput').clear().type('ValidPass123');
      cy.contains('Passwords must match').should('not.exist');
    });
  });

  describe('UI Interactions', () => {
    it('should toggle password visibility', () => {
      // Target the actual input element
      cy.dataCy('password').find('input').as('passwordInput');

      cy.get('@passwordInput')
        .type('ValidPass123')
        .should('have.attr', 'type', 'password');

      cy.get('.mdi-eye-off').click();
      cy.get('@passwordInput').should('have.attr', 'type', 'text');

      cy.get('.mdi-eye').click();
      cy.get('@passwordInput').should('have.attr', 'type', 'password');
    });

    it('should navigate back to login page', () => {
      cy.dataCy('back-to-login').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Registration Flow', () => {
    const testUser: CreateUser = {
      username: 'testuser123',
      password: 'ValidPass123'
    };

    beforeEach(() => {
      cy.fillRegistrationForm(testUser.username, testUser.password);
    });

    it('should handle successful registration', () => {
      // Intercept the registration request
      cy.intercept('POST', '/users', (req) => {
        req.reply({
          statusCode: 201,
          body: {
            id: '123',
            username: testUser.username
          }
        });
      }).as('registerUser');

      cy.dataCy('submit').click();
      cy.wait('@registerUser');
      cy.url().should('include', '/home');
    });

    it('should handle registration error', () => {
      // Intercept with error response
      cy.intercept('POST', '/users', (req) => {
        req.reply({
          statusCode: 400,
          body: { message: 'Username already exists' }
        });
      }).as('registerError');

      cy.dataCy('submit').click();
      cy.wait('@registerError');
      cy.contains('Username already exists');
      cy.url().should('include', '/register');
    });

    it('should disable form during submission', () => {
      // Intercept with delay
      cy.intercept('POST', '/users', (req) => {
        setTimeout(() => {
          req.reply({
            statusCode: 201,
            body: {
              id: '123',
              username: testUser.username
            }
          });
        }, 1000);
      }).as('registerDelay');

      cy.dataCy('submit').click();

      // Check form fields disabled state
      ['username', 'password', 'confirm-password'].forEach(field => {
        cy.shouldBeDisabled(field);
      });

      // Check buttons disabled state
      cy.dataCy('submit').should('be.disabled');
      cy.dataCy('back-to-login').should('be.disabled');

      cy.wait('@registerDelay');
      cy.url().should('include', '/home');
    });
  });
});
