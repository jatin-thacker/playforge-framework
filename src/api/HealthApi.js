import { ApiClient } from './ApiClient.js';

export class HealthApi extends ApiClient {
  /**
   * Fetches health heartbeat status.
   */
  async getHealth() {
    return await this.get('/api/health');
  }
}
