// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 7, randomize
// test order to surface order-dependency early.
import { describe, expect, test } from 'vitest'

describe('suite kiểm tra order-dependency', { shuffle: true }, () => {
  test('a', () => expect(1).toBe(1))
  test('b', () => expect(2).toBe(2))
})
