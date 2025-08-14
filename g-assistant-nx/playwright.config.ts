/**
 * 🎭 Playwright Configuration
 * تكوين Playwright لاختبارات E2E
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-reports/playwright-report' }],
    ['json', { outputFile: 'test-reports/playwright-results.json' }],
    ['line']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    }
  ],
  webServer: [
    {
      command: 'npm run dev:api',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    },
    {
      command: 'npm run dev:admin-dashboard',
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ],
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      mode: 'only-on-failure',
      threshold: 0.2
    }
  },
  timeout: 60000,
  globalTimeout: 600000,
  outputDir: 'test-reports/playwright-artifacts'
});