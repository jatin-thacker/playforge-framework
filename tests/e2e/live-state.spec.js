import { test, expect } from '../../src/fixtures/index.js';

test.describe('E2E Live State - Supabase live mode persistence', () => {
  test('persists order creation and UI deletion across live API @regression', async ({
    page,
    request,
  }, testInfo) => {
    // Generate unique run id per test combining testInfo and timestamp
    const cleanId = testInfo.testId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const runId = `run_${cleanId}_${Date.now()}`.slice(0, 50);

    // 1. Navigate to orders in live mode while signed out (triggers redirect to login)
    await page.goto(`/orders.html?mock=live&run=${runId}&seed=42`);

    // Log in as Manager (ops@meridian.test)
    await page.getByTestId('login-email').fill('ops@meridian.test');
    await page.getByTestId('login-password').fill('Passw0rd!');
    await page.getByTestId('login-submit').click();

    // Verify redirected back to orders.html in live mode with user session
    await expect(page).toHaveURL(new RegExp(`orders\\.html.*mock=live.*run=${runId}`), { timeout: 10000 });
    await expect(page.getByTestId('current-user')).toHaveText('Anita Rao');
    await expect(page.getByTestId('cfg-mock')).toHaveText('live');

    // 2. Navigate to fulfilment wizard preserving mock and run
    await page.getByRole('link', { name: 'Fulfilment' }).click();
    await expect(page).toHaveURL(new RegExp(`fulfilment\\.html.*mock=live.*run=${runId}`));

    // Complete Step 1: Customer details
    await page.getByTestId('cust-name').fill('Live Tester');
    await page.getByTestId('cust-email').fill('livetester@meridian.test');
    await page.getByTestId('cust-phone').fill('9876543210');
    await page.getByTestId('step-1-next').click();

    // Complete Step 2: Shipment logistics
    await page.getByTestId('courier-input').fill('BlueDart Express');
    await page.getByTestId('step-2-next').click();

    // Complete Step 3: Packing documents
    await page.getByTestId('step-3-next').click();

    // Complete Step 4: Review and submit
    await page.getByTestId('confirm-accurate').check();
    await page.getByTestId('submit-fulfilment').click();

    // Verify success banner and extract created order ID
    await expect(page.getByTestId('submit-success')).toBeVisible();
    const createdId = (await page.getByTestId('created-order-id').textContent()).trim();
    expect(createdId).toMatch(/^ORD-\d+$/);

    // 3. Confirm order exists via direct API call to /api/live/orders
    const listRes = await request.get(`/api/live/orders?run=${runId}&limit=100`);
    expect(listRes.ok()).toBeTruthy();
    const listData = await listRes.json();
    const foundInList = listData.items.find((item) => item.id === createdId);
    expect(foundInList).toBeTruthy();
    expect(foundInList.customer).toBe('Live Tester');

    const singleRes = await request.get(`/api/live/orders/${createdId}?run=${runId}`);
    expect(singleRes.ok()).toBeTruthy();
    const singleData = await singleRes.json();
    expect(singleData.id).toBe(createdId);
    expect(singleData.customer).toBe('Live Tester');

    // 4. Return to Orders page in UI, delete the order, and confirm deletion via API
    await page.getByRole('link', { name: 'Orders' }).click();
    await expect(page).toHaveURL(new RegExp(`orders\\.html.*mock=live.*run=${runId}`));

    // Filter by customer name to bring the row onto page 1
    await page.getByTestId('filter-query').fill('Live Tester');
    await page.getByTestId('apply-filters').click();

    // Find the row for the newly created order
    const orderRow = page.locator(`tr[data-order-id="${createdId}"]`);
    await expect(orderRow).toBeVisible();

    // Accept native confirm() dialog on delete
    page.once('dialog', (dialog) => dialog.accept());
    await orderRow.getByRole('button', { name: 'Delete' }).click();

    // Row should disappear from the UI
    await expect(orderRow).not.toBeVisible();

    // Confirm order is 404 via API
    const postDeleteRes = await request.get(`/api/live/orders/${createdId}?run=${runId}`);
    expect(postDeleteRes.status()).toBe(404);
  });
});
