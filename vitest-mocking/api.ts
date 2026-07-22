// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — the ./api module the post mocks.
// formatName is pure logic (kept real in partial mocks); fetchUser is the I/O
// boundary the tests replace. fetchUser is always mocked in the suite, so its
// real fetch never runs.

export function formatName(name: string): string {
  return name.trim().toUpperCase()
}

export async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
}
