/**
 * Professional Logger Utility
 * Removes console.logs in production for better performance
 * SaaS 2025 Best Practice
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  /**
   * Development-only log
   */
  log(...args: any[]): void {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Development-only info
   */
  info(...args: any[]): void {
    if (isDevelopment) {
      console.info(...args);
    }
  }

  /**
   * Development-only debug
   */
  debug(...args: any[]): void {
    if (isDevelopment) {
      console.debug(...args);
    }
  }

  /**
   * Development-only warn
   */
  warn(...args: any[]): void {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  /**
   * Always log errors (even in production)
   */
  error(...args: any[]): void {
    console.error(...args);
  }

  /**
   * Conditional logging with metadata
   */
  logWithContext(level: LogLevel, message: string, context?: any): void {
    if (isDevelopment || level === 'error') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
      
      if (context) {
        console[level](logMessage, context);
      } else {
        console[level](logMessage);
      }
    }
  }

  /**
   * Performance logging
   */
  time(label: string): void {
    if (isDevelopment) {
      console.time(label);
    }
  }

  /**
   * Performance logging end
   */
  timeEnd(label: string): void {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }

  /**
   * Group logging
   */
  group(label: string): void {
    if (isDevelopment) {
      console.group(label);
    }
  }

  /**
   * Group logging end
   */
  groupEnd(): void {
    if (isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Table logging for data analysis
   */
  table(data: any): void {
    if (isDevelopment) {
      console.table(data);
    }
  }
}

export const logger = new Logger();

// Convenience exports
export const { log, info, warn, error, debug } = logger;
