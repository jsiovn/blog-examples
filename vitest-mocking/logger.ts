// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — the object vi.spyOn wraps (mục 3).
// logger.info returns its formatted string so the spy test can assert the real
// implementation still ran.
export const logger = {
  info(msg: string): string {
    return `INFO: ${msg}`
  },
}
