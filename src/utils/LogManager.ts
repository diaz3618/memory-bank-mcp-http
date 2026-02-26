/**
 * LogManager - Utility for managing logs in Memory Bank MCP
 * 
 * This utility provides functions for logging messages with different levels
 * and controls log visibility based on debug mode.
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

/**
 * Configuration for the log manager
 */
export interface LogManagerConfig {
  debugMode: boolean;
  showTimestamp: boolean;
  showSource: boolean;
  minLevel: LogLevel;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: LogManagerConfig = {
  debugMode: false,
  showTimestamp: true,
  showSource: true,
  minLevel: LogLevel.INFO
};

/**
 * Log Manager class
 */
export class LogManager {
  private static instance: LogManager;
  private config: LogManagerConfig;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor(config: Partial<LogManagerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): LogManager {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }
    return LogManager.instance;
  }

  /**
   * Configure the log manager
   */
  public configure(config: Partial<LogManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Enable debug mode
   */
  public enableDebugMode(): void {
    this.config.debugMode = true;
  }

  /**
   * Disable debug mode
   */
  public disableDebugMode(): void {
    this.config.debugMode = false;
  }

  /**
   * Check if a message should be logged based on current configuration
   */
  private shouldLog(level: LogLevel): boolean {
    const levelPriority = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3
    };

    // Always log errors regardless of debug mode
    if (level === LogLevel.ERROR) {
      return true;
    }

    // Debug messages only in debug mode
    if (level === LogLevel.DEBUG && !this.config.debugMode) {
      return false;
    }

    // Check minimum level
    return levelPriority[level] >= levelPriority[this.config.minLevel];
  }

  /**
   * Format a log message
   */
  private formatMessage(level: LogLevel, source: string, message: string): string {
    const parts: string[] = [];

    // Add timestamp if configured
    if (this.config.showTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    // Add level
    parts.push(`[${level.toUpperCase()}]`);

    // Add source if configured
    if (this.config.showSource && source) {
      parts.push(`[${source}]`);
    }

    // Add message
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Log a debug message
   */
  public debug(source: string, message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.error(this.formatMessage(LogLevel.DEBUG, source, message));
    }
  }

  /**
   * Log an info message
   */
  public info(source: string, message: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.error(this.formatMessage(LogLevel.INFO, source, message));
    }
  }

  /**
   * Log a warning message
   */
  public warn(source: string, message: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, source, message));
    }
  }

  /**
   * Log an error message
   */
  public error(source: string, message: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, source, message));
    }
  }

  /**
   * Log a message with a specific level
   */
  public log(level: LogLevel, source: string, message: string): void {
    switch (level) {
      case LogLevel.DEBUG:
        this.debug(source, message);
        break;
      case LogLevel.INFO:
        this.info(source, message);
        break;
      case LogLevel.WARN:
        this.warn(source, message);
        break;
      case LogLevel.ERROR:
        this.error(source, message);
        break;
    }
  }
}

/**
 * Convenience function to get the log manager instance
 */
export function getLogManager(): LogManager {
  return LogManager.getInstance();
}

/**
 * Convenience functions for logging
 */
export const logger = {
  debug: (source: string, message: string) => getLogManager().debug(source, message),
  info: (source: string, message: string) => getLogManager().info(source, message),
  warn: (source: string, message: string) => getLogManager().warn(source, message),
  error: (source: string, message: string) => getLogManager().error(source, message),
  log: (level: LogLevel, source: string, message: string) => getLogManager().log(level, source, message)
}; 