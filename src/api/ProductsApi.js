import { ApiClient } from './ApiClient.js';

export class ProductsApi extends ApiClient {
  /**
   * Fetches paged products list.
   * @param {Record<string, string|number>} [params]
   */
  async getProducts(params = {}) {
    return await this.get('/api/products', params);
  }
}
