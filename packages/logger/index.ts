import pino, { type Logger } from 'pino';

/**
 * Configuration options for creating a logger instance
 */
export interface LoggerConfig {
  /**
   * The name of the application using this logger
   * This will be included in all log messages to identify the source
   */
  appName: string;

  /**
   * Optional log level (default: 'info')
   * Options: 'trace', 'debug', 'info', 'warn', 'error', 'fatal'
   */
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

  /**
   * Enable pretty printing (default: true in development)
   */
  pretty?: boolean;
}

/**
 * Creates a configured Pino logger instance with colorful, prettified output
 *
 * @param config - Logger configuration including app name and optional settings
 * @returns A configured Pino logger instance
 *
 * @example
 * ```typescript
 * import { createLogger } from "logger";
 *
 * const logger = createLogger({ appName: "web-app" });
 *
 * logger.info("User logged in successfully");
 * logger.error({ userId: 123 }, "Failed to fetch user data");
 * logger.warn("API rate limit approaching");
 * ```
 */
export function createLogger(config: LoggerConfig): Logger {
  const { appName, level = 'info', pretty = true } = config;

  // Base configuration for all environments
  const baseConfig = {
    level,
    base: {
      app: appName,
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  };

  // Pretty printing configuration for development
  if (pretty) {
    return pino({
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          messageFormat: '[{app}] {msg}',
          customColors: 'info:blue,warn:yellow,error:red,debug:green',
          customLevels: 'trace:10,debug:20,info:30,warn:40,error:50,fatal:60',
          levelFirst: true,
          singleLine: false,
        },
      },
    });
  }

  // Production configuration (JSON output)
  return pino(baseConfig);
}

/**
 * Export the Logger type for use in other packages
 */
export type { Logger } from 'pino';

/**
 * Default export for convenience
 */
export default createLogger;

// Made with Bob
