import type { Section } from '@/app/types.ts'
import { mountCircularGallery } from '@/shared/effects/circular-gallery.ts'
import { qs } from '@/shared/lib/dom.ts'
import { isMobileViewport } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { featureCardImages } from './feature-card-image.ts'
import { features as defaultFeatures, type Feature } from './features.data.ts'

interface FeaturesOptions {
  features?: Feature[]
  /** Override the heading, e.g. "Every plan includes" on the pricing page */
  heading?: { eyebrow: string; title: string; description: string }
  /** `gallery`: curved, draggable CircularGallery (falls back to the grid without WebGL2). Default `grid`. */
  layout?: 'grid' | 'gallery'
}

const defaultHeading = {
  eyebrow: 'Why VavenCloud',
  title: 'Why businesses choose <span class="gradient-text">VavenCloud</span>',
  description: "Reliable infrastructure, hands-on engineers and support that actually picks up. Here's what you get with every plan.",
}

const grid = (features: Feature[]) => `
    <div data-features-grid class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${features
        .map(
          (f, i) => `
      <article class="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.06]" style="transition-delay:${i * 60}ms">
        <div class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-500/0 blur-2xl transition duration-500 group-hover:bg-brand-500/30" aria-hidden="true"></div>
        <span class="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/30 to-brand-400/20 text-brand-200 ring-1 ring-white/10">${icon(f.icon, 'h-6 w-6')}</span>
        <h3 class="relative mt-6 text-lg font-semibold text-white">${f.title}</h3>
        <p class="relative mt-2 leading-relaxed text-slate-400">${f.description}</p>
      </article>`,
        )
        .join('')}
    </div>`

/* Full-bleed so the arc runs edge to edge; the gallery's own edge fade blends it into the section. */
const gallery = () => `
    <div class="reveal relative mt-12 -mx-6 sm:mt-14">
      <div data-features-gallery class="h-[440px] sm:h-[520px] lg:h-[580px]"></div>
      <p class="mt-2 flex items-center justify-center gap-2 text-sm text-slate-500" aria-hidden="true">
        ${icon('arrow-right', 'h-4 w-4 rotate-180')} Drag or swipe to explore ${icon('arrow-right', 'h-4 w-4')}
      </p>
    </div>`

/**
 * Paints the cards, then mounts the gallery. The grid is hidden up front when WebGL2 exists (no layout jump)
 * and shown again if anything fails.
 */
async function initGallery(section: HTMLElement, features: Feature[]) {
  const host = qs('[data-features-gallery]', section)
  const wrapper = host.parentElement!
  const fallbackGrid = qs('[data-features-grid]', section)
  const fallback = () => {
    wrapper.hidden = true
    fallbackGrid.hidden = false
  }
  if (!('WebGL2RenderingContext' in window)) return fallback()
  fallbackGrid.hidden = true

  try {
    const images = await featureCardImages(features)
    const mounted = mountCircularGallery(host, {
      label: 'Why businesses choose VavenCloud',
      items: features.map((f, i) => ({ image: images[i], text: f.title, description: f.description, alt: f.title })),
      bend: isMobileViewport() ? 0.6 : 1, // gentle arc (React Bits default is 3)
      itemSize: 1.2,
      itemAspect: 0.78, // matches the 780x1000 painted cards
      gap: 0.18,
      borderRadius: 0.06,
      wave: 0.6,
      fadeEdges: 0.1,
      shadow: 0, // the cards are see-through glass, so a drop shadow would show as a dark blob inside them
      textColor: '#e2e8f0', // slate-200: placeholder + keyboard focus ring
      showTitles: false, // titles are painted into the cards
      openOnClick: false, // clicking centres a card; the text is already readable
      autoScroll: 0.35, // slow drift, pauses on hover/drag
      scrollEase: 0.06,
      captureVerticalWheel: false, // vertical wheel keeps scrolling the page
      dpr: 1.75,
    })
    if (!mounted) fallback()
  } catch {
    fallback()
  }
}

/** "Why VavenCloud" – feature cards on a dark background, as a grid or a curved gallery. */
export function featuresSection({ features = defaultFeatures, heading = defaultHeading, layout = 'grid' }: FeaturesOptions = {}): Section {
  const useGallery = layout === 'gallery'
  return {
    html: `
<section id="why-us" data-nav="dark" class="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
  <div class="pointer-events-none absolute top-0 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" aria-hidden="true"></div>
  ${particleLayer()}

  <div class="relative mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      ${sectionHeading({ tone: 'dark', ...heading })}
    </div>
    ${useGallery ? gallery() : ''}
    ${grid(features)}
  </div>
</section>`,
    init: useGallery ? () => void initGallery(qs('#why-us'), features) : undefined,
  }
}
