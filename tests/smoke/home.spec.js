import { test, expect } from '@playwright/test';

test.describe('Smoke tests - Home page', () => {
  test('opens the home page and asserts the operations dashboard heading is visible @smoke', async ({ page }) => {
    // ?mock=static makes Meridian Ops answer from fixed files instead of a service worker,
    // which reloads the page once on a fresh browser. seed=42 makes its data the same every run.
    // The app carries both parameters across its own links, so the redirect after sign-in keeps them.
    await page.goto('/?mock=static&seed=42');

    // Assert that the dashboard heading is visible using user-facing role locator
    const heading = page.getByRole('heading', { name: 'Operations dashboard' });
    await expect(heading).toBeVisible();
  });
});
