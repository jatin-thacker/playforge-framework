import { test, expect } from '../../src/fixtures/index.js';

test.describe('API tests - Health check', () => {
  test('returns 200 OK and valid health payload @smoke @regression', async ({ request }) => {
    const response = await request.get('/api/health?mock=static&seed=42');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe('meridian-mock');
  });
});
