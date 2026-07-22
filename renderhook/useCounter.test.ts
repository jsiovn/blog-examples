// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 1 (khởi tạo) + mục 2
// (increment bọc act). The post shows these as two snippets in one describe.
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('khởi tạo với giá trị mặc định', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('tăng count khi gọi increment', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(6)
  })
})
