import { test, expect } from '../../src/fixtures/index.js';

test.describe('Network interception - Mocked error states', () => {
  test('displays user-facing error banner when orders API fails @regression', async ({
    page,
    loginPage,
    ordersPage,
  }) => {
    // 1. Authenticate first so orders page does not redirect to login
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    // 2. Intercept the orders endpoint and simulate server failure (500)
    // ?mock=static&seed=42 is preserved on page navigations
    await page.route('**/api/orders*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error: Database unreachable',
      });
    });

    // 3. Navigate to orders page
    await ordersPage.goto();

    // 4. Verify the application handles the failure and shows the accessible error banner
    await expect(ordersPage.errorMessage).toBeVisible();
    await expect(ordersPage.errorMessage).toHaveText('Could not load orders.');
    await expect(ordersPage.errorMessage).toHaveAttribute('role', 'alert');

    // Verify table is not rendered when the API fails
    await expect(ordersPage.table.root).not.toBeVisible();
  });

  test('displays empty state when orders API returns empty collection @regression', async ({
    page,
    loginPage,
    ordersPage,
  }) => {
    // 1. Authenticate
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    // 2. Intercept orders API and return zero items
    await page.route('**/api/orders*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          total: 0,
          page: 1,
          limit: 10,
          items: [],
        }),
      });
    });

    // 3. Navigate
    await ordersPage.goto();

    // 4. Verify empty state message appears
    await expect(ordersPage.emptyMessage).toBeVisible();
    await expect(ordersPage.emptyMessage).toHaveText('No orders match those filters.');
    await expect(ordersPage.table.root).not.toBeVisible();
  });
});
