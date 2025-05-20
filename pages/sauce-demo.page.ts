import { Page, Locator } from '@playwright/test';

/**
 * Customer information type for checkout
 */
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Consolidated Page Object for Sauce Demo (CI-only)
 */
export class SauceDemoPage {
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
  private readonly firstNameInput = 'input[data-test="firstName"]';
  private readonly lastNameInput = 'input[data-test="lastName"]';
  private readonly postalCodeInput = 'input[data-test="postalCode"]';
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