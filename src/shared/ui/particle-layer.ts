import { mountParticles, type ParticlesOptions } from '@/shared/effects/particles.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { isMobileViewport } from '@/shared/lib/motion.ts'

/**
 * Background particle layer for dark/blue panels (not heroes – they have their own effects).
 * Drop `${particleLayer()}` right after a panel's glow blobs; content after it must be `relative`.
 * createPage() mounts every layer on the page via initParticleLayers().
 */
export const particleLayer = () =>
  `<div data-particles class="pointer-events-none absolute inset-0" aria-hidden="true"></div>`

/** Shared look: brand blues on ink, small and subtle so text on top stays readable. */
const brandParticles = (): ParticlesOptions => ({
  particleColors: ['#ffffff', '#bfd1f2', '#93b2e8', '#648cdb'], // white, brand-200, -300, -400
  particleCount: isMobileViewport() ? 90 : 160,
  particleSpread: 10,
  speed: 0.08,
  particleBaseSize: 90,
  glow: 0.5,
  twinkle: 0.35,
  alphaParticles: true,
  opacity: 0.8,
  // Hover: particles near the cursor drift gently aside, with a soft lagging follow and a slow fade in/out
  moveParticlesOnHover: true,
  hoverEffect: 'repel',
  hoverRadius: 170,
  particleHoverFactor: 0.7,
  hoverSmoothing: 4, // ~0.25s cursor follow, ~0.8s fade in/out (original: 0.06s / 0.2s)
  // Panels contain buttons/links, so clicks shouldn't ripple the background
  clickBurst: false,
  pixelRatio: 1.5,
})

export function initParticleLayers(root: ParentNode = document): void {
  const options = brandParticles()
  qsa('[data-particles]', root).forEach((el) => mountParticles(el, options))
}
