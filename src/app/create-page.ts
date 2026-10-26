import '@/styles/main.css'
import type { PageOptions } from './types.ts'
import { header } from '@/layout/header/header.ts'
import { footer } from '@/layout/footer/footer.ts'
import { qs } from '@/shared/lib/dom.ts'
import { initTheme } from '@/shared/lib/theme.ts'

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

  const siteHeader = header()
  const siteFooter = footer()

  qs<HTMLDivElement>('#app').innerHTML = `
    ${skipLink}
    ${siteHeader.html}
    <main id="main">${sections.map((s) => s.html).join('')}</main>
    ${siteFooter.html}
  `

  // Sections first, header last: the header observes the rendered section anchors.
  ;[...sections, siteFooter, siteHeader].forEach((s) => s.init?.())
  init?.()
}
