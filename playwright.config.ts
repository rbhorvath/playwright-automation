import { defineConfig, devices } from '@playwright/test';

/**
 * Ultra-minimal CI-focused configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on',
    screenshot: 'only-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  outputDir: 'test-results/',
}); 