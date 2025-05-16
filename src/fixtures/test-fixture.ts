import { test as baseTest, Page, Browser, chromium, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { Logger } from '../utils/logger';

/**
 * Fixture para testes com autenticação e outras configurações comuns
 */
type TestFixtures = {
  browser: Browser;
  context: BrowserContext;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: Page;
};

export const test = baseTest.extend<TestFixtures>({
  // Browser fixture com gerenciamento de recursos
  browser: async ({}, use) => {
    Logger.info('Iniciando o navegador');
    const browser = await chromium.launch();
    await use(browser);
    Logger.info('Fechando o navegador');
    await browser.close();
  },
  
  // Context fixture com gerenciamento de recursos
  context: async ({ browser }, use) => {
    Logger.info('Criando o contexto do navegador');
    const context = await browser.newContext();
    await use(context);
    Logger.info('Fechando o contexto do navegador');
    await context.close();
  },
  
  // Sobrescreva a página base com gerenciamento explícito de recursos
  page: async ({ context }, use) => {
    // Setup antes de cada teste
    Logger.info('Iniciando o teste com a configuração básica');
    const page = await context.newPage();
    
    // Código de setup adicional pode ser adicionado aqui
    
    await use(page);
    
    // Cleanup depois de cada teste
    Logger.info('Finalizando o teste e fechando a página');
    await page.close();
  },
  
  // Fixture para página de login
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  // Fixture para página de inventário
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
  
  // Fixture para página de carrinho
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  
  // Fixture para página de checkout
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  
  // Fixture para navegação autenticada
  authenticatedPage: async ({ page, loginPage }, use) => {
    Logger.info('Configurando sessão autenticada');
    
    // Credenciais de usuários disponíveis
    const validUsernames = [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user'
    ];
    const password = 'secret_sauce';
    
    // Usar o primeiro usuário padrão para autenticação
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsernames[0], password);
    
    // Armazenar o estado da autenticação para reutilização
    await page.context().storageState({ path: './auth.json' });
    
    await use(page);
  },
}); 