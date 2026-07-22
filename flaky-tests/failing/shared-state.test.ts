// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 3, the BUG:
// module-level `cart` leaks between tests, so the 2nd test only fails when it runs
// after the 1st. EXPECTED TO FAIL (1 failed | 1 passed) — the post quotes this.
//
//   cd apps/examples && bun run test:failing
import { describe, expect, it } from 'vitest'

let cart: string[] = []

describe('giỏ hàng — KHÔNG reset', () => {
  it('thêm 1 sản phẩm', () => {
    cart.push('áo')
    expect(cart).toHaveLength(1)
  })

  it('giỏ hàng rỗng cho user mới', () => {
    expect(cart).toHaveLength(0) // rò state từ test trên
  })
})
