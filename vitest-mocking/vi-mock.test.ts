// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 2, vi.mock() replaces the whole module.
import { describe, it, expect, vi } from 'vitest'
import { formatName } from './api'
import { greet } from './greeter' // greet() gọi formatName() bên trong

vi.mock('./api')

describe('vi.mock thay cả module', () => {
  it('mọi export biến thành vi.fn tự động', () => {
    vi.mocked(formatName).mockReturnValue('BOB')
    expect(greet('whatever')).toBe('Hello, BOB!')
    expect(formatName).toHaveBeenCalledWith('whatever')
  })
})
