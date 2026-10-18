import { test, expect } from '../../src/fixtures/index.js';

test.describe('E2E tests - Orders flow', () => {
  test('logs in as clerk and views orders management table @regression', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    // Navigate to Orders page carrying mock and seed parameters
    await page.goto('/orders.html?mock=static&seed=42');

    // Verify orders table is rendered
    const ordersTable = page.getByTestId('orders-table');
    await expect(ordersTable).toBeVisible();

    // Verify filter controls are rendered
    const statusFilter = page.getByTestId('filter-status');
    await expect(statusFilter).toBeVisible();
  });
});
