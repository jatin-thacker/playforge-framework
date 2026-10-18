import { TableComponent } from '../components/TableComponent.js';
import { ModalComponent } from '../components/ModalComponent.js';

/**
 * Page object representing the Meridian Ops orders management page.
 * Locators and actions only; no assertions.
 */
export class OrdersPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.table = new TableComponent(page.getByTestId('orders-table'));
    this.editModal = new ModalComponent(page.getByTestId('edit-modal'));
    this.statusFilter = page.getByTestId('filter-status');
    this.cityFilter = page.getByTestId('filter-city');
    this.queryFilter = page.getByTestId('filter-query');
    this.pageSizeSelect = page.getByTestId('page-size');
    this.applyFiltersButton = page.getByTestId('apply-filters');
    this.clearFiltersButton = page.getByTestId('clear-filters');
    this.resultCount = page.getByTestId('result-count');
    this.pagePrev = page.getByTestId('page-prev');
    this.pageNext = page.getByTestId('page-next');
    this.pageIndicator = page.getByTestId('page-indicator');
    this.errorMessage = page.getByTestId('orders-error');
    this.emptyMessage = page.getByTestId('orders-empty');
    this.loadingIndicator = page.getByTestId('orders-loading');
  }

  /**
   * Navigate to the orders page.
   */
  async goto() {
    await this.page.goto('/orders.html?mock=static&seed=42');
  }

  /**
   * Filter orders by status.
   * @param {string} status
   */
  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.applyFiltersButton.click();
  }

  /**
   * Filter orders by search query.
   * @param {string} query
   */
  async search(query) {
    await this.queryFilter.fill(query);
    await this.applyFiltersButton.click();
  }

  /**
   * Reset all active filters.
   */
  async clearFilters() {
    await this.clearFiltersButton.click();
  }
}
