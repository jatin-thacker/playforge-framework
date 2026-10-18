import { test, expect } from '../../src/fixtures/index.js';

test.describe('UI tests - Fulfilment wizard', () => {
  test('displays step 1 customer form and step indicator @regression', async ({ loginPage, fulfilmentPage }) => {
    // Fulfilment requires an authenticated session in Meridian Ops
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();

    await fulfilmentPage.goto();

    // Verify step indicator and initial customer fields
    await expect(fulfilmentPage.stepIndicator).toBeVisible();
    await expect(fulfilmentPage.custName).toBeVisible();
    await expect(fulfilmentPage.custEmail).toBeVisible();
    await expect(fulfilmentPage.step1NextButton).toBeVisible();
  });
});
