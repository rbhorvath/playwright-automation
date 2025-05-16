import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';

/**
 * Tipo de dados para informações do cliente no checkout
 */
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Page Object para o processo de checkout
 */
export class CheckoutPage extends BasePage {
  // Seletores - Primeira etapa (informações)
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly postalCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly cancelButton = '[data-test="cancel"]';
  private readonly errorMessage = '[data-test="error"]';

  // Seletores - Segunda etapa (revisão)
  private readonly finishButton = '[data-test="finish"]';
  private readonly itemTotal = '.summary_subtotal_label';
  private readonly tax = '.summary_tax_label';
  private readonly totalPrice = '.summary_total_label';
  private readonly itemName = '.inventory_item_name';

  // Seletores - Terceira etapa (finalização)
  private readonly completeHeader = '.complete-header';
  private readonly completeText = '.complete-text';
  private readonly backHomeButton = '[data-test="back-to-products"]';
  
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar para a primeira etapa do checkout
   */
  async navigateToCheckoutStepOne(): Promise<void> {
    await this.navigate('/checkout-step-one.html');
  }

  /**
   * Preencher informações do cliente
   */
  async fillCustomerInfo(customerInfo: CustomerInfo): Promise<void> {
    Logger.info(`Preenchendo informações do cliente: ${customerInfo.firstName} ${customerInfo.lastName}`);
    await this.fill(this.firstNameInput, customerInfo.firstName);
    await this.fill(this.lastNameInput, customerInfo.lastName);
    await this.fill(this.postalCodeInput, customerInfo.postalCode);
  }

  /**
   * Continuar para a próxima etapa do checkout
   */
  async continueToNextStep(): Promise<void> {
    Logger.info('Continuando para a próxima etapa do checkout');
    await this.click(this.continueButton);
  }

  /**
   * Cancelar checkout
   */
  async cancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Obter mensagem de erro
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  /**
   * Verificar se um produto está na revisão de compra
   */
  async isProductInReview(productName: string): Promise<boolean> {
    const items = await this.page.locator(this.itemName).allTextContents();
    return items.some(item => item.includes(productName));
  }

  /**
   * Obter preço total do pedido
   */
  async getTotalPrice(): Promise<string> {
    return await this.getText(this.totalPrice);
  }

  /**
   * Finalizar compra
   */
  async finishCheckout(): Promise<void> {
    Logger.info('Finalizando a compra');
    await this.click(this.finishButton);
  }

  /**
   * Verificar se a compra foi bem-sucedida
   */
  async isCheckoutComplete(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.completeHeader, { state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obter mensagem de confirmação
   */
  async getConfirmationMessage(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  /**
   * Voltar para a página de produtos
   */
  async backToProducts(): Promise<void> {
    await this.click(this.backHomeButton);
  }

  /**
   * Verificar se elemento está visível
   */
  private async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
} 