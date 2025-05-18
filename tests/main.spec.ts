import { test as baseTest, expect, Page, Locator } from '@playwright/test';

/**
 * Customer information type for checkout
 */
interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Consolidated Page Object for Sauce Demo (CI-only)
 */
class SauceDemoPage {
  // Base URL
  private readonly baseUrl = 'https://www.saucedemo.com';
  
  // URLs
  private readonly inventoryUrl = '/inventory.html';
  private readonly cartUrl = '/cart.html';
  private readonly checkoutStepOneUrl = '/checkout-step-one.html';
  private readonly checkoutStepTwoUrl = '/checkout-step-two.html';
  private readonly checkoutCompleteUrl = '/checkout-complete.html';

  // Login selectors
  private readonly usernameInput = 'input[data-test="username"]';
  private readonly passwordInput = 'input[data-test="password"]';
  private readonly loginButton = 'input[data-test="login-button"]';
  private readonly errorMessage = '.error-message-container';

  // Inventory selectors
  private readonly productSortContainer = '[data-test="product-sort-container"]';
  private readonly activeOption = '[data-test="active-option"]';
  private readonly shoppingCartLink = '.shopping_cart_link';
  private readonly shoppingCartBadge = '.shopping_cart_badge';

  // Cart selectors
  private readonly checkoutButton = '[data-test="checkout"]';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  private readonly cartItems = '.cart_item';
  private readonly cartItemName = '.inventory_item_name';
  
  // Checkout selectors
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly postalCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly cancelButton = '[data-test="cancel"]';
  private readonly finishButton = '[data-test="finish"]';
  private readonly completeHeader = '.complete-header';
  private readonly backHomeButton = '[data-test="back-to-products"]';
  private readonly itemName = '.inventory_item_name';
  
  constructor(public page: Page) {}

  // Base methods
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async fill(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).innerText();
  }

  // Helper methods
  private getAddToCartButtonSelector(productName: string): string {
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    return `[data-test="add-to-cart-${formattedName}"]`;
  }

  // Login methods
  async navigateToLoginPage(): Promise<void> {
    await this.navigate(this.baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      const element = await this.page.$(this.errorMessage);
      if (!element || !(await element.isVisible())) return null;
      return await this.getText(this.errorMessage);
    } catch {
      return null;
    }
  }

  // Inventory methods
  async sortProducts(option: string): Promise<void> {
    await this.page.selectOption(this.productSortContainer, option);
  }

  async getActiveSortOption(): Promise<string> {
    return await this.getText(this.activeOption);
  }

  async addProductToCart(productName: string): Promise<void> {
    const addToCartButton = this.getAddToCartButtonSelector(productName);
    await this.click(addToCartButton);
  }

  async getCartItemCount(): Promise<string | null> {
    try {
      const badge = this.page.locator(this.shoppingCartBadge);
      if (await badge.isVisible()) {
        return await badge.innerText();
      }
      return null;
    } catch {
      return null;
    }
  }

  async goToCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }

  // Cart methods
  async isProductInCart(productName: string): Promise<boolean> {
    const items = await this.page.locator(this.cartItemName).allTextContents();
    return items.some((item: string) => item.includes(productName));
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  // Checkout methods
  async fillCustomerInfo(customerInfo: CustomerInfo): Promise<void> {
    await this.fill(this.firstNameInput, customerInfo.firstName);
    await this.fill(this.lastNameInput, customerInfo.lastName);
    await this.fill(this.postalCodeInput, customerInfo.postalCode);
  }

  async continueToNextStep(): Promise<void> {
    await this.click(this.continueButton);
  }

  async isProductInReview(productName: string): Promise<boolean> {
    const items = await this.page.locator(this.itemName).allTextContents();
    return items.some((item: string) => item.includes(productName));
  }

  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton);
  }

  async isCheckoutComplete(): Promise<boolean> {
    try {
      return await this.page.locator(this.completeHeader).isVisible();
    } catch {
      return false;
    }
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.getText(this.completeHeader);
  }
}

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

// Test data
const USERS = {
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  LOCKED_OUT: { username: 'locked_out_user', password: 'secret_sauce' },
  INVALID: { username: 'invalid_user', password: 'wrong_password' },
};

const PRODUCT = {
  name: 'Sauce Labs Backpack',
  price: 29.99,
};

const CUSTOMER_INFO: CustomerInfo = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345',
};

const SORT_OPTION = 'lohi'; // Price low to high

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

// E2E Checkout Flow
test.describe('Checkout Flow', () => {
  test('should complete end-to-end purchase flow', async ({ saucePage, page }) => {
    // 1. Login with standard user
    await saucePage.navigateToLoginPage();
    await saucePage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(page).toHaveURL(/inventory.html/);
    
    // 2. Sort products by price (low to high)
    await saucePage.sortProducts(SORT_OPTION);
    const activeSortOption = await saucePage.getActiveSortOption();
    expect(activeSortOption).toBe('Price (low to high)');
    
    // 3. Add product to cart
    await saucePage.addProductToCart(PRODUCT.name);
    const cartCount = await saucePage.getCartItemCount();
    expect(cartCount).toBe('1');
    
    // 4. Go to cart
    await saucePage.goToCart();
    const isProductInCart = await saucePage.isProductInCart(PRODUCT.name);
    expect(isProductInCart).toBeTruthy();
    
    // 5. Proceed to checkout
    await saucePage.proceedToCheckout();
    
    // 6. Fill customer information
    await saucePage.fillCustomerInfo(CUSTOMER_INFO);
    
    // 7. Continue to review order
    await saucePage.continueToNextStep();
    
    // 8. Verify product is in review
    const isProductInReview = await saucePage.isProductInReview(PRODUCT.name);
    expect(isProductInReview).toBeTruthy();
    
    // 9. Complete checkout
    await saucePage.finishCheckout();
    
    // 10. Verify order confirmation
    const isComplete = await saucePage.isCheckoutComplete();
    expect(isComplete).toBeTruthy();
    const confirmationMessage = await saucePage.getConfirmationMessage();
    expect(confirmationMessage).toBe('Thank you for your order!');
  });
}); 