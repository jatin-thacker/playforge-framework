import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

/**
 * Custom Playwright test fixture extending baseTest.
 *
 * Ground rule: Every spec in the framework imports `test` and `expect` from this
 * fixture module, never directly from '@playwright/test'.
 *
 * Page objects are injected as fixtures so tests receive clean, isolated instances
 * without repetitive boilerplate instantiation in every test body.
 */
export const test = baseTest.extend({
  /**
   * LoginPage fixture providing an initialized LoginPage instance scoped to the test page.
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect };
