// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 2, vi.hoisted() so a hoisted
// factory can reference a variable. (The broken version is failing/hoisting.test.ts.)
import { describe, it, expect, vi } from 'vitest'
import { formatName } from './api'

const mocks = vi.hoisted(() => ({
  formatName: vi.fn(() => 'HOISTED'),
}))

vi.mock('./api', () => ({
  formatName: mocks.formatName,
}))

describe('vi.hoisted', () => {
  it('factory dùng được biến đã hoist', () => {
    expect(formatName('x')).toBe('HOISTED')
    expect(formatName).toBe(mocks.formatName)
  })
})
