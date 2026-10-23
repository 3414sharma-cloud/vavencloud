import './header.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { mountGlassSurface } from '@/shared/effects/glass-surface.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { brandLink } from '@/shared/ui/logo.ts'
import { navLinks, type NavChild, type NavLink } from './nav.data.ts'

const linkClass = 'nav-fg rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white'

const externalAttrs = (c: NavChild) => (c.external ? 'target="_blank" rel="noopener noreferrer"' : '')

/** Mobile: top-level links, with dropdown groups as expandable <details> sections. */
const mobileItem = (l: NavLink) =>
  l.children
    ? `
      <li>
        <details class="group/m">
          <summary class="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/5">
            ${l.label} ${icon('chevron-down', 'h-4 w-4 text-slate-400 transition duration-300 group-open/m:rotate-180')}
          </summary>
          <ul class="mt-1 mb-2 ml-4 space-y-1 border-l border-white/10 pl-3">
            ${l.children
              .map(
                (c) =>
                  `<li><a href="${c.href}" ${externalAttrs(c)} class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white">${icon(c.icon, 'h-4 w-4 text-brand-300')}${c.label}${c.external ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a></li>`,
              )
              .join('')}
          </ul>
        </details>
      </li>`
    : `<li><a href="${l.href}" class="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/5">${l.label}</a></li>`

const dropdown = (link: NavLink) => `
<li class="group relative">
  <a href="${link.href}" class="${linkClass} flex items-center gap-1" aria-haspopup="true">
    ${link.label} ${icon('chevron-down', 'h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180')}
  </a>
  <div class="invisible absolute top-full left-1/2 w-80 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
    <ul class="rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
      ${link.heading ? `<li class="px-3 pt-2 pb-1 text-[0.7rem] font-semibold tracking-wider text-slate-500 uppercase" aria-hidden="true">${link.heading}</li>` : ''}
      ${(link.children ?? [])
        .map(
          (c) => `
      <li>
        <a href="${c.href}" ${externalAttrs(c)} class="flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">${icon(c.icon, 'h-4 w-4')}</span>
          <span>
            <span class="block text-sm font-semibold text-white">${c.label}${c.external ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</span>
            <span class="block text-xs text-slate-400">${c.description}</span>
          </span>
        </a>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</li>`

const html = () => `
<header id="site-header" class="pointer-events-none fixed inset-x-0 top-0 z-50">
  <nav id="site-nav" class="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main">
    ${brandLink({ className: 'nav-fg nav-brand', tone: 'auto' })}

    <ul class="hidden items-center gap-1 lg:flex">
      ${navLinks
        .map((link) => (link.children ? dropdown(link) : `<li><a href="${link.href}" class="${linkClass}">${link.label}</a></li>`))
        .join('')}
    </ul>

    <div class="hidden items-center gap-3 lg:flex">
      <a href="${routes.contact}" class="btn-primary !py-2.5">Let's Connect ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <button id="menu-toggle" type="button" class="nav-btn inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
      <span data-icon-open>${icon('menu')}</span>
      <span data-icon-close class="hidden">${icon('x')}</span>
    </button>
  </nav>

  <div id="mobile-menu" class="pointer-events-auto mx-3 mt-2 hidden rounded-3xl border border-brand-400/30 bg-ink-950/85 shadow-2xl shadow-black/30 backdrop-blur-md lg:hidden">
    <ul class="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6">
      ${navLinks.map(mobileItem).join('')}
      <li class="pt-3"><a href="${routes.contact}" class="btn-primary w-full">Free Consultation</a></li>
    </ul>
  </div>
</header>`

/**
 * Navbar states:
 *  - at the very top: full-width and fully transparent
 *  - scrolled (.is-scrolled): shrinks into a floating clear-glass pill with a brand-blue outline
 *  - each nav item gets .on-light when the background directly behind it is light, so the logo,
 *    links and menu button each switch between white and dark text independently.
 *    Sections mark themselves with data-nav="dark" | "light".
 * Returns the update function so the mobile menu can re-run it.
 */
function initNavState(siteHeader: HTMLElement): () => void {
  // React Bits GlassSurface look: refractive edges + RGB fringes in Chromium, frosted elsewhere.
  // Visible only in the scrolled pill state (see header.css).
  // Tuned so the content behind stays plain and unzoomed: only a thin rim at the very edge bends.
  //  - opacity 1 + brightness 50  -> the centre of the map is exact neutral grey = zero displacement
  //  - blur 2                     -> the bend doesn't bleed across the whole short pill (no "zoom")
  //  - borderWidth 0.04           -> narrower bending edge
  //  - displace 0 / saturation 1  -> no extra softening or colour boost through the glass
  mountGlassSurface(qs('#site-nav', siteHeader), {
    distortionScale: -90,
    borderWidth: 0.04,
    blur: 2,
    brightness: 50,
    opacity: 1,
    displace: 0,
    saturation: 1,
    backgroundOpacity: 0,
  })

  // The deepest/last zone containing a point wins, so a dark card inside a light section (or a light
  // form inside a dark card) is detected correctly. Uses rects instead of elementsFromPoint so
  // pointer-events-none layers (e.g. the hero wave edge) count too.
  const navZones = qsa('[data-nav]')
  const themeAt = (x: number, y: number) => {
    let theme = 'light'
    for (const zone of navZones) {
      const z = zone.getBoundingClientRect()
      if (x >= z.left && x <= z.right && y >= z.top && y <= z.bottom) theme = zone.dataset.nav ?? theme
    }
    return theme
  }

  const navItems = qsa('#site-nav .nav-fg, #site-nav .nav-btn', siteHeader)
  let frame = 0
  const update = () => {
    frame = 0
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12)
    const menuOpen = siteHeader.classList.contains('menu-open')
    navItems.forEach((item) => {
      const r = item.getBoundingClientRect()
      if (!r.width) return // hidden at this breakpoint
      const onLight = !menuOpen && themeAt(r.left + r.width / 2, r.top + r.height / 2) === 'light'
      item.classList.toggle('on-light', onLight)
    })
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  update()
  return update
}

function initMobileMenu(siteHeader: HTMLElement, updateNav: () => void): void {
  const toggle = qs<HTMLButtonElement>('#menu-toggle', siteHeader)
  const menu = qs('#mobile-menu', siteHeader)
  const setMenu = (open: boolean) => {
    menu.classList.toggle('hidden', !open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    qs('[data-icon-open]', toggle).classList.toggle('hidden', open)
    qs('[data-icon-close]', toggle).classList.toggle('hidden', !open)
    // Open menu: dark-tinted pill + dark panel so the white links read on any section
    siteHeader.classList.toggle('menu-open', open)
    updateNav()
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
  qsa('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)))
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false)
  })
}

export function header(): Section {
  return {
    html: html(),
    init() {
      const siteHeader = qs('#site-header')
      initMobileMenu(siteHeader, initNavState(siteHeader))
    },
  }
}
