import { useEffect, useRef } from 'react'
import { qs } from '@/lib/dom.ts'
import { mountLogoParticles } from './logo-particles.ts'

/**
 * Starts the team hero's particle logo on the stage this ref is put on, and stops it (its animation, listeners
 * and canvas) when the page goes. The stage holds the form's label ([data-form-label]) and its progress line
 * ([data-form-progress]), which the particles update as they run.
 */
export function useLogoParticles<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const stage = ref.current
    if (!stage) return
    const label = qs('[data-form-label]', stage)
    const logo = mountLogoParticles(stage, {
      sources: ['/logo-text.png', '/logo-mark.png'], // first the wordmark, then the "V" mark
      holds: [7, 6],
      backdrop: true,
      // The logo's colours, blended a third of the way toward the site's sky blue; glow and trail in sky blue
      tint: { colour: '--color-brand-400', amount: 0.3 },
      accent: '--color-brand-400',
      scrollOut: true, // scrolling down, the dots pour out of the hero as the intro slides up over it
      progress: qs('[data-form-progress]', stage),
      onForm: (form) => (label.textContent = `FORM / 0${form + 1}`),
      onReady: () => stage.classList.add('is-ready'),
    })
    return () => {
      logo?.destroy()
      stage.classList.remove('is-ready')
    }
  }, [])

  return ref
}
