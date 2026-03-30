import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * useScrollTop
 * Scrolls the window to the top whenever the route pathname changes.
 * Import and call inside RootLayout or any component that needs it.
 */
export function useScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
}
