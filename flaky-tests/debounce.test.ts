// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 4.1, testing
// debounce with fake timers instead of waiting on a real clock.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function debounce<A extends unknown[]>(fn: (...a: A) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: A) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('chỉ gọi fn một lần sau delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('a')
    debounced('b')
    debounced('c')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })
})
