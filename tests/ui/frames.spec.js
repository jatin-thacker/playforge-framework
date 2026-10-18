import { test, expect } from '../../src/fixtures/index.js';

test.describe('Frames - Single and nested iframe interaction', () => {
  test('interacts with single iframe elements and asserts invoice payment state @regression', async ({
    page,
  }) => {
    await page.goto('/embeds.html?mock=static&seed=42');

    // 1. Locate single iframe using frameLocator
    const invoiceFrame = page.frameLocator('[data-testid="invoice-iframe"]');

    // 2. Validate content inside the iframe
    await expect(invoiceFrame.getByRole('heading', { level: 1 })).toHaveText(/Invoice INV-2026-0441/);
    await expect(invoiceFrame.getByTestId('invoice-table')).toBeVisible();
    await expect(invoiceFrame.getByTestId('invoice-total')).toHaveText('₹12,890');

    // 3. Perform action inside the iframe
    const markPaidButton = invoiceFrame.getByTestId('mark-paid');
    await markPaidButton.click();

    // 4. Assert updated state inside the iframe
    await expect(invoiceFrame.getByTestId('paid-status')).toHaveText('Paid');
    await expect(markPaidButton).toBeDisabled();
  });

  test('chains frameLocator to interact with nested carrier feed iframe @regression', async ({
    page,
  }) => {
    await page.goto('/embeds.html?mock=static&seed=42');

    // 1. Chain frameLocator to reach depth 2 nested iframe
    const nestedFeedFrame = page
      .frameLocator('[data-testid="courier-iframe"]')
      .frameLocator('[data-testid="nested-iframe"]');

    // 2. Validate elements inside the nested iframe
    await expect(nestedFeedFrame.getByTestId('depth-note')).toBeVisible();
    await expect(nestedFeedFrame.getByTestId('carrier-event')).toHaveCount(3);

    // 3. Trigger action inside nested frame
    await nestedFeedFrame.getByTestId('ack-button').click();

    // 4. Assert outcome
    await expect(nestedFeedFrame.getByTestId('ack-result')).toHaveText('Feed acknowledged at depth 2.');
  });
});
