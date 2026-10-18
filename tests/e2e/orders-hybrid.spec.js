import { test, expect } from '../../src/fixtures/index.js';

test.describe('Hybrid tests - API setup and UI validation', () => {
  test('fetches order reference via API client and validates row in UI table @regression', async ({
    ordersApi,
    loginPage,
    ordersPage,
  }) => {
    // 1. API setup/read phase
    const response = await ordersApi.getOrders();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items.length).toBeGreaterThan(0);
    const targetOrder = body.items[0]; // e.g. ORD-4100, Meera Pillai

    // 2. UI interaction phase
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    await ordersPage.goto();

    // 3. UI validation phase: verify the order fetched via API appears in the UI table
    await expect(ordersPage.table.root).toBeVisible();
    const customerCell = ordersPage.table.root.getByText(targetOrder.customer);
    await expect(customerCell).toBeVisible();
  });
});
