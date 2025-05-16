import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';
import { isVisible, wait } from '../utils/helpers';

/**
 * Base Page Object class which all page objects should inherit from
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific URL
   */
  async navigate(url: string): Promise<void> {
    Logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get element by selector
   */
  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    Logger.debug(`Clicking on element: ${selector}`);
    await this.page.click(selector);
  }

  /**
   * Fill input field
   */
  async fill(selector: string, text: string): Promise<void> {
    Logger.debug(`Filling "${text}" into ${selector}`);
    await this.page.fill(selector, text);
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).innerText();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(
    selector: string, 
    options: { timeout?: number, state?: 'visible' | 'hidden' | 'attached' | 'detached' } = {}
  ): Promise<void> {
    const { timeout = 10000, state = 'visible' } = options;
    Logger.debug(`Waiting for element ${selector} to be ${state}`);
    await this.page.locator(selector).waitFor({ state, timeout });
  }

  /**
   * Verify element is visible
   */
  async expectVisible(selector: string): Promise<void> {
    const isElementVisible = await isVisible(this.page, selector);
    expect(isElementVisible).toBeTruthy();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    Logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
} 