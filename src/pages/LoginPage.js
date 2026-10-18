/**
 * Page object representing the Meridian Ops login page.
 *
 * Ground rules for page objects in PlayForge:
 * 1. Locators and actions live here; assertions live in the test specs.
 * 2. User-facing locators (getByLabel, getByRole, getByTestId) are preferred.
 * 3. Navigation pins ?mock=static&seed=42 so Meridian Ops responds deterministically
 *    from static files without service worker reload cycles.
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Work email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByTestId('login-error');
    this.currentUser = page.getByTestId('current-user');
  }

  /**
   * Navigate to the login page with static mock transport and seed.
   */
  async goto() {
    // ?mock=static makes Meridian Ops answer from fixed files instead of a service worker,
    // which reloads the page once on a fresh browser. seed=42 makes its data the same every run.
    await this.page.goto('/login.html?mock=static&seed=42');
  }

  /**
   * Fill in login credentials and submit the form.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
