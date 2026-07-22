// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 3, vi.spyOn() keeps the real
// implementation by default.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { logger } from './logger' // logger.info(msg) trả về `INFO: ${msg}`

describe('vi.spyOn giữ implementation gốc', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('mặc định vẫn gọi hàm thật, chỉ ghi lại lời gọi', () => {
    const spy = vi.spyOn(logger, 'info')

    const result = logger.info('server started')

    expect(result).toBe('INFO: server started') // vẫn chạy code gốc
    expect(spy).toHaveBeenCalledWith('server started')
  })

  it('thay hành vi khi cần bằng mockReturnValue', () => {
    const spy = vi.spyOn(logger, 'info').mockReturnValue('MUTED')
    expect(logger.info('noisy')).toBe('MUTED')
    expect(spy).toHaveBeenCalledOnce()
  })
})
