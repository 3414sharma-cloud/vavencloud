import '@/styles/main.css'
import type { PageOptions } from './types.ts'
import { site } from '@/app/site.config.ts'
import { header } from '@/layout/header/header.ts'
import { footer } from '@/layout/footer/footer.ts'
import { qs } from '@/shared/lib/dom.ts'
import { initPalette } from '@/shared/lib/palette.ts'
import { initAutoReveal } from '@/shared/lib/reveal.ts'
import { initSmoothScroll } from '@/shared/lib/smooth-scroll.ts'
import { initTheme } from '@/shared/lib/theme.ts'
import { paletteSwitcher } from '@/shared/ui/palette-switcher.ts'

const skipLink = `
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-neutral-950 focus:px-4 focus:py-2 focus:text-sm focus:text-white dark:focus:bg-white dark:focus:text-neutral-950">
  Skip to content
</a>`

/**
 * Renders a full page: shared layout (header, footer) around the page's sections, then initialises
 * everything. Every page entry (src/pages/**\/*.page.ts) calls this once.
 */
export function createPage({ sections, init }: PageOptions): void {
  initTheme()
  // Palette preview (Petrol / Sky): applied only while the switch is shown, so a saved choice can't outlive it
  if (site.paletteSwitcher) initPalette()

  const siteHeader = header()
  const siteFooter = footer()
  const extras = site.paletteSwitcher ? [paletteSwitcher()] : []

  qs<HTMLDivElement>('#app').innerHTML = `
    ${skipLink}
    ${siteHeader.html}
    <main id="main">${sections.map((s) => s.html).join('')}</main>
    ${siteFooter.html}
    ${extras.map((s) => s.html).join('')}
  `

  // Sections first, header after them: the header observes the rendered section anchors.
  ;[...sections, siteFooter, siteHeader, ...extras].forEach((s) => s.init?.())
  initAutoReveal()
  initSmoothScroll()
  init?.()
}
