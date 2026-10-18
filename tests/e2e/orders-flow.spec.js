import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';

test.describe('E2E tests - Orders flow', () => {
  test('logs in as clerk and views orders management table @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
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
