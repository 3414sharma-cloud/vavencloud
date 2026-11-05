import '@/modules/track-record/track-record.css'
import type { Section } from '@/app/types.ts'
import { brandLogos } from '@/modules/track-record/brand-logos.ts'
import { logoImage } from '@/shared/ui/logo.ts'
import { toolLogos } from './tool-logos.v5.ts'

/*
 * v5's strip under the hero: a continuous slider (marquee) instead of v4's fixed row, and without Linux,
 * PostgreSQL and MySQL. The clouds keep their brand logos; the tools we run on top of them show their own
 * logo marks (Simple Icons, CC0, in tool-logos.v5.ts) with the name beside them. The list is drawn twice
 * so the loop is seamless; the copy is hidden from screen readers. It pauses on hover and focus, and with
 * reduced motion it stops and simply wraps.
 */

/** The clouds, as logos (brand-logos.ts), and VavenCloud as our own logo image */
const clouds = ['AWS', 'Azure', 'Google Cloud', 'VavenCloud']

/** The tools we run on those clouds, drawn with their logos from tool-logos.v5.ts */
const tools = ['DigitalOcean', 'Kubernetes', 'Docker', 'Terraform', 'Nginx', 'Redis', 'Cloudflare', 'GitHub Actions'].map((name) => ({ name }))

const ownLogo = () =>
  logoImage('/logo.png', 'tr-own dark:hidden', 'VavenCloud') + logoImage('/logo-light.png', 'tr-own hidden dark:block', 'VavenCloud')

const cloudLogo = (name: string) => {
  if (name === 'VavenCloud') return ownLogo()
  const l = brandLogos[name]
  if (!l) return `<span>${name}</span>`
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  const height = l.wordmark ? 30 : 26
  const colors = [l.color && `--c:${l.color}`, l.darkColor && `--c-dark:${l.darkColor}`].filter(Boolean).join(';')
  const svg = `<svg width="${Math.round((height * w) / h)}" height="${height}" viewBox="${l.viewBox}" fill="currentColor" style="${colors}" aria-hidden="true">${l.body}</svg>`
  return l.wordmark ? `${svg}<span class="sr-only">${name}</span>` : `${svg}<span>${name}</span>`
}

/** A tool's logo mark (tool-logos.v5.ts) with its name beside it, in the same size as the cloud marks */
const toolLogo = (name: string) => {
  const l = toolLogos[name]
  if (!l) return `<span>${name}</span>`
  const colors = [l.color && `--c:${l.color}`, l.darkColor && `--c-dark:${l.darkColor}`].filter(Boolean).join(';')
  return `<svg width="26" height="26" viewBox="${l.viewBox}" fill="currentColor" style="${colors}" aria-hidden="true">${l.body}</svg><span>${name}</span>`
}

const items = () =>
  [
    ...clouds.map((c) => `<li class="tr-logo">${cloudLogo(c)}</li>`),
    ...tools.map((t) => `<li class="tr-logo">${toolLogo(t.name)}</li>`),
  ].join('')

export function trackRecordV5({ label = 'Runs on what you already run' }: { label?: string } = {}): Section {
  return {
    html: `
<section id="track-record" aria-labelledby="track-record-title" class="border-b border-neutral-200 dark:border-neutral-800">
  <div class="tr-band tr-band--slider">
    <p id="track-record-title" class="tr-label">${label}</p>
    <div class="tr-marquee">
      <div class="tr-marquee-track">
        <ul class="tr-logos">${items()}</ul>
        <ul class="tr-logos" aria-hidden="true">${items()}</ul>
      </div>
    </div>
  </div>
</section>`,
  }
}
