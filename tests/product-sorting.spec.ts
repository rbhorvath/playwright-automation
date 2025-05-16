import { test } from '../src/fixtures/test-fixture';
import { expect } from '@playwright/test';
import { Products, SortOptions, CustomerData, URLs } from '../src/utils/test-data';
import { Logger } from '../src/utils/logger';

/**
 * Test suite for product sorting and checkout functionality
 */
test.describe('Product Sorting and Cart Tests', () => {
  // Test specific data
  const PRODUCT = Products.BACKPACK;

  test.beforeEach(async ({ page }) => {
    Logger.info('Starting product sorting and checkout test');
  });

  test('deve ordenar produtos por preço (baixo para alto) e adicionar produto ao carrinho', async ({ 
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    page
  }) => {
    // 1. Login com usuário padrão
    test.info().annotations.push({ type: 'Step', description: 'Login with standard user' });
    await loginPage.navigateToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verify page URL after login
    await expect(page).toHaveURL(new RegExp(URLs.INVENTORY));
    
    // 2. Ordenar produtos por preço (baixo para alto)
    test.info().annotations.push({ type: 'Step', description: 'Sort products by price (low to high)' });
    await inventoryPage.sortProducts(SortOptions.PRICE_LOW_HIGH);
    
    // Verificar se a ordenação foi aplicada
    const activeSortOption = await inventoryPage.getActiveSortOption();
    expect(activeSortOption).toBe('Price (low to high)');
    
    // Take screenshot of sorted products
    await page.screenshot({ path: 'test-results/sorted-products.png' });
    
    // 3. Adicionar produto ao carrinho
    test.info().annotations.push({ type: 'Step', description: 'Add product to cart' });
    await inventoryPage.addProductToCart(PRODUCT.name);
    
    // Verificar se o produto foi adicionado (contador)
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe('1');
    
    // 4. Ir para o carrinho
    test.info().annotations.push({ type: 'Step', description: 'Go to cart and verify product' });
    await inventoryPage.goToCart();
    
    // Verify page URL after going to cart
    await expect(page).toHaveURL(new RegExp(URLs.CART));
    
    // Verificar se o produto está no carrinho
    const isProductInCart = await cartPage.isProductInCart(PRODUCT.name);
    expect(isProductInCart).toBeTruthy();
    
    // 5. Proceder para o checkout
    test.info().annotations.push({ type: 'Step', description: 'Proceed to checkout' });
    await cartPage.proceedToCheckout();
    
    // Verify page URL after going to checkout
    await expect(page).toHaveURL(new RegExp(URLs.CHECKOUT_STEP_ONE));
    
    // 6. Preencher informações do cliente
    test.info().annotations.push({ type: 'Step', description: 'Fill customer information' });
    await checkoutPage.fillCustomerInfo(CustomerData);
    
    // 7. Continuar para revisão do pedido
    test.info().annotations.push({ type: 'Step', description: 'Continue to review order' });
    await checkoutPage.continueToNextStep();
    
    // Verify page URL after continuing to step two
    await expect(page).toHaveURL(new RegExp(URLs.CHECKOUT_STEP_TWO));
    
    // 8. Verificar se o produto está na revisão
    test.info().annotations.push({ type: 'Step', description: 'Verify product in order review' });
    const isProductInReview = await checkoutPage.isProductInReview(PRODUCT.name);
    expect(isProductInReview).toBeTruthy();
    
    // Take screenshot of order review
    await page.screenshot({ path: 'test-results/order-review.png' });
    
    // 9. Finalizar a compra
    test.info().annotations.push({ type: 'Step', description: 'Complete checkout' });
    await checkoutPage.finishCheckout();
    
    // Verify page URL after completing checkout
    await expect(page).toHaveURL(new RegExp(URLs.CHECKOUT_COMPLETE));
    
    // 10. Verificar confirmação de compra
    test.info().annotations.push({ type: 'Step', description: 'Verify order confirmation' });
    const isComplete = await checkoutPage.isCheckoutComplete();
    expect(isComplete).toBeTruthy();
    
    // Verificar mensagem de confirmação
    const confirmationMessage = await checkoutPage.getConfirmationMessage();
    expect(confirmationMessage).toBe('Thank you for your order!');
    
    // Take screenshot of order confirmation
    await page.screenshot({ path: 'test-results/order-confirmation.png' });
  });

  test.afterEach(async ({ page }) => {
    Logger.info('Completed product sorting and checkout test');
  });
}); 