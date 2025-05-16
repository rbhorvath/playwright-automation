import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';

/**
 * Page Object para a página de carrinho de compras
 */
export class CartPage extends BasePage {
  // Seletores
  private readonly checkoutButton = '[data-test="checkout"]';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  private readonly cartItems = '.cart_item';
  private readonly cartItemName = '.inventory_item_name';
  private readonly removeButton = '[data-test="remove-sauce-labs-';
  
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar para a página do carrinho
   */
  async navigateToCart(): Promise<void> {
    await this.navigate('/cart.html');
  }

  /**
   * Verificar se um produto está no carrinho
   */
  async isProductInCart(productName: string): Promise<boolean> {
    Logger.info(`Verificando se o produto "${productName}" está no carrinho`);
    const items = await this.page.locator(this.cartItemName).allTextContents();
    return items.some(item => item.includes(productName));
  }

  /**
   * Obter todos os produtos no carrinho
   */
  async getCartProducts(): Promise<string[]> {
    return await this.page.locator(this.cartItemName).allTextContents();
  }

  /**
   * Remover produto do carrinho
   */
  async removeProduct(productName: string): Promise<void> {
    Logger.info(`Removendo produto do carrinho: ${productName}`);
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    const removeSelector = `[data-test="remove-${formattedName}"]`;
    await this.click(removeSelector);
  }

  /**
   * Continuar comprando (voltar para a página de inventário)
   */
  async continueShopping(): Promise<void> {
    Logger.info('Continuando compras');
    await this.click(this.continueShoppingButton);
  }

  /**
   * Proceder para o checkout
   */
  async proceedToCheckout(): Promise<void> {
    Logger.info('Procedendo para o checkout');
    await this.click(this.checkoutButton);
  }
} 