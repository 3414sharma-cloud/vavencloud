import './track-record.css'
import type { Section } from '@/app/types.ts'
import { logoImage } from '@/shared/ui/logo.ts'
import { brandLogos } from './brand-logos.ts'

/*
 * Under the hero, edge to edge: the clouds and open standards we work with, each as its logo in its own
 * colours (wordmarks without a name beside them). VavenCloud is our own logo image, as in the header (in the
 * site's colour on pages that ask for it, see .vc-logo). Nothing moves, so it needs no controls.
 */

const stack = ['AWS', 'Azure', 'Google Cloud', 'VavenCloud', 'Linux', 'PostgreSQL', 'MySQL']

/** The VavenCloud logo, as in the header: the indigo wordmark in light mode, the white one in dark */
const ownLogo = () => logoImage('/logo.png', 'tr-own dark:hidden', 'VavenCloud') + logoImage('/logo-light.png', 'tr-own hidden dark:block', 'VavenCloud')

/** A logo at a fixed height (wordmarks a little taller, to match the marks with a name), its width from its viewBox */
const logo = (name: string) => {
  if (name === 'VavenCloud') return ownLogo()
  const l = brandLogos[name]
  if (!l) return `<span>${name}</span>`
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  const height = l.wordmark ? 30 : 26
  const colors = [l.color && `--c:${l.color}`, l.darkColor && `--c-dark:${l.darkColor}`].filter(Boolean).join(';')
  const svg = `<svg width="${Math.round((height * w) / h)}" height="${height}" viewBox="${l.viewBox}" fill="currentColor" style="${colors}" aria-hidden="true">${l.body}</svg>`
  return l.wordmark ? `${svg}<span class="sr-only">${name}</span>` : `${svg}<span>${name}</span>`
}

export function trackRecordSection(): Section {
  return {
    html: `
<section id="track-record" aria-labelledby="track-record-title" class="border-b border-neutral-200 dark:border-neutral-800">
  <div class="tr-band">
    <p id="track-record-title" class="tr-label">Any cloud · Open standards</p>
    <ul class="tr-logos">
      ${stack.map((s) => `<li class="tr-logo">${logo(s)}</li>`).join('')}
    </ul>
  </div>
</section>`,
  }
}
