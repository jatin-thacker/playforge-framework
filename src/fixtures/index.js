import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { FulfilmentPage } from '../pages/FulfilmentPage.js';

/**
 * Custom Playwright test fixture extending baseTest.
 *
 * Exposes page objects as fixtures so tests receive clean, isolated instances
 * without repetitive boilerplate instantiation in every test body.
 */
export const test = baseTest.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  fulfilmentPage: async ({ page }, use) => {
    await use(new FulfilmentPage(page));
  },
});

export { expect };
