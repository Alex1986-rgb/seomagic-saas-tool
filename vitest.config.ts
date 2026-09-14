import { defineConfig } from 'vitest/config';
import path from 'path';

// Standalone Vitest config (kept separate from vite.config.ts so the app build
// is untouched). Runs the *.test.ts unit suites in a node environment.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
