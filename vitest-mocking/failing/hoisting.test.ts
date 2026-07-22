// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 2, "hoisting — cái bẫy lớn nhất".
// EXPECTED TO FAIL at collection: the vi.mock factory is hoisted above `const fake`,
// so it references `fake` before initialization. The post quotes this exact error.
//
//   cd apps/examples && bun run test:failing
import { expect, test, vi } from 'vitest'
import { formatName } from '../api' // ../ vì demo nằm trong failing/; post dùng './api'

const fake = vi.fn(() => 'OUTER') // biến ngoài

vi.mock('../api', () => ({
  formatName: fake, // ❌ tham chiếu biến ngoài trong factory bị hoisted
}))

test('không chạy tới đây vì file lỗi ngay khi mock', () => {
  expect(formatName('x')).toBe('OUTER')
})
