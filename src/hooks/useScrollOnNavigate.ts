import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { glideTo, jumpToY } from '@/lib/smooth-scroll.ts'

/** Where the visitor was on each page they've been on (by history entry), for going back to it */
const positions = new Map<string, number>()

const sectionOf = (hash: string) =>
  hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null

/**
 * Scrolls the page after every navigation, the way the site's links have always behaved:
 *  - a link to a section on this page ("/#plans" while on "/") glides there; to this page without a section
 *    (or to #top), glides back to the top;
 *  - a link to another page opens it at the top; to a section on another page ("/#plans" from /team/), opens it
 *    at the top, then glides down to the section once it has laid out;
 *  - back and forward return to where the visitor was on that page;
 *  - opening the site on a section's address (a shared /#plans) starts at that section, as the browser would.
 * Used once, by the site's layout.
 */
export function useScrollOnNavigate(): void {
  const location = useLocation()
  const type = useNavigationType()
  const lastPath = useRef<string | null>(null)
  // The history entry the page has finished arriving at (set once it has been scrolled into place)
  const settled = useRef<string | null>(null)

  // Remembers where the visitor is on the current entry, as they scroll. Not saved on the way out: by then the
  // next page may already be on screen, and a shorter one cuts the scroll position down. Scrolling while the
  // address has changed but the page hasn't arrived yet (history.state is already the next entry's) is skipped.
  useEffect(() => {
    const onScroll = () => {
      const key = (history.state as { key?: string } | null)?.key ?? 'default'
      if (key === settled.current) positions.set(key, window.scrollY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    settled.current = location.key
    const firstLoad = lastPath.current === null
    const samePage = lastPath.current === location.pathname
    lastPath.current = location.pathname
    const target = sectionOf(location.hash)

    if (firstLoad) {
      if (target) glideTo(target, { immediate: true })
    } else if (type === 'POP') {
      const saved = positions.get(location.key)
      if (saved !== undefined) jumpToY(saved)
      else if (target) glideTo(target, { immediate: true })
      else jumpToY(0)
    } else if (samePage) {
      glideTo(target && location.hash !== '#top' ? target : 0)
    } else {
      jumpToY(0)
      if (target && location.hash !== '#top') {
        const timer = window.setTimeout(() => glideTo(target, { duration: 1.6 }), 250)
        return () => window.clearTimeout(timer)
      }
    }
  }, [location.key, location.pathname, location.hash, type])
}
