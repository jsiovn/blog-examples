// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 7, retry masks
// a non-deterministic test: it goes green on the 3rd attempt but is not fixed.
import { expect, test } from 'vitest'

let attempt = 0

// retry giúp test xanh, nhưng nó vẫn chưa deterministic
test('test tự phục hồi sau vài lần thử', { retry: 2 }, () => {
  attempt++
  expect(attempt).toBe(3)
})
