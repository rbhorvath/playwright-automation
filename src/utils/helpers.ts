import { Page } from '@playwright/test';
import { Logger } from './logger';

/**
 * Wait for a specific amount of time (use sparingly, prefer waitForSelector)
 * @param ms Time in milliseconds
 */
export const wait = async (ms: number): Promise<void> => {
  Logger.debug(`Waiting for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry a function until it succeeds or times out
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> => {
  const { retries = 3, delay = 1000, onRetry } = options;
  let lastError: Error;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (onRetry) {
        onRetry(attempt, lastError);
      }
      Logger.warn(`Retry attempt ${attempt} failed: ${lastError.message}`);
      if (attempt < retries) {
        await wait(delay);
      }
    }
  }

  throw lastError!;
};

/**
 * Check if an element is visible
 */
export const isVisible = async (page: Page, selector: string): Promise<boolean> => {
  try {
    const element = await page.$(selector);
    if (!element) return false;
    
    return await element.isVisible();
  } catch (error) {
    Logger.debug(`Error checking visibility of ${selector}: ${error}`);
    return false;
  }
}; 