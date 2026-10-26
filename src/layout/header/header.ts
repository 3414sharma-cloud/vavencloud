import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { getTheme, onThemeChange, setThemePreference } from '@/shared/lib/theme.ts'
import { icon } from '@/shared/ui/icons.ts'
import { brandLink } from '@/shared/ui/logo.ts'
import { navLinks } from './nav.data.ts'

const desktopLink =
  'rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 aria-[current=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:aria-[current=true]:text-white'

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'

const html = () => `
<header id="site-header" class="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/95">
  <nav class="container-page flex h-16 items-center justify-between gap-6" aria-label="Main">
    ${brandLink()}

    <ul class="hidden items-center gap-1 lg:flex">
      ${navLinks.map((l) => `<li><a href="${l.href}" class="${desktopLink}" data-nav-link>${l.label}</a></li>`).join('')}
    </ul>

    <div class="flex items-center gap-2">
      <button id="theme-toggle" type="button" class="${iconButton}" aria-label="Switch theme">
        <span class="dark:hidden">${icon('moon', 'h-4 w-4')}</span>
        <span class="hidden dark:block">${icon('sun', 'h-4 w-4')}</span>
      </button>
      <a href="${routes.contact}" class="btn-primary hidden sm:inline-flex">Get in touch</a>
      <button id="menu-toggle" type="button" class="${iconButton} lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
        <span data-icon-open>${icon('menu', 'h-4 w-4')}</span>
        <span data-icon-close class="hidden">${icon('x', 'h-4 w-4')}</span>
      </button>
    </div>
  </nav>

  <div id="mobile-menu" class="hidden border-t border-neutral-200 lg:hidden dark:border-neutral-800">
    <ul class="container-page flex flex-col py-3">
      ${navLinks
        .map(
          (l) =>
            `<li><a href="${l.href}" class="block rounded-md px-2 py-3 text-base font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white">${l.label}</a></li>`,
        )
        .join('')}
      <li class="pt-2 pb-2"><a href="${routes.contact}" class="btn-primary w-full">Get in touch</a></li>
    </ul>
  </div>
</header>`

function initThemeToggle(siteHeader: HTMLElement): void {
  const toggle = qs<HTMLButtonElement>('#theme-toggle', siteHeader)
  toggle.addEventListener('click', () => setThemePreference(getTheme() === 'dark' ? 'light' : 'dark'))
  onThemeChange(() => {
    const next = getTheme() === 'dark' ? 'light' : 'dark'
    toggle.setAttribute('aria-label', `Switch to ${next} theme`)
    toggle.title = `Switch to ${next} theme`
  })
}

function initMobileMenu(siteHeader: HTMLElement): void {
  const toggle = qs<HTMLButtonElement>('#menu-toggle', siteHeader)
  const menu = qs('#mobile-menu', siteHeader)
  const setMenu = (open: boolean) => {
    menu.classList.toggle('hidden', !open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    qs('[data-icon-open]', toggle).classList.toggle('hidden', open)
    qs('[data-icon-close]', toggle).classList.toggle('hidden', !open)
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
  qsa('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)))
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false)
      toggle.focus()
    }
  })
}

/** Marks the nav link of the section currently in the middle of the viewport. */
function initActiveLink(siteHeader: HTMLElement): void {
  const links = qsa<HTMLAnchorElement>('[data-nav-link]', siteHeader)
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]))
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        links.forEach((a) => a.removeAttribute('aria-current'))
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true')
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  )
  byId.forEach((_, id) => {
    const target = document.getElementById(id)
    if (target) observer.observe(target)
  })
}

export function header(): Section {
  return {
    html: html(),
    init() {
      const siteHeader = qs('#site-header')
      initThemeToggle(siteHeader)
      initMobileMenu(siteHeader)
      initActiveLink(siteHeader)
    },
  }
}
