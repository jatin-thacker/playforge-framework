import { ApiClient } from './ApiClient.js';

export class OrdersApi extends ApiClient {
  /**
   * Fetches paged orders list.
   * @param {Record<string, string|number>} [params]
   */
  async getOrders(params = {}) {
    return await this.get('/api/orders', params);
  }

  /**
   * Fetches a specific order by ID.
   * @param {string} orderId
   */
  async getOrderById(orderId) {
    return await this.get(`/api/orders/${orderId}`);
  }
}
