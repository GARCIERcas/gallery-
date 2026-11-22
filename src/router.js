import { useEffect, useState } from 'react'
import { config } from './config.js'

const read = () => window.location.hash.replace(/^#/, '') || '/'
const scrollPos = {}

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    let current = read()
    const on = () => {
      scrollPos[current] = window.scrollY
      current = read()
      setRoute(current)
      requestAnimationFrame(() => window.scrollTo(0, current === '/' ? scrollPos['/'] || 0 : 0))
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const navigate = (path) => { window.location.hash = path }

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${config.shopName}` : config.shopName
  }, [title])
}
