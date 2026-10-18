import { test, expect } from '../../src/fixtures/index.js';

test.describe('Advanced Interactions - Popups, Tabs, and Downloads', () => {
  test('handles new browser tab / popup via context.waitForEvent @regression', async ({
    context,
    page,
  }) => {
    await page.goto('/index.html?mock=static&seed=42');

    // 1. Listen for new tab event before triggering the action (promise-first pattern)
    const pagePromise = context.waitForEvent('page');

    // 2. Trigger new tab action (Meridian Ops currently lacks native target="_blank" links)
    await page.evaluate(() => {
      window.open('/catalog.html?mock=static&seed=42', '_blank');
    });

    // 3. Await the new Page object and assert its loaded content
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveTitle(/Catalog - Meridian Ops/);
    await expect(newTab.getByRole('heading', { name: 'Catalog', exact: true })).toBeVisible();

    // 4. Clean up opened tab
    await newTab.close();
  });

  test('handles file download via page.waitForEvent with promise-first pattern @regression', async ({
    page,
  }) => {
    await page.goto('/orders.html?mock=static&seed=42');

    // 1. Intercept export endpoint to serve a downloadable attachment
    await page.route('**/api/export/orders.csv', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/csv',
        headers: {
          'Content-Disposition': 'attachment; filename="orders-export.csv"',
        },
        body: 'id,customer,total\nORD-4100,Meera Pillai,19470\nORD-4101,Kabir Chawla,1380\n',
      });
    });

    // 2. Set up download listener before triggering the download event
    const downloadPromise = page.waitForEvent('download');

    // 3. Trigger download action
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = '/api/export/orders.csv';
      link.download = 'orders-export.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });

    // 4. Await download completion and assert file properties
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('orders-export.csv');
  });
});
