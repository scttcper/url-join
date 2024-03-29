import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    singleThread: true,
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
