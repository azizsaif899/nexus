/**
 * 🧪 Vitest Configuration
 * تكوين Vitest للاختبارات
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/performance/**/*.test.ts',
      'tests/security/**/*.test.ts'
    ],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'tests/e2e'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        'build/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    },
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-reports/vitest-results.json'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@apps': path.resolve(__dirname, './apps'),
      '@packages': path.resolve(__dirname, './packages'),
      '@tests': path.resolve(__dirname, './tests')
    }
  },
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});