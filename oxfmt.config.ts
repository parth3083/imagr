import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  ignorePatterns: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**', '*.min.*'],
  sortImports: true,
  sortTailwindcss: true,
  sortPackageJson: true,
});
