import './features.css'
import type { Section } from '@/app/types.ts'
import { qsa } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { regions, features } from './features.data.ts'

export function featuresSection(): Section {
  return {
    html: `
<section id="platform" class="platform-section border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="platform-title">
  <div class="container-page">
    <div class="platform-intro">
      <p class="platform-overline">The platform</p>
      <h2 id="platform-title">A real cloud, built for products that <em>can’t go down.</em></h2>
      <p>When you run on VavenCloud, your product sits on infrastructure we operate ourselves. From the virtualisation layer to your dashboard. No reselling. No black boxes.</p>
    </div>

    <div class="platform-manifesto">
      <p class="platform-manifesto-label">Your product runs on</p>
      <ol class="platform-capabilities" aria-label="VavenCloud platform capabilities">
        ${features
          .map(
            (feature, index) => `
            <li class="platform-capability${index === 0 ? ' is-active' : ''}" data-capability="${index}">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
            </li>`,
          )
          .join('')}
      </ol>
      <p class="platform-resolution"><span>One cloud.</span><strong>One team.</strong></p>
    </div>

    <div class="platform-bottom">
      <p class="platform-standard"><span></span><strong>Open standards.</strong> Standard Linux, MySQL, PostgreSQL and HAProxy. Nothing proprietary, nothing to unlearn if you leave.</p>
      <div class="platform-regions"><p class="platform-overline">Data residency</p><ul aria-label="Available regions">${regions.map((region, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${region.name}</strong><small>Partner data centre in ${region.city}</small></li>`).join('')}</ul></div>
    </div>
  </div>
</section>`,
    init() {
      const items = qsa<HTMLElement>('#platform [data-capability]')
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-seen'))
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight * 0.48) - Math.abs(b.boundingClientRect.top - window.innerHeight * 0.48))[0]
          if (!active) return
          const selected = active.target as HTMLElement
          items.forEach((item) => {
            item.classList.toggle('is-active', item === selected)
            if (item.getBoundingClientRect().top < window.innerHeight * 0.85) item.classList.add('is-seen')
          })
        },
        { rootMargin: '-35% 0px -42% 0px', threshold: 0 },
      )
      items.forEach((item) => observer.observe(item))
    },
  }
}
