import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { site } from '@/app/site.config.ts'
import { useScrollOnNavigate } from '@/hooks/useScrollOnNavigate.ts'
import { startSmoothScroll } from '@/lib/smooth-scroll.ts'
import { PaletteSwitch } from '@/components/ui/PaletteSwitch.tsx'
import { Footer } from './Footer.tsx'
import { Header, TopBar } from './Header.tsx'
import { navLinks } from './nav.data.ts'

/**
 * Every page's frame: the skip link, the top bar and header, the page in <main id="main">, the footer.
 * Rendered straight into #app (no wrapper), so `#app > footer` and `#main > section` (CSS, reveal.ts) match.
 */
export function SiteLayout() {
  useEffect(() => startSmoothScroll(), [])
  useScrollOnNavigate()
  const { pathname } = useLocation()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-neutral-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-white dark:focus:text-neutral-950"
      >
        Skip to content
      </a>
      <TopBar />
      <Header links={navLinks} />
      <main id="main">
        {/* Keyed by address, so each page mounts fresh (its effects start, and stop when it's left) */}
        <Outlet key={pathname} />
      </main>
      <Footer />
      {site.paletteSwitcher && <PaletteSwitch />}
    </>
  )
}
