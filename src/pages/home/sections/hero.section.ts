import './hero.css'
import type { Section } from '@/app/types.ts'
import { hero } from './hero.data.ts'

const html = () => `
<section id="top" class="hero band-linen relative -mt-18 overflow-hidden border-b border-neutral-200 dark:border-neutral-800" aria-labelledby="hero-title">
  <div class="hero-noise" aria-hidden="true"></div>
  <div class="container-page relative pt-32 pb-20 sm:pt-40 sm:pb-28">
    <div class="hero-intro">
      <p class="hero-eyebrow hero-enter" style="--i:0"><span>${hero.eyebrow}</span><i></i><span>${hero.kicker}</span></p>
      <h1 id="hero-title" class="hero-title hero-enter" style="--i:1"><span class="hero-title-line"><span>Your product</span></span><span class="hero-title-line"><em>has many owners.</em></span></h1>
      <p class="hero-description hero-enter" style="--i:2">The server, deployment and code often sit with different people. When something breaks, every handoff costs time.</p>
    </div>
  </div>
</section>`

export function heroSection(): Section {
  return { html: html() }
}
