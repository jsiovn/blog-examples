// Runs ONLY the demos that fail on purpose — the ones whose failure output is
// quoted in the posts (a forgotten await, leaked state, a missing act(), the
// vi.mock hoisting ReferenceError). This suite is EXPECTED to exit non-zero;
// that red output is the point. Compare it against the ```text blocks in the posts.
//
//   cd apps/examples && bun run test:failing
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'mocking-failing',
          root: './vitest-mocking',
          environment: 'node',
          include: ['failing/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'flaky-failing',
          root: './flaky-tests',
          environment: 'node',
          include: ['failing/**/*.test.ts'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'renderhook-failing',
          root: './renderhook',
          environment: 'jsdom',
          include: ['failing/**/*.test.{ts,tsx}'],
        },
      },
    ],
  },
})
