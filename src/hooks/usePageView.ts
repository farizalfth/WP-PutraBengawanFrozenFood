import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/live'

const seenPaths = new Set<string>()

export function usePageView() {
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    if (seenPaths.has(path)) return
    seenPaths.add(path)
    void trackPageView(path)
  }, [path])
}