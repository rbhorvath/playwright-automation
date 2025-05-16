import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';
import { SortOptions } from '../utils/test-data';

/**
 * Page Object para a página de inventário de produtos
 */
export class InventoryPage extends BasePage {
  // Seletores
  private readonly productSortContainer = '[data-test="product-sort-container"]';
  private readonly activeOption = '[data-test="active-option"]';
  private readonly shoppingCartLink = '.shopping_cart_link';
  private readonly shoppingCartBadge = '.shopping_cart_badge';
  
  // Formatadores de seletores dinâmicos
  private getAddToCartButtonSelector(productName: string): string {
    // Converte o nome do produto para o formato usado no atributo data-test
    const formattedName = productName.toLowerCase().replace(/\s+/g, '-');
    return `[data-test="add-to-cart-${formattedName}"]`;
  }
  
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar para a página de inventário
   */
  async navigateToInventory(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  /**
   * Ordenar produtos por diferentes critérios
   * @param option - Opção de ordenação: az, za, lohi, hilo
   */
  async sortProducts(option: typeof SortOptions[keyof typeof SortOptions]): Promise<void> {
    Logger.info(`Ordenando produtos por opção: ${option}`);
    await this.page.selectOption(this.productSortContainer, option);
  }

  /**
   * Obter texto da opção de ordenação ativa
   */
  async getActiveSortOption(): Promise<string> {
    return await this.getText(this.activeOption);
  }

  /**
   * Adicionar um produto ao carrinho pelo nome
   */
  async addProductToCart(productName: string): Promise<void> {
    Logger.info(`Adicionando produto ao carrinho: ${productName}`);
    const addToCartButton = this.getAddToCartButtonSelector(productName);
    await this.click(addToCartButton);
  }

  /**
   * Obter quantidade de itens no carrinho
   */
  async getCartItemCount(): Promise<string | null> {
    if (await this.isVisible(this.shoppingCartBadge)) {
      return await this.getText(this.shoppingCartBadge);
    }
    return null;
  }

  /**
   * Navegar para o carrinho
   */
  async goToCart(): Promise<void> {
    Logger.info('Navegando para o carrinho');
    await this.click(this.shoppingCartLink);
  }

  /**
   * Verificar se elemento está visível
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 2000 });
      return true;
    } catch (e) {
      return false;
    }
  }
} 