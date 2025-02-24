import './commands'
import E2EConstoller from '../../src/network/lib/e2e'

const e2eController = new E2EConstoller();

beforeEach(async () => {
    await e2eController.trancate();
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})