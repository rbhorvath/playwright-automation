import { test as baseTest, expect, Page } from '@playwright/test';
import { SauceDemoPage, CustomerInfo } from '../pages/sauce-demo.page';
import { USERS, PRODUCT, CUSTOMER_INFO, SORT_OPTION } from './test-data';

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