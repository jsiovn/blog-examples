// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 3, the FIXED
// version: reset shared state in beforeEach so order no longer matters.
// (The leaky version is failing/shared-state.test.ts.)
import { beforeEach, describe, expect, it } from 'vitest'

let cart: string[] = []

describe('giỏ hàng — reset trong beforeEach', () => {
  beforeEach(() => {
    cart = []
  })

  it('thêm 1 sản phẩm', () => {
    cart.push('áo')
    expect(cart).toHaveLength(1)
  })

  it('giỏ hàng rỗng cho user mới', () => {
    expect(cart).toHaveLength(0) // luôn PASS
  })
})
