// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 6, unmount runs cleanup.
import { afterEach, describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEventListener } from './useEventListener'

describe('useEventListener', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('gỡ listener khi unmount', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const handler = vi.fn()

    const { unmount } = renderHook(() => useEventListener('resize', handler))
    expect(add).toHaveBeenCalledWith('resize', handler)

    unmount()
    expect(remove).toHaveBeenCalledWith('resize', handler)
  })
})
