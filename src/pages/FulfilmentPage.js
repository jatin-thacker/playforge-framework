import { DatePickerComponent } from '../components/DatePickerComponent.js';

/**
 * Page object representing the Meridian Ops order fulfilment wizard.
 * Locators and actions only; no assertions.
 */
export class FulfilmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.datePicker = new DatePickerComponent(page);

    // Step indicators
    this.stepIndicator = page.getByTestId('step-indicator');

    // Step 1 - Customer & Order details
    this.custName = page.getByTestId('cust-name');
    this.custEmail = page.getByTestId('cust-email');
    this.custPhone = page.getByTestId('cust-phone');
    this.custPo = page.getByTestId('cust-po');
    this.priorityExpress = page.getByTestId('priority-express');
    this.priorityStandard = page.getByTestId('priority-standard');
    this.step1NextButton = page.getByTestId('step-1-next');

    // Step 2 - Logistics
    this.serviceLevel = page.getByTestId('service-level');
    this.courierInput = page.getByTestId('courier-input');
    this.step2NextButton = page.getByTestId('step-2-next');

    // Step 3 - Packing
    this.step3NextButton = page.getByTestId('step-3-next');

    // Step 4 - Review & Submit
    this.confirmAccurate = page.getByTestId('confirm-accurate');
    this.submitButton = page.getByTestId('submit-fulfilment');
    this.submitSuccess = page.getByTestId('submit-success');
    this.createdOrderId = page.getByTestId('created-order-id');
  }

  /**
   * Navigate to the fulfilment page.
   */
  async goto() {
    await this.page.goto('/fulfilment.html?mock=static&seed=42');
  }

  /**
   * Fill Step 1 customer details and proceed.
   * @param {{ name: string, email: string, phone: string, po?: string }} details
   */
  async fillStep1(details) {
    await this.custName.fill(details.name);
    await this.custEmail.fill(details.email);
    await this.custPhone.fill(details.phone);
    if (details.po) await this.custPo.fill(details.po);
    await this.step1NextButton.click();
  }
}
