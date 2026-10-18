/**
 * Component representing a modal dialog widget.
 * Holds locators and actions for modal open/save/cancel; no assertions.
 */
export class ModalComponent {
  /**
   * @param {import('@playwright/test').Locator} rootLocator
   */
  constructor(rootLocator) {
    this.root = rootLocator;
    this.saveButton = this.root.getByTestId('edit-save');
    this.cancelButton = this.root.getByTestId('edit-cancel');
    this.statusSelect = this.root.getByTestId('edit-status');
    this.quantityInput = this.root.getByTestId('edit-qty');
  }

  /**
   * Save changes and close modal.
   */
  async save() {
    await this.saveButton.click();
  }

  /**
   * Cancel and close modal.
   */
  async cancel() {
    await this.cancelButton.click();
  }
}
