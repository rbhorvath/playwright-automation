import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Read environment variables from .env file
dotenv.config();

// Define base URL based on environment
const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';

// Default timeout for all actions
const DEFAULT_TIMEOUT = 30000;

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where tests are located
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 60000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['list'] // Console reporter
  ],
  
  // Global setup for the tests
  globalSetup: path.join(__dirname, 'src/global-setup.ts'),

  // Shared settings for all projects
  use: {
    // Base URL to use in navigation
    baseURL: BASE_URL,
    
    // Default navigation timeout
    navigationTimeout: DEFAULT_TIMEOUT,
    
    // Action timeout
    actionTimeout: DEFAULT_TIMEOUT,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'on-first-retry',
    
    // Viewport dimensions
    viewport: { width: 1280, height: 720 },
    
    // Default locale and timezone
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },
  
  // Configure projects for different browsers
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
  ],
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
}); 