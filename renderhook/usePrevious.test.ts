// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 3, rerender with new props.
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrevious } from './usePrevious'

describe('usePrevious', () => {
  it('trả về giá trị của lần render trước', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'a' } },
    )

    expect(result.current).toBeUndefined()

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    rerender({ value: 'c' })
    expect(result.current).toBe('b')
  })
})
