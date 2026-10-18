import { test, expect } from '@playwright/test';

test.describe('Smoke tests - Login', () => {
  test('logs in as the clerk and asserts the current user is displayed in the header', async ({ page }) => {
    // ?mock=static makes Meridian Ops answer from fixed files instead of a service worker,
    // which reloads the page once on a fresh browser. seed=42 makes its data the same every run.
    // The app carries both parameters across its own links, so the redirect after sign-in keeps them.
    await page.goto('/login.html?mock=static&seed=42');

    // Fill in credentials using accessible label locators
    await page.getByLabel('Work email').fill('clerk@meridian.test');
    await page.getByLabel('Password').fill('Passw0rd!');

    // Submit the form using the accessible button role
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Assert that the signed-in user appears in the header chrome
    const currentUser = page.getByTestId('current-user');
    await expect(currentUser).toBeVisible();
    await expect(currentUser).toHaveText('Devraj Menon');
  });
});
