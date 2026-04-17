import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../services/api'

const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)
  
  const isMounted = useRef(true)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const fetchData = useCallback(async (overrideUrl = null, overrideOptions = null) => {
    const fetchUrl = overrideUrl || url
    const fetchOptions = overrideOptions || options
    
    if (!fetchUrl) {
      if (isMounted.current) {
        setError(new Error('URL is required'))
      }
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    setLoading(true)
    setError(null)
    setStatus(null)

    try {
      const response = await api({
        url: fetchUrl,
        method: fetchOptions.method || 'GET',
        data: fetchOptions.body || fetchOptions.data,
        params: fetchOptions.params,
        headers: fetchOptions.headers,
        signal: abortControllerRef.current.signal
      })
      
      if (isMounted.current) {
        setData(response.data)
        setStatus(response.status)
        setError(null)
      }
      return response.data
    } catch (err) {
      if (isMounted.current && err.name !== 'AbortError') {
        setError(err.response?.data?.error || err.message || 'An error occurred')
        setStatus(err.response?.status || 500)
      }
      return null
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [url, JSON.stringify(options)])

  const refetch = useCallback((newUrl = null, newOptions = null) => {
    return fetchData(newUrl, newOptions)
  }, [fetchData])

  const reset = useCallback(() => {
    if (isMounted.current) {
      setData(null)
      setError(null)
      setStatus(null)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (immediate && url) {
      fetchData()
    }
  }, [url, immediate, fetchData])

  return {
    data,
    loading,
    error,
    status,
    refetch,
    reset,
    isSuccess: !loading && !error && data !== null,
    isError: error !== null
  }
}

export default useFetch