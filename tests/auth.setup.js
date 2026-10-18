import { test as setup, expect } from '../src/fixtures/index.js';
import fs from 'node:fs';

const authDir = 'playwright/.auth';
const managerAuthFile = `${authDir}/manager.json`;
const clerkAuthFile = `${authDir}/clerk.json`;

setup('authenticate as manager', async ({ page, loginPage }) => {
  fs.mkdirSync(authDir, { recursive: true });
  await loginPage.goto();
  await loginPage.login('ops@meridian.test', 'Passw0rd!');
  await expect(loginPage.currentUser).toBeVisible();
  await page.context().storageState({ path: managerAuthFile });
});

setup('authenticate as clerk', async ({ page, loginPage }) => {
  fs.mkdirSync(authDir, { recursive: true });
  await loginPage.goto();
  await loginPage.login('clerk@meridian.test', 'Passw0rd!');
  await expect(loginPage.currentUser).toBeVisible();
  await page.context().storageState({ path: clerkAuthFile });
});
