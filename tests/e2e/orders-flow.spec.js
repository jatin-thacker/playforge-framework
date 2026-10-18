import { test, expect } from '../../src/fixtures/index.js';

test.describe('E2E tests - Orders flow', () => {
  test('logs in as clerk and views orders management table @regression', async ({ loginPage, ordersPage }) => {
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    // Navigate to Orders page using page object
    await ordersPage.goto();

    // Verify orders table and filter controls using page object and component locators
    await expect(ordersPage.table.root).toBeVisible();
    await expect(ordersPage.statusFilter).toBeVisible();
  });
});
