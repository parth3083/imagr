import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    projects: [
      {
        extends: true,
        test: {
          name: 'backend',
          root: path.resolve(__dirname, './apps/web'),
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.spec.tsx', 'src/**/*.spec.ts', '**/node_modules/**'],
          environment: 'node',
          setupFiles: [path.resolve(__dirname, './apps/web/src/test/setup.ts')],
        },
      },
      {
        extends: true,
        test: {
          name: 'frontend',
          root: path.resolve(__dirname, './apps/web'),
          include: ['src/**/*.spec.tsx', 'src/**/*.spec.ts'],
          exclude: ['src/**/*.test.ts', '**/node_modules/**'],
          environment: 'happy-dom',
          setupFiles: [path.resolve(__dirname, './apps/web/src/test/setup.ts')],
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          root: path.resolve(__dirname, './packages/ui'),
          include: ['src/**/*.spec.ts', 'components/**/*.spec.tsx'],
          exclude: ['**/node_modules/**'],
          environment: 'happy-dom',
        },
      },
    ],
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './apps/web/src'),
      },
      {
        find: '@repo/ui',
        replacement: path.resolve(__dirname, './packages/ui'),
      },
      {
        find: /^@repo\/core-types\/(.+)$/,
        replacement: path.resolve(__dirname, './packages/core-types/src/features/$1/index.ts'),
      },
      {
        find: '@repo/logger',
        replacement: path.resolve(__dirname, './packages/logger'),
      },
    ],
  },
});

// Made with Bob
