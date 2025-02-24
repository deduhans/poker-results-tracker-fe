import AuthController from '../../../src/network/lib/auth'
import UserController from '../../../src/network/lib/user'
import type { CreateUser } from '../../../src/types/user/CreateUser';
import { getUser } from '../../support/helper';

const authController = new AuthController();
const userController = new UserController();

describe('Login page', () => {


    it.only('should log in successfully', () => {
        let user: CreateUser = getUser();

        cy.wrap(null).then(async () => {
            await userController.createUser(user);
        })

        cy.visit('/login');

        cy.dataCy('username').type(user.username);
        cy.dataCy('password').type(user.password);
        cy.dataCy('submit').click();

        cy.url().should('include', '/home');
    })

    it('should not log in with incorrect username', () => {

    });
})