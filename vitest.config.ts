// Runs the "should pass" examples for the three Testing-pillar posts.
// One project per post; the renderhook project needs jsdom + the React plugin.
// The intentionally-failing demos live under each post's failing/ folder and are
// excluded here — run them with `bun run test:failing` (vitest.failing.config.ts).
//
//   cd apps/examples
//   bun run test            # all green
//   bun run test:failing    # the demos that fail on purpose
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'mocking',
          root: './vitest-mocking',
          environment: 'node',
          include: ['**/*.test.ts'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
      {
        test: {
          name: 'flaky',
          root: './flaky-tests',
          environment: 'node',
          include: ['**/*.test.ts'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'renderhook',
          root: './renderhook',
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'react-batching',
          root: './react-batching',
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'react-concurrency',
          root: './react-concurrency',
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'react-19-features',
          root: './react-19-features',
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: ['**/failing/**', '**/node_modules/**'],
        },
      },
    ],
  },
})
