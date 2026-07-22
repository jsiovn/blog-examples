// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 7, mockClear vs mockReset vs mockRestore.
// The mục-7 "Lưu ý" claims that resetting a vi.fn().mockReturnValue('real') leaves fn()
// returning undefined — this file is where that claim is checked.
import { describe, it, expect, vi } from 'vitest'

describe('mockClear vs mockReset', () => {
  it('mockClear: xoá call history, GIỮ implementation', () => {
    const fn = vi.fn().mockReturnValue('real')
    fn()
    expect(fn.mock.calls.length).toBe(1)

    fn.mockClear()
    expect(fn.mock.calls.length).toBe(0) // history sạch
    expect(fn()).toBe('real')            // implementation vẫn còn
  })

  it('mockReset: xoá history VÀ implementation đã set', () => {
    const fn = vi.fn().mockReturnValue('real')
    fn()

    fn.mockReset()
    expect(fn.mock.calls.length).toBe(0) // history sạch
    expect(fn()).toBeUndefined()         // implementation bị gỡ
  })
})

describe('mockRestore chỉ có ý nghĩa với spyOn', () => {
  it('trả method về bản gốc', () => {
    const obj = { size: () => 10 }
    const spy = vi.spyOn(obj, 'size').mockReturnValue(999)
    expect(obj.size()).toBe(999)

    spy.mockRestore()
    expect(obj.size()).toBe(10) // về nguyên bản
  })
})
