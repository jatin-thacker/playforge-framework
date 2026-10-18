import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';

test.describe('Smoke tests - Login', () => {
  test('logs in as the clerk and asserts the current user is displayed in the header @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('clerk@meridian.test', 'Passw0rd!');

    // Assert that the signed-in user appears in the header chrome
    // Ground rule: assertions stay in the test spec, not inside the page object
    await expect(loginPage.currentUser).toBeVisible();
    await expect(loginPage.currentUser).toHaveText('Devraj Menon');
  });
});
