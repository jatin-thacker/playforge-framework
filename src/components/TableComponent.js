/**
 * Component representing a data table widget.
 * Holds locators and actions for row/cell querying; no assertions.
 */
export class TableComponent {
  /**
   * @param {import('@playwright/test').Locator} rootLocator
   */
  constructor(rootLocator) {
    this.root = rootLocator;
    this.rows = this.root.locator('tbody tr');
    this.headers = this.root.locator('thead th');
  }

  /**
   * Returns a row locator matching text or index.
   * @param {number} index
   */
  getRow(index) {
    return this.rows.nth(index);
  }

  /**
   * Returns cell text content locator for a given row and column index.
   * @param {number} rowIndex
   * @param {number} colIndex
   */
  getCell(rowIndex, colIndex) {
    return this.getRow(rowIndex).locator('td').nth(colIndex);
  }

  /**
   * Get row count locator.
   */
  get rowCount() {
    return this.rows;
  }
}
