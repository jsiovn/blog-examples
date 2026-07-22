// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 2.1, the BUG:
// the callback is not async and loadConfig is not awaited, so expect() runs before
// store.ready flips. EXPECTED TO FAIL — the post quotes this failure.
//
//   cd apps/examples && bun run test:failing
import { expect, test } from 'vitest'

async function loadConfig(store: { ready: boolean }) {
  await Promise.resolve()
  store.ready = true
}

test('quên await: assertion chạy trước khi promise resolve', () => {
  const store = { ready: false }
  loadConfig(store) // thiếu await
  expect(store.ready).toBe(true)
})
