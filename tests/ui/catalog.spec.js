import { test, expect } from '../../src/fixtures/index.js';

test.describe('UI tests - Product Catalog', () => {
  test('displays product grid and category filter @regression', async ({ catalogPage }) => {
    await catalogPage.goto();

    // Assert that the catalog heading and product grid are visible using page object
    await expect(catalogPage.heading).toBeVisible();
    await expect(catalogPage.productGrid).toBeVisible();
    await expect(catalogPage.queryInput).toBeVisible();
  });
});
