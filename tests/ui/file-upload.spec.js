import { test, expect } from '../../src/fixtures/index.js';

test.describe('File Upload - Standard and hidden inputs', () => {
  test.use({ storageState: 'playwright/.auth/clerk.json' });

  test('uploads files via standard visible input and hidden file input @regression', async ({
    page,
    fulfilmentPage,
  }) => {
    await fulfilmentPage.goto();

    // 1. Progress past Step 1 (Customer details)
    await fulfilmentPage.fillStep1({
      name: 'Ananya Roy',
      email: 'ananya@meridian.test',
      phone: '9876543210',
    });

    // 2. Progress past Step 2 (Logistics / Courier selection)
    await fulfilmentPage.courierInput.fill('Delhivery');
    await page.getByTestId('courier-option').first().click();
    await fulfilmentPage.step2NextButton.click();

    // 3. Step 3 (Documents) is now active
    await expect(fulfilmentPage.invoiceFileInput).toBeAttached();

    // 4. Upload file using standard labelled file input
    await fulfilmentPage.invoiceFileInput.setInputFiles('test-data/orders.csv');
    await expect(fulfilmentPage.invoiceFileName).toHaveText('orders.csv');

    // 5. Upload file directly to hidden input without clicking proxy button.
    // Playwright's setInputFiles bypasses standard actionability checks for visibility,
    // solving stylized/hidden file input interactions cleanly.
    await fulfilmentPage.hiddenPhotoInput.setInputFiles({
      name: 'package-photo.png',
      mimeType: 'image/png',
      buffer: Buffer.from('mock-package-image-binary-content'),
    });
    await expect(fulfilmentPage.photoFileName).toHaveText('package-photo.png');
  });
});
