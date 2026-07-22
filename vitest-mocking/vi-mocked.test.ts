// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 6, vi.mocked() for the mock's type.
import { describe, it, expect, vi } from 'vitest'
import { formatName } from './api'
import { greet } from './greeter'

vi.mock('./api')

describe('vi.mocked cho đúng type', () => {
  it('truy cập được API của mock', () => {
    vi.mocked(formatName).mockReturnValue('BOB')
    expect(greet('x')).toBe('Hello, BOB!')
  })
})
