// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 6, registers/cleans a listener.
import { useEffect } from 'react'

export function useEventListener(event: string, handler: () => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
