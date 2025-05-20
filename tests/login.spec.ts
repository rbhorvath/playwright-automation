import { test as baseTest, expect, Page } from '@playwright/test';
import { SauceDemoPage } from '../pages/sauce-demo.page';
import { USERS } from './test-data';

// Define test fixture with typings
interface TestFixtures {
  saucePage: SauceDemoPage;
}

const test = baseTest.extend<TestFixtures>({
  saucePage: async ({ page }, use) => {
    const saucePage = new SauceDemoPage(page);
    await use(saucePage);
  }
});

// Login Tests
test.describe('Login Tests', () => {
  test('should login with valid credentials', async ({ saucePage, page }) => {
    await saucePage.navigateToLoginPage();
    await saucePage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('should show error with invalid credentials', async ({ saucePage }) => {
    await saucePage.navigateToLoginPage();
    await saucePage.login(USERS.INVALID.username, USERS.INVALID.password);
    const errorMessage = await saucePage.getErrorMessage();
    expect(errorMessage).not.toBeNull();
  });

  test('should block locked_out_user', async ({ saucePage }) => {
    await saucePage.navigateToLoginPage();
    await saucePage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    const errorMessage = await saucePage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });
}); 