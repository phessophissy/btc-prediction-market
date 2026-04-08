// Strict TypeScript configuration for build system (PR 53)
export const strictConfig = {
  compilerOptions: {
    target: 'ES2022',
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    noUncheckedIndexedAccess: true,
    noImplicitReturns: true,
    forceConsistentCasingInFileNames: true,
    esModuleInterop: true,
    skipLibCheck: true,
    declaration: true,
    sourceMap: true,
    outDir: './dist',
  },
  include: ['sdk/src/**/*', 'scripts/**/*'],
  exclude: ['node_modules', 'dist', '**/*.test.ts'],
};
