// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 4.2, pin the
// clock with vi.setSystemTime so a Date-dependent function is deterministic.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 12) return 'Chào buổi sáng'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

describe('greeting theo giờ', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('trả về lời chào buổi sáng lúc 9h', () => {
    vi.setSystemTime(new Date(2026, 0, 15, 9, 0, 0))
    expect(greeting()).toBe('Chào buổi sáng')
  })

  it('trả về lời chào buổi tối lúc 20h', () => {
    vi.setSystemTime(new Date(2026, 0, 15, 20, 0, 0))
    expect(greeting()).toBe('Chào buổi tối')
  })
})
