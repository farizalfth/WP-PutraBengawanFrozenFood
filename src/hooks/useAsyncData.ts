import { useCallback, useEffect, useRef, useState } from 'react'

interface FetchResult<T> {
  data: T | null
  error: string | null
}

export function useAsyncData<T>(
  fetcher: () => Promise<FetchResult<T>>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const depsKey = JSON.stringify(deps)

  useEffect(() => {
    setVersion((v) => v + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcherRef
      .current()
      .then((result) => {
        if (cancelled) return
        if (result.error) {
          setError(
            result.error.includes('Supabase belum dikonfigurasi')
              ? result.error
              : 'Gagal mengambil data. Silakan coba lagi.',
          )
          setData(null)
        } else {
          setData(result.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Gagal mengambil data. Silakan coba lagi.')
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { data, error, loading, refetch }
}

export default useAsyncData