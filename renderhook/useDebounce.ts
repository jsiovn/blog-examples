// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 7, debounces a value with a timer.
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
