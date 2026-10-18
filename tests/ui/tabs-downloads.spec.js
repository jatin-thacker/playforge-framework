import fs from 'node:fs';
import { test, expect } from '../../src/fixtures/index.js';

test.describe('Advanced Interactions - Popups, Tabs, and Downloads', () => {
  test('handles new browser tab / popup via context.waitForEvent @regression', async ({
    context,
    page,
  }) => {
    await page.goto('/exports.html?mock=static&seed=42');

    // 1. Listen for new tab event before triggering the action (promise-first pattern with variable)
    const pagePromise = context.waitForEvent('page');

    // 2. Click real target="_blank" link
    await page.getByRole('link', { name: 'Track ORD-4100' }).click();

    // 3. Await the new Page object and assert its loaded content
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveTitle(/Shipment Tracking - Meridian Ops/);
    await expect(newTab.getByRole('heading', { name: 'Shipment ORD-4100', exact: true })).toBeVisible();
    await expect(newTab.getByTestId('tracking-status')).toBeVisible();

    // 4. Clean up opened tab
    await newTab.close();
  });

  test('handles file download via page.waitForEvent with promise-first pattern @regression', async ({
    page,
  }) => {
    await page.goto('/exports.html?mock=static&seed=42');

    // 1. Listen for download event before triggering the action (promise-first pattern with variable)
    const downloadPromise = page.waitForEvent('download');

    // 2. Trigger real download button
    await page.getByRole('button', { name: 'Download CSV' }).click();

    // 3. Await download completion and assert file properties
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('meridian-orders.csv');

    // Verify first line of the saved file
    const downloadPath = await download.path();
    const content = fs.readFileSync(downloadPath, 'utf8');
    const firstLine = content.split('\n')[0].trim();
    expect(firstLine).toBe('id,customer,city,status,sku,item,qty,totalInr,placedAt');
  });
});
