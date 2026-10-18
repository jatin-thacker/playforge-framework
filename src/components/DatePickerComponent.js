/**
 * Component representing a date picker widget.
 * Holds locators and actions for date selection; no assertions.
 */
export class DatePickerComponent {
  /**
   * @param {import('@playwright/test').Locator} rootLocator
   */
  constructor(rootLocator) {
    this.root = rootLocator;
    this.panel = this.root.getByTestId('datepicker-panel');
    this.openButton = this.root.getByTestId('open-datepicker');
    this.dateInput = this.root.getByTestId('pickup-date');
    this.prevButton = this.root.getByTestId('datepicker-prev');
    this.nextButton = this.root.getByTestId('datepicker-next');
    this.monthLabel = this.root.getByTestId('datepicker-month');
    this.grid = this.root.getByTestId('datepicker-grid');
  }

  /**
   * Open the date picker panel.
   */
  async open() {
    await this.openButton.click();
  }

  /**
   * Directly fill the date input.
   * @param {string} dateString
   */
  async setDate(dateString) {
    await this.dateInput.fill(dateString);
  }
}
