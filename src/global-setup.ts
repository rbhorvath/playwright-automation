import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './pages/login-page';

/**
 * Global setup for Playwright tests
 * - Handles authentication state setup for faster test execution
 */
async function globalSetup(config: FullConfig) {
  // Use authenticated state if needed across tests
  const { baseURL, storageState } = config.projects[0].use;
  const baseUrl = baseURL as string || 'https://www.saucedemo.com';
  
  // Skip if storage state file is not specified
  if (!storageState || typeof storageState !== 'string') {
    console.log('No storage state file specified, skipping global auth setup');
    return;
  }

  console.log(`Setting up global auth state with storage file: ${storageState}`);
  
  // Create browser and context for authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login using standard user
  const loginPage = new LoginPage(page);
  await page.goto(baseUrl);
  await loginPage.login('standard_user', 'secret_sauce');
  
  // Save storage state to file for use in tests
  await context.storageState({ path: storageState });
  console.log(`Authentication state saved to: ${storageState}`);
  
  // Cleanup
  await browser.close();
}

export default globalSetup; 