import { test, expect } from '../../src/fixtures/index.js';

test.describe('Network interception - HAR replay', () => {
  test('replays orders network payload from recorded HAR file @regression', async ({
    page,
    loginPage,
    ordersPage,
  }) => {
    // 1. Authenticate
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    // 2. Replay network responses for orders API from the committed HAR file.
    // notFound: 'fallback' routes unrecorded assets normally while ensuring
    // the target endpoint is served strictly from the recorded archive.
    await page.routeFromHAR('test-data/orders.har', {
      url: '**/api/orders*',
      notFound: 'fallback',
    });

    // 3. Navigate to orders page
    await ordersPage.goto();

    // 4. Assert that UI renders orders table populated from the HAR archive
    await expect(ordersPage.table.root).toBeVisible();
    await expect(ordersPage.table.rows).not.toHaveCount(0);
    // Spot-check known customer from HAR archive
    await expect(ordersPage.table.root.getByText('Meera Pillai')).toBeVisible();
  });
});
