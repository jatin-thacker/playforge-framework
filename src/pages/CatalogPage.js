/**
 * Page object representing the Meridian Ops catalog and cart page.
 * Locators and actions only; no assertions.
 */
export class CatalogPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Catalog' });
    this.productGrid = page.getByTestId('product-grid');
    this.queryInput = page.getByTestId('catalog-query');
    this.categorySelect = page.getByTestId('catalog-category');
    this.searchSubmitButton = page.getByTestId('catalog-search-submit');
    this.cartPanel = page.getByTestId('cart-panel');
    this.cartTotal = page.getByTestId('cart-total');
    this.cartClearButton = page.getByTestId('cart-clear');
    this.cartCheckoutButton = page.getByTestId('cart-checkout');
  }

  /**
   * Navigate to the catalog page.
   */
  async goto() {
    await this.page.goto('/catalog.html?mock=static&seed=42');
  }

  /**
   * Search catalog products by text query and category.
   * @param {string} query
   * @param {string} [category]
   */
  async search(query, category) {
    if (query !== undefined) {
      await this.queryInput.fill(query);
    }
    if (category !== undefined) {
      await this.categorySelect.selectOption(category);
    }
    await this.searchSubmitButton.click();
  }

  /**
   * Add a product to the cart by its index.
   * @param {number} index
   */
  async addProductToCart(index = 0) {
    const card = this.productGrid.locator('.product-card').nth(index);
    const addButton = card.getByRole('button', { name: /Add to cart|Add/i });
    await addButton.click();
  }
}
