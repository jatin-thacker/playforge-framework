/**
 * Base API client wrapping Playwright's APIRequestContext.
 * Ensures all calls automatically carry ?mock=static&seed=42 for deterministic static responses.
 */
export class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Appends default mock and seed parameters to URL.
   * @param {string} endpoint
   * @param {Record<string, string|number>} [params]
   * @returns {string}
   */
  buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, 'https://practice.learnplayforge.com');
    if (!url.searchParams.has('mock')) url.searchParams.set('mock', 'static');
    if (!url.searchParams.has('seed')) url.searchParams.set('seed', '42');
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
    return url.pathname + url.search;
  }

  /**
   * Performs a GET request.
   * @param {string} endpoint
   * @param {Record<string, string|number>} [params]
   */
  async get(endpoint, params = {}) {
    const url = this.buildUrl(endpoint, params);
    return await this.request.get(url);
  }

  /**
   * Performs a POST request.
   * @param {string} endpoint
   * @param {any} data
   * @param {Record<string, string|number>} [params]
   */
  async post(endpoint, data = {}, params = {}) {
    const url = this.buildUrl(endpoint, params);
    return await this.request.post(url, { data });
  }
}
