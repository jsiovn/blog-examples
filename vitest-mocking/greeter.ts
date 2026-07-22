// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — greet() calls formatName()
// internally, so mocking ./api changes what greet() returns (mục 2, 6).
import { formatName } from './api'

export function greet(name: string): string {
  return `Hello, ${formatName(name)}!`
}
