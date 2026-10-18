import { test, expect } from '../../src/fixtures/index.js';

test.describe('API tests - Health check', () => {
  test('returns 200 OK and valid health payload @smoke @regression', async ({ healthApi }) => {
    const response = await healthApi.getHealth();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe('meridian-mock');
  });
});
