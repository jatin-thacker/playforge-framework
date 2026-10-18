import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { OrdersPage } from '../pages/OrdersPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { FulfilmentPage } from '../pages/FulfilmentPage.js';
import { HealthApi, ProductsApi, OrdersApi } from '../api/index.js';

/**
 * Custom Playwright test fixture extending baseTest.
 *
 * Exposes page objects and API clients as fixtures so tests receive clean, isolated instances
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
  healthApi: async ({ request }, use) => {
    await use(new HealthApi(request));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },
  ordersApi: async ({ request }, use) => {
    await use(new OrdersApi(request));
  },
});

export { expect };
