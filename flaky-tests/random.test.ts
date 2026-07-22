// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 4.3, freeze
// Math.random with a spy so a random-dependent function is deterministic.
import { afterEach, expect, test, vi } from 'vitest'

function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('rollDice deterministic khi cố định Math.random', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
  expect(rollDice()).toBe(4) // floor(0.5 * 6) + 1
})
