// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 5, waitFor for async hook.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from './useFetch'

describe('useFetch', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ json: () => Promise.resolve({ name: 'Alice' }) }),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('trả về data sau khi request resolve', async () => {
    const { result } = renderHook(() => useFetch<{ name: string }>('/api/user'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).toEqual({ name: 'Alice' })
  })
})
