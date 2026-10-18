import { test, expect } from '../../src/fixtures/index.js';
import { step, attach } from '../../src/lib/logger.js';
import { generateCustomerEmail, generatePhoneNumber } from '../../src/lib/data.js';
import { getFutureDate } from '../../src/lib/dates.js';

test.describe('UI tests - Fulfilment wizard', () => {
  test('fills customer details and progresses through wizard steps @regression', async ({ loginPage, fulfilmentPage }, testInfo) => {
    await step('Log in as clerk', async () => {
      await loginPage.goto();
      await loginPage.login('clerk@meridian.test', 'Passw0rd!');
      await expect(loginPage.currentUser).toBeVisible();
    });

    await step('Navigate to fulfilment wizard', async () => {
      await fulfilmentPage.goto();
      await expect(fulfilmentPage.stepIndicator).toBeVisible();
    });

    const customerData = {
      name: 'Priya Sharma',
      email: generateCustomerEmail('priya'),
      phone: generatePhoneNumber(),
      po: 'PO-2026-99',
      pickupDate: getFutureDate(3),
    };

    await step('Attach generated test data to report', async () => {
      await attach(testInfo, 'Generated Customer Data', customerData);
    });

    await step('Fill Step 1 customer details and advance', async () => {
      await fulfilmentPage.fillStep1(customerData);
      // Verify Step 2 is reached by asserting Step 2 controls become visible
      await expect(fulfilmentPage.step2NextButton).toBeVisible();
    });
  });
});
