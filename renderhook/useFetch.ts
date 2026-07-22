// Backs 2026-04-23-test-react-hooks-renderhook-vitest — mục 5, an async data hook.
import { useState, useEffect } from 'react'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (active) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [url])

  return { data, loading, error }
}
