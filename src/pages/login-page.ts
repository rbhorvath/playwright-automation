import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';
import { isVisible } from '../utils/helpers';

/**
 * Page Object para a página de login
 */
export class LoginPage extends BasePage {
  // URL base do SauceDemo
  private baseUrl = 'https://www.saucedemo.com';
  
  // Seletores
  private readonly usernameInput = 'input[data-test="username"]';
  private readonly passwordInput = 'input[data-test="password"]';
  private readonly loginButton = 'input[data-test="login-button"]';
  private readonly errorMessage = '.error-message-container';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar para a página de login
   */
  async navigateToLoginPage(url = ''): Promise<void> {
    const targetUrl = url || this.baseUrl;
    await this.navigate(targetUrl);
  }

  /**
   * Preencher o formulário de login
   */
  async fillLoginForm(username: string, password: string): Promise<void> {
    Logger.info(`Preenchendo formulário de login para o usuário: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
  }

  /**
   * Clicar no botão de login
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Realizar login completo
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillLoginForm(username, password);
    await this.clickLoginButton();
    Logger.info('Login realizado com sucesso');
  }

  /**
   * Verificar se há mensagem de erro
   */
  async getErrorMessage(): Promise<string | null> {
    if (await isVisible(this.page, this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }
} 