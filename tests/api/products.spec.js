import { test, expect } from '../../src/fixtures/index.js';

test.describe('API tests - Products catalog', () => {
  test('returns 200 with paged products schema and expected product @smoke @regression', async ({ productsApi }) => {
    const response = await productsApi.getProducts();

    // 1. Assert Status
    expect(response.status()).toBe(200);

    // 2. Assert Shape
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);

    // 3. Assert Specific Value
    const firstProduct = body.items[0];
    expect(firstProduct.sku).toBe('MRD-1001');
    expect(firstProduct.name).toBe('Aurora Pour-Over Kettle');
    expect(firstProduct.priceInr).toBe(4290);
  });
});
