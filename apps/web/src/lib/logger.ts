import { createLogger } from '@repo/logger';

/**
 * Application logger instance
 *
 * This logger is configured for the web application with:
 * - App name: "web-app" for easy identification in logs
 * - Debug level in development, info level in production
 * - Pretty printing enabled in development for better readability
 */
export const logger = createLogger({
  appName: 'web-app',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  pretty: process.env.NODE_ENV !== 'production',
});

/**
 * Export the Logger type for use in other files
 */
export type { Logger } from '@repo/logger';
