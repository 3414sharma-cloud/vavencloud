import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, useLocation } from 'react-router'
import { routes } from '@/app/routes.ts'
import { useTheme } from '@/hooks/useTheme.ts'
import { setThemePreference } from '@/lib/theme.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { BrandLink } from '@/components/ui/Logo.tsx'
import { topBar, type NavLink } from './nav.data.ts'
import { btnPrimary, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The top bar (the 24/7 line, dismissible) and the site header: fully transparent at the top of the page, frosted
 * glass once the page scrolls or the mobile menu opens, dark while it's over a dark hero. Its links mark the
 * section in the middle of the screen.
 */

const desktopLink =
  'rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-neutral-600 xl:px-3.5 transition-colors hover:text-neutral-950 aria-[current=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:aria-[current=true]:text-white'

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'

const headerClass =
  'sticky top-0 z-50 border-b border-transparent transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 data-solid:border-neutral-950/5 data-solid:bg-paper/80 data-solid:shadow-[0_1px_0_rgb(255_255_255/0.55)_inset,0_8px_30px_-20px_rgb(24_24_27/0.18)] data-solid:backdrop-blur-md dark:data-solid:border-white/8 dark:data-solid:bg-neutral-950/75 dark:data-solid:shadow-[0_1px_0_rgb(255_255_255/0.05)_inset,0_8px_30px_-20px_rgb(0_0_0/0.65)]'

/* ---------- The top bar ---------- */

/** Change topBar.id (nav.data.ts) when the message changes, so dismissed bars show again */
const dismissKey = `vc-topbar-${topBar.id}`

const wasDismissed = () => {
  try {
    return localStorage.getItem(dismissKey) === '1'
  } catch {
    return false // storage blocked: just show it
  }
}

/** The emergency line above the navigation, unless this message was dismissed before */
export function TopBar() {
  const [dismissed, setDismissed] = useState(wasDismissed)
  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(dismissKey, '1')
    } catch {
      /* not persisted */
    }
  }
  return (
    <div
      id="top-bar"
      className={`relative z-[60] ${dismissed ? 'hidden ' : ''}bg-linear-to-r from-brand-700 via-brand-600 to-brand-700 text-sm text-brand-50`}
    >
      <div className={cn(container, 'flex min-h-10 items-center justify-center py-2 pr-12 pl-6 text-center')}>
        <p>
          {topBar.text}{' '}
          <a
            href={topBar.link.href}
            className="font-medium whitespace-nowrap text-white underline-offset-4 hover:underline"
          >
            {topBar.link.label} →
          </a>
        </p>
        <button
          type="button"
          data-top-bar-close=""
          className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-200 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Dismiss announcement"
          onClick={dismiss}
        >
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ---------- The header's state ---------- */

/**
 * Whether the page has scrolled, and whether the header sits over a dark hero (#main > .v5-hero-dark). Looked
 * up again on every page, since the header stays while the page under it changes.
 */
function useScrollState(header: RefObject<HTMLElement | null>, page: string) {
  const [scrolled, setScrolled] = useState(false)
  const [overDarkHero, setOverDarkHero] = useState(false)
  useEffect(() => {
    const darkHero = document.querySelector('#main > .v5-hero-dark')
    const update = () => {
      setOverDarkHero(
        darkHero !== null &&
          header.current !== null &&
          darkHero.getBoundingClientRect().bottom > header.current.getBoundingClientRect().top,
      )
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', update, { passive: true })
    if (darkHero) window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [header, page])
  return { scrolled, overDarkHero }
}

/**
 * The id of the section in the middle of the screen, among the ones the links point to (on this page: the
 * landing page's sections only exist there).
 */
function useActiveSection(links: NavLink[], page: string) {
  const [active, setActive] = useState<{ page: string; id: string }>()
  useEffect(() => {
    const targets = links
      .map((l) => document.getElementById(new URL(l.href, window.location.href).hash.slice(1)))
      .filter((t): t is HTMLElement => t !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive({ page, id: entry.target.id })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [links, page])
  return active?.page === page ? active.id : undefined
}

/** The mobile menu: open and closed, and Escape closes it (back to its button) */
function useMenu(toggle: RefObject<HTMLButtonElement | null>) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, toggle])
  return [open, setOpen] as const
}

/* ---------- The header ---------- */

/** The site header, on every page */
export function Header({ links }: { links: NavLink[] }) {
  const headerRef = useRef<HTMLElement>(null)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const page = useLocation().pathname
  const { scrolled, overDarkHero } = useScrollState(headerRef, page)
  const [menuOpen, setMenuOpen] = useMenu(menuToggle)
  const active = useActiveSection(links, page)
  const nextTheme = useTheme() === 'dark' ? 'light' : 'dark'
  const sectionOf = (href: string) => new URL(href, window.location.href).hash.slice(1)

  return (
    <header
      ref={headerRef}
      id="site-header"
      className={`${headerClass}${overDarkHero ? ' dark' : ''}`}
      data-solid={scrolled || menuOpen ? '' : undefined}
      data-menu-open={menuOpen ? '' : undefined}
    >
      <nav className={cn(container, 'flex h-18 items-center justify-between gap-6')} aria-label="Main">
        <BrandLink />

        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className={desktopLink}
                data-nav-link=""
                aria-current={active && sectionOf(l.href) === active ? 'true' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            id="theme-toggle"
            type="button"
            className={iconButton}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            onClick={() => setThemePreference(nextTheme)}
          >
            <span className="[html.dark_&]:hidden">
              <Icon name="moon" className="h-4 w-4" />
            </span>
            <span className="hidden [html.dark_&]:block">
              <Icon name="sun" className="h-4 w-4" />
            </span>
          </button>
          <Link to={routes.book} className={cn(btnPrimary, 'hidden whitespace-nowrap sm:inline-flex')}>
            Book a free review
          </Link>
          <button
            ref={menuToggle}
            id="menu-toggle"
            type="button"
            className={`${iconButton} lg:hidden`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span data-icon-open="" className={menuOpen ? 'hidden' : undefined}>
              <Icon name="menu" className="h-4 w-4" />
            </span>
            <span data-icon-close="" className={menuOpen ? undefined : 'hidden'}>
              <Icon name="x" className="h-4 w-4" />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${menuOpen ? '' : 'hidden '}border-t border-neutral-950/5 bg-paper/80 backdrop-blur-md lg:hidden dark:border-white/8 dark:bg-neutral-950/75`}
      >
        <ul className={cn(container, 'flex flex-col py-3')}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className="block rounded-xl px-3 py-3 text-base font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 pb-2">
            <Link to={routes.book} className={cn(btnPrimary, 'w-full')} onClick={() => setMenuOpen(false)}>
              Book a free review
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
