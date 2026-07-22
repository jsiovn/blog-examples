// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 5, partial mock via importOriginal.
import { describe, it, expect, vi } from 'vitest'
import { formatName, fetchUser } from './api'

vi.mock('./api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./api')>()
  return {
    ...actual, // giữ mọi export gốc
    fetchUser: vi.fn().mockResolvedValue({ id: 99, name: 'mocked' }), // đè 1 cái
  }
})

describe('partial mock', () => {
  it('override fetchUser nhưng giữ formatName thật', async () => {
    expect(formatName('  an  ')).toBe('AN') // export thật vẫn chạy
    await expect(fetchUser(1)).resolves.toEqual({ id: 99, name: 'mocked' })
  })
})
