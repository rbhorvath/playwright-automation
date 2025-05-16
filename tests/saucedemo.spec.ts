import { test } from '../src/fixtures/test-fixture';
import { expect } from '@playwright/test';
import { Logger } from '../src/utils/logger';

test.describe('Sauce Demo Login Tests', () => {
  test.beforeAll(async () => {
    Logger.info('Iniciando testes no Sauce Demo');
  });

  test('deve fazer login com credenciais válidas', async ({ loginPage, page }) => {
    // Navegar para a página de login
    await loginPage.navigateToLoginPage();
    
    // Realizar login com credenciais válidas
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Verificar se o login foi bem sucedido (URL deve mudar para /inventory.html)
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('deve mostrar erro com credenciais inválidas', async ({ loginPage }) => {
    // Navegar para a página de login
    await loginPage.navigateToLoginPage();
    
    // Realizar login com credenciais inválidas
    await loginPage.login('invalid_user', 'wrong_password');
    
    // Verificar mensagem de erro
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).not.toBeNull();
  });

  test('deve bloquear usuário locked_out_user', async ({ loginPage }) => {
    // Navegar para a página de login
    await loginPage.navigateToLoginPage();
    
    // Tentar login com usuário bloqueado
    await loginPage.login('locked_out_user', 'secret_sauce');
    
    // Verificar mensagem de erro específica
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('deve autenticar usando a fixture authenticatedPage', async ({ authenticatedPage }) => {
    // A fixture authenticatedPage já deve estar autenticada
    // Verificar se estamos na página de inventário
    await expect(authenticatedPage).toHaveURL(/inventory.html/);
  });
}); 