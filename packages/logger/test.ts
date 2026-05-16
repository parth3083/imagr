import { createLogger } from './index';

// Create a logger instance for a web application
const webLogger = createLogger({ appName: 'web-app' });

// Create a logger instance for an API service
const apiLogger = createLogger({ appName: 'api-service', level: 'debug' });

console.log('\n=== Testing Web App Logger ===\n');

// Test different log levels with the web logger
webLogger.info('Application started successfully');
webLogger.debug("Debug information - this won't show with default 'info' level");
webLogger.warn('Warning: API rate limit at 80%');
webLogger.error('Error: Failed to connect to database');

// Test with structured data
webLogger.info({ userId: 123, action: 'login' }, 'User logged in');
webLogger.error({ error: 'ECONNREFUSED', port: 5432 }, 'Database connection failed');

console.log('\n=== Testing API Service Logger (with debug level) ===\n');

// Test API logger with debug level enabled
apiLogger.debug('Debug mode enabled - verbose logging active');
apiLogger.info('API endpoint /users called');
apiLogger.warn({ endpoint: '/api/data', responseTime: 2500 }, 'Slow API response detected');
apiLogger.error({ statusCode: 500, endpoint: '/api/users' }, 'Internal server error');

console.log('\n=== Testing Different Message Formats ===\n');

// Test various message formats
webLogger.info('Simple message');
webLogger.info({ requestId: 'abc-123' }, 'Request processed');
webLogger.info(
  {
    user: { id: 456, email: 'user@example.com' },
    timestamp: new Date().toISOString(),
  },
  'User profile updated',
);

console.log('\n=== Logger Test Complete ===\n');

// Made with Bob
