import path from 'node:path';
import { test, expect } from '../../src/fixtures/index.js';
import { readExcel } from '../../src/lib/excel.js';

const usersFile = path.resolve('test-data/users.xlsx');
const users = await readExcel(usersFile);

test.describe('E2E tests - Role matrix', () => {
  for (const user of users) {
    if (user.valid === 'true') {
      test(`logs in as ${user.role} (${user.email}) and verifies role identity @regression`, async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(user.email, user.password);

        // Ground rule: assertions stay in the spec
        await expect(loginPage.currentUser).toBeVisible();
        await expect(loginPage.currentUser).toHaveText(user.expectedName);
      });
    } else {
      test(`rejects invalid login for ${user.email} with error message @regression`, async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login(user.email, user.password);

        // Verify that invalid login displays error banner
        await expect(loginPage.errorMessage).toBeVisible();
      });
    }
  }

  test('live check: verifies Meridian Ops API state gap after UI login @regression', async ({ loginPage, page }) => {
    // Perform UI login as manager
    await loginPage.goto();
    await loginPage.login('ops@meridian.test', 'Passw0rd!');
    await expect(loginPage.currentUser).toBeVisible();
    await expect(loginPage.currentUser).toHaveText('Anita Rao');

    // Live check against API: verify whether page.request can confirm UI state
    // Meridian Ops static mock returns static JSON snapshots where auth lives in localStorage
    const sessionRes = await page.request.get('/api/session?mock=static&seed=42');
    expect(sessionRes.status()).toBe(200);
    const sessionData = await sessionRes.json();
    expect(sessionData.note).toContain('localStorage');
  });
});
