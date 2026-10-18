import { test, expect } from '@playwright/test';

test.describe('UI tests - Product Catalog', () => {
  test('displays product grid and category filter @regression', async ({ page }) => {
    // ?mock=static makes Meridian Ops answer from fixed files instead of a service worker.
    // seed=42 makes its data deterministic every run.
    await page.goto('/catalog.html?mock=static&seed=42');

    // Assert that the catalog heading is visible using accessible role locator
    const heading = page.getByRole('heading', { name: 'Catalog' });
    await expect(heading).toBeVisible();

    // Verify product grid contains products
    const productGrid = page.getByTestId('product-grid');
    await expect(productGrid).toBeVisible();

    // Verify search query input is accessible
    const searchInput = page.getByTestId('catalog-query');
    await expect(searchInput).toBeVisible();
  });
});
