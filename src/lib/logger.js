import { test } from '@playwright/test';

/**
 * Test logging utilities that record structured steps and attachments
 * directly into Playwright's test reporter and traces.
 */

/**
 * Runs an action inside a named report step.
 * @template T
 * @param {string} title - Step description shown in Playwright HTML / list report
 * @param {() => Promise<T>} stepFn - Async function performing the step
 * @returns {Promise<T>}
 */
export async function step(title, stepFn) {
  return await test.step(title, stepFn);
}

/**
 * Attaches textual or JSON data to the current test run artifact.
 * @param {import('@playwright/test').TestInfo} testInfo
 * @param {string} name - Label for the attachment
 * @param {string|object} content - Content to attach
 * @param {string} [contentType='text/plain']
 */
export async function attach(testInfo, name, content, contentType = 'text/plain') {
  const body = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
  const type = typeof content === 'object' && contentType === 'text/plain' ? 'application/json' : contentType;
  await testInfo.attach(name, {
    body,
    contentType: type,
  });
}
