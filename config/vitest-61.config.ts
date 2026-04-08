// Vitest configuration for logging (PR 61)
export const testConfig = {
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'lcov'],
      include: ['sdk/src/**/*.ts'],
      thresholds: { branches: 60, functions: 70, lines: 70 },
    },
    reporters: ['verbose'],
    testTimeout: 10000,
  },
};
