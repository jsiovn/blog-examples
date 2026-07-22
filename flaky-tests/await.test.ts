// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 2.1, the FIXED
// version: await the async call so the assertion runs after it resolves.
// (The forgotten-await version is failing/await.test.ts.)
import { expect, test } from 'vitest'

async function loadConfig(store: { ready: boolean }) {
  await Promise.resolve()
  store.ready = true
}

test('await đúng chỗ: test deterministic', async () => {
  const store = { ready: false }
  await loadConfig(store)
  expect(store.ready).toBe(true) // PASS
})
