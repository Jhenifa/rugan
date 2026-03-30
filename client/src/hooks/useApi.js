import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'

/**
 * useApi — generic hook for GET requests
 *
 * @param {string} url     - API endpoint e.g. '/blog/posts'
 * @param {any}    initial - initial data value (default: null)
 *
 * @returns {{ data, loading, error, refetch }}
 *
 * Usage:
 *   const { data: posts, loading, error } = useApi('/blog/posts', [])
 */
export function useApi(url, initial = null) {
  const [data,    setData]    = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url)
      setData(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}
