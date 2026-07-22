// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 4, a hook that reads Context.
import { createContext, useContext } from 'react'

export const ThemeContext = createContext<'light' | 'dark'>('light')

export function useTheme() {
  return useContext(ThemeContext)
}
