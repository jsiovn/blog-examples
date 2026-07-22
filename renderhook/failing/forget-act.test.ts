// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 9.1, the BUG: an update
// outside act() is not flushed before the assertion, so count reads 0, not 1.
// EXPECTED TO FAIL — the post quotes this failure. (../ because demo is in failing/.)
//
//   cd apps/examples && bun run test:failing
import { it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCounter } from '../useCounter'

it('tăng count mà không bọc act', () => {
  const { result } = renderHook(() => useCounter())
  result.current.increment() // update state ngoài act
  expect(result.current.count).toBe(1)
})
