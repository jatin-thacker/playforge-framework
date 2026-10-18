import { defineConfig, devices } from '@playwright/test';
import './config/environments.js';

// Detect whether tests are running in a CI environment
const isCI = !!process.env.CI;

/**
 * Playwright configuration for PlayForge test automation.
 * Beginner-friendly baseline with environment-driven base URL and CI detection.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [['list'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.js/,
    },
  ],
});
