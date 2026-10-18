import { test, expect } from '../../src/fixtures/index.js';

test.describe('API tests - Orders management', () => {
  test('returns 200 with paged orders schema and expected order record @regression', async ({ ordersApi }) => {
    const response = await ordersApi.getOrders();

    // 1. Assert Status
    expect(response.status()).toBe(200);

    // 2. Assert Shape
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);

    // 3. Assert Specific Value
    const firstOrder = body.items[0];
    expect(firstOrder.id).toBe('ORD-4100');
    expect(firstOrder.customer).toBe('Meera Pillai');
    expect(firstOrder.status).toBe('packed');
  });
});
