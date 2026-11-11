import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { getTheme, onThemeChange, setThemePreference } from '@/shared/lib/theme.ts'
import { icon } from '@/shared/ui/icons.ts'
import { brandLink } from '@/shared/ui/logo.ts'
import { navLinks, topBar, type NavLink } from './nav.data.ts'

const desktopLink =
  'rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-neutral-600 xl:px-3.5 transition-colors hover:text-neutral-950 aria-[current=true]:text-neutral-950 dark:text-neutral-400 dark:hover:text-white dark:aria-[current=true]:text-white'

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'

const announcement = () => `
<div id="top-bar" class="relative z-[60] hidden bg-linear-to-r from-brand-700 via-brand-600 to-brand-700 text-sm text-brand-50">
  <div class="container-page flex min-h-10 items-center justify-center py-2 pr-12 pl-6 text-center">
    <p>${topBar.text} <a href="${topBar.link.href}" class="font-medium whitespace-nowrap text-white underline-offset-4 hover:underline">${topBar.link.label} →</a></p>
    <button type="button" data-top-bar-close class="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-200 hover:text-white focus-visible:outline-2 focus-visible:outline-white" aria-label="Dismiss announcement">${icon('x', 'h-4 w-4')}</button>
  </div>
</div>`

const html = (links: NavLink[]) => `
${announcement()}
<!-- Fully transparent at the top of the page; becomes frosted glass once the page scrolls (or the mobile menu opens) -->
<header id="site-header" class="sticky top-0 z-50 border-b border-transparent transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 data-solid:border-neutral-950/5 data-solid:bg-paper/80 data-solid:shadow-[0_1px_0_rgb(255_255_255/0.55)_inset,0_8px_30px_-20px_rgb(40_32_20/0.18)] data-solid:backdrop-blur-md dark:data-solid:border-white/8 dark:data-solid:bg-neutral-950/75 dark:data-solid:shadow-[0_1px_0_rgb(255_255_255/0.05)_inset,0_8px_30px_-20px_rgb(0_0_0/0.65)]">
  <nav class="container-page flex h-18 items-center justify-between gap-6" aria-label="Main">
    ${brandLink()}

    <ul class="hidden items-center gap-0.5 lg:flex xl:gap-1">
      ${links.map((l) => `<li><a href="${l.href}" class="${desktopLink}" data-nav-link>${l.label}</a></li>`).join('')}
    </ul>

    <div class="flex items-center gap-2">
      <button id="theme-toggle" type="button" class="${iconButton}" aria-label="Switch theme">
        <span class="dark:hidden">${icon('moon', 'h-4 w-4')}</span>
        <span class="hidden dark:block">${icon('sun', 'h-4 w-4')}</span>
      </button>
      <a href="${routes.book}" class="btn-primary hidden whitespace-nowrap sm:inline-flex">Book a free review</a>
      <button id="menu-toggle" type="button" class="${iconButton} lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
        <span data-icon-open>${icon('menu', 'h-4 w-4')}</span>
        <span data-icon-close class="hidden">${icon('x', 'h-4 w-4')}</span>
      </button>
    </div>
  </nav>

  <div id="mobile-menu" class="hidden border-t border-neutral-950/5 bg-paper/80 backdrop-blur-md lg:hidden dark:border-white/8 dark:bg-neutral-950/75">
    <ul class="container-page flex flex-col py-3">
      ${links
        .map(
          (l) =>
            `<li><a href="${l.href}" class="block rounded-xl px-3 py-3 text-base font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white">${l.label}</a></li>`,
        )
        .join('')}
      <li class="pt-2 pb-2"><a href="${routes.book}" class="btn-primary w-full">Book a free review</a></li>
    </ul>
  </div>
</header>`

/** Shows the top bar unless this message was dismissed before. */
function initTopBar(): void {
  const bar = qs('#top-bar')
  const key = `vc-topbar-${topBar.id}`
  let dismissed = false
  try {
    dismissed = localStorage.getItem(key) === '1'
  } catch {
    /* storage blocked: just show it */
  }
  bar.classList.toggle('hidden', dismissed)
  qs('[data-top-bar-close]', bar).addEventListener('click', () => {
    bar.classList.add('hidden')
    try {
      localStorage.setItem(key, '1')
    } catch {
      /* not persisted */
    }
  })
}

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
    siteHeader.toggleAttribute('data-menu-open', open)
    siteHeader.dispatchEvent(new Event('vc:headerstate'))
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

/** Glass background only once the page has scrolled (or while the mobile menu is open). */
function initSolidOnScroll(siteHeader: HTMLElement): void {
  const update = () =>
    siteHeader.toggleAttribute('data-solid', window.scrollY > 8 || siteHeader.hasAttribute('data-menu-open'))
  window.addEventListener('scroll', update, { passive: true })
  siteHeader.addEventListener('vc:headerstate', update)
  update()
}

/** The site header. A page with its own sections passes its own `links` (the landing page's are the default). */
export function header(links: NavLink[] = navLinks): Section {
  return {
    html: html(links),
    init() {
      const siteHeader = qs('#site-header')
      initTopBar()
      initSolidOnScroll(siteHeader)
      initThemeToggle(siteHeader)
      initMobileMenu(siteHeader)
      initActiveLink(siteHeader)
    },
  }
}
