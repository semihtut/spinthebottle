import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/engine/**', 'src/utils/**', 'src/storage/**'],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
