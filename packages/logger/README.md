# Logger Package

A beautiful, colorful Pino-based logger for monorepo applications with app name tracking, timestamps, and prettified output.

## Features

- 🎨 **Colorful Output** - Different colors for different log levels (INFO: blue, WARN: yellow, ERROR: red, DEBUG: green)
- 📱 **App Name Tracking** - Identify which application generated each log message
- ⏰ **Timestamps** - Automatic ISO 8601 timestamps with timezone support
- 🎯 **Structured Logging** - Support for structured data alongside messages
- 🚀 **High Performance** - Built on Pino, one of the fastest Node.js loggers
- 💅 **Pretty Printing** - Human-readable format in development, JSON in production

## Installation

This package is part of the monorepo and uses Bun as the runtime.

```bash
bun install
```

## Usage

### Basic Usage

```typescript
import { createLogger } from 'logger';

// Create a logger instance for your application
const logger = createLogger({ appName: 'web-app' });

// Log messages at different levels
logger.info('Application started successfully');
logger.warn('Warning: API rate limit at 80%');
logger.error('Error: Failed to connect to database');
logger.debug('Debug information');
```

### With Structured Data

```typescript
// Log with additional context
logger.info({ userId: 123, action: 'login' }, 'User logged in');

logger.error({ error: 'ECONNREFUSED', port: 5432 }, 'Database connection failed');

logger.warn({ endpoint: '/api/data', responseTime: 2500 }, 'Slow API response detected');
```

### Configuration Options

```typescript
import { createLogger } from 'logger';

const logger = createLogger({
  appName: 'api-service', // Required: Name of your application
  level: 'debug', // Optional: Log level (default: "info")
  pretty: true, // Optional: Enable pretty printing (default: true)
});
```

### Log Levels

Available log levels (in order of severity):

- `trace` - Most verbose, for detailed debugging
- `debug` - Debug information
- `info` - General informational messages (default)
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal errors that cause application termination

### Using in Next.js App

```typescript
// In your Next.js app (apps/web/src/lib/logger.ts)
import { createLogger } from 'logger';

export const logger = createLogger({
  appName: 'web-app',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

// Use throughout your application
import { logger } from '@/lib/logger';

logger.info('User authenticated');
logger.error({ error }, 'Authentication failed');
```

### Multiple Applications

Since this is a monorepo, you can create different logger instances for different apps:

```typescript
// Web app logger
const webLogger = createLogger({ appName: 'web-app' });

// API service logger
const apiLogger = createLogger({ appName: 'api-service' });

// Admin dashboard logger
const adminLogger = createLogger({ appName: 'admin-dashboard' });
```

Each logger will prefix its messages with the app name, making it easy to identify the source of logs.

## Output Format

The logger produces colorful, formatted output like this:

```
INFO [2026-05-16 11:18:30.643 +0530]: [web-app] Application started successfully
    app: "web-app"

WARN [2026-05-16 11:18:30.645 +0530]: [web-app] Warning: API rate limit at 80%
    app: "web-app"

ERROR [2026-05-16 11:18:30.645 +0530]: [web-app] Database connection failed
    app: "web-app"
    port: 5432
    error: "ECONNREFUSED"

INFO [2026-05-16 11:18:30.645 +0530]: [web-app] User logged in
    app: "web-app"
    userId: 123
    action: "login"
```

## Testing

Run the test file to see the logger in action:

```bash
bun run test.ts
```

## TypeScript Support

The package is fully typed with TypeScript. Import the types as needed:

```typescript
import { createLogger, type Logger, type LoggerConfig } from 'logger';

const config: LoggerConfig = {
  appName: 'my-app',
  level: 'info',
};

const logger: Logger = createLogger(config);
```

## Production vs Development

- **Development**: Pretty, colorful output with readable formatting
- **Production**: JSON output for log aggregation and analysis (set `pretty: false`)

```typescript
const logger = createLogger({
  appName: 'web-app',
  pretty: process.env.NODE_ENV !== 'production',
});
```

## Best Practices

1. **Create one logger per application** - Use the app name to identify the source
2. **Use structured logging** - Pass objects with context data
3. **Choose appropriate log levels** - Don't log everything at `info` level
4. **Include relevant context** - Add user IDs, request IDs, etc.
5. **Avoid logging sensitive data** - Never log passwords, tokens, or PII

## Dependencies

- `pino` - Fast JSON logger
- `pino-pretty` - Pretty printing for development

## License

Private package for internal use in the monorepo.
