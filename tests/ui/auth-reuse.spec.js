import { test, expect } from '../../src/fixtures/index.js';

test.describe('Authentication - Storage state reuse', () => {
  test.describe('Manager session', () => {
    test.use({ storageState: 'playwright/.auth/manager.json' });

    test('accesses orders management directly using saved manager session @regression', async ({
      ordersPage,
      page,
    }) => {
      await ordersPage.goto();
      await expect(ordersPage.table.root).toBeVisible();
      await expect(page.getByTestId('current-user')).toHaveText('Anita Rao');
    });
  });

  test.describe('Clerk session', () => {
    test.use({ storageState: 'playwright/.auth/clerk.json' });

    test('accesses orders management directly using saved clerk session @regression', async ({
      ordersPage,
      page,
    }) => {
      await ordersPage.goto();
      await expect(ordersPage.table.root).toBeVisible();
      await expect(page.getByTestId('current-user')).toHaveText('Devraj Menon');
    });
  });
});
