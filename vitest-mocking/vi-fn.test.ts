// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 1, vi.fn() basics.
import { describe, it, expect, vi } from 'vitest'

describe('vi.fn cơ bản', () => {
  it('mockReturnValue và assert cách gọi', () => {
    const getPrice = vi.fn()
    getPrice.mockReturnValue(100)

    expect(getPrice('apple')).toBe(100)
    expect(getPrice).toHaveBeenCalledWith('apple')
    expect(getPrice).toHaveBeenCalledTimes(1)
  })

  it('mockImplementation cho logic tuỳ biến', () => {
    const discount = vi.fn().mockImplementation((price: number) => price * 0.9)
    expect(discount(200)).toBe(180)
  })

  it('mockResolvedValue cho async', async () => {
    const loadUser = vi.fn().mockResolvedValue({ id: 1, name: 'An' })
    await expect(loadUser()).resolves.toEqual({ id: 1, name: 'An' })
  })
})
