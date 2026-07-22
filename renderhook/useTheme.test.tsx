// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 4, wrapper Provider.
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ThemeContext, useTheme } from './ThemeContext'

describe('useTheme', () => {
  it('đọc value từ Context provider bọc ngoài', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      ),
    })

    expect(result.current).toBe('dark')
  })
})
