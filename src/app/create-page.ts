import '@/styles/main.css'
import type { PageOptions } from './types.ts'
import { header } from '@/layout/header/header.ts'
import { footer } from '@/layout/footer/footer.ts'
import { videoModal } from '@/modules/video-modal/video-modal.section.ts'
import { initReveal } from '@/shared/lib/reveal.ts'
import { initParticleLayers } from '@/shared/ui/particle-layer.ts'
import { qs } from '@/shared/lib/dom.ts'

const skipLink = `
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">
  Skip to content
</a>`

/**
 * Renders a full page: shared layout (header, footer, global overlays) around the page's sections,
 * then initialises everything. Every page entry (src/pages/**\/*.page.ts) calls this once.
 */
export function createPage({ sections, init }: PageOptions): void {
  const siteHeader = header()
  const siteFooter = footer()
  const overlays = [videoModal()]

  qs<HTMLDivElement>('#app').innerHTML = `
    ${skipLink}
    ${siteHeader.html}
    <main id="main">${sections.map((s) => s.html).join('')}</main>
    ${siteFooter.html}
    ${overlays.map((o) => o.html).join('')}
  `

  // Sections first, header last: the header measures every [data-nav] zone on the page.
  ;[...sections, siteFooter, ...overlays, siteHeader].forEach((s) => s.init?.())
  init?.()
  initParticleLayers() // background particles in every non-hero dark/blue panel ([data-particles])
  initReveal()
}
