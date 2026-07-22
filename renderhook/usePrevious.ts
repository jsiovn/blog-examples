// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 3, remembers the
// previous render's value.
import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
