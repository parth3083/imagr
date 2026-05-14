import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    projects: [
      {
        extends: true,
        test: {
          name: 'web',
          root: './apps/web',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          root: './packages/ui',
          include: ['src/**/*.spec.ts'],
        },
      },
    ],
  },
});
