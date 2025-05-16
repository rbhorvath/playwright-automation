/**
 * Enhanced logger utility for the Playwright automation project
 * Includes timestamping and context information
 */
export class Logger {
  private static logLevels = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };

  // Set default log level based on environment (more verbose in CI)
  private static currentLogLevel = process.env.CI ? Logger.logLevels.DEBUG : Logger.logLevels.INFO;

  /**
   * Set the log level for the application
   */
  static setLogLevel(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'): void {
    this.currentLogLevel = this.logLevels[level];
  }

  /**
   * Get formatted timestamp for logs
   */
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Format a log message with timestamp and context
   */
  private static formatMessage(level: string, message: string, context?: string): string {
    const timestamp = this.getTimestamp();
    const contextInfo = context ? `[${context}]` : '';
    return `[${timestamp}] [${level}]${contextInfo} ${message}`;
  }

  /**
   * Log debug message
   */
  static debug(message: string, context?: string, ...args: any[]): void {
    if (this.currentLogLevel <= this.logLevels.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, context), ...args);
    }
  }

  /**
   * Log info message
   */
  static info(message: string, context?: string, ...args: any[]): void {
    if (this.currentLogLevel <= this.logLevels.INFO) {
      console.log(this.formatMessage('INFO', message, context), ...args);
    }
  }

  /**
   * Log warning message
   */
  static warn(message: string, context?: string, ...args: any[]): void {
    if (this.currentLogLevel <= this.logLevels.WARN) {
      console.warn(this.formatMessage('WARN', message, context), ...args);
    }
  }

  /**
   * Log error message
   */
  static error(message: string, context?: string, ...args: any[]): void {
    if (this.currentLogLevel <= this.logLevels.ERROR) {
      console.error(this.formatMessage('ERROR', message, context), ...args);
    }
  }

  /**
   * Log beginning of a test step (useful for test readability)
   */
  static step(stepName: string): void {
    if (this.currentLogLevel <= this.logLevels.INFO) {
      console.log('\n' + this.formatMessage('STEP', `▶️ STARTING: ${stepName}`));
    }
  }
  
  /**
   * Log completion of a test step
   */
  static stepComplete(stepName: string): void {
    if (this.currentLogLevel <= this.logLevels.INFO) {
      console.log(this.formatMessage('STEP', `✅ COMPLETED: ${stepName}`));
    }
  }
} 