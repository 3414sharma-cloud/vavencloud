import './ownership.css'
import type { Section } from '@/app/types.ts'
import { routes } from '@/app/routes.ts'
import { qsa, qs } from '@/shared/lib/dom.ts'
import { prefersReducedMotion } from '@/shared/lib/motion.ts'
import { icon } from '@/shared/ui/icons.ts'

const handoffs = [
  { role: 'Your host', owns: 'owns the server.', detail: 'Infrastructure status: healthy', tone: 'good' },
  { role: 'Your freelancer', owns: 'owns the pipeline.', detail: 'Last deployment: 6 months ago', tone: 'warning' },
  { role: 'Your developers', owns: 'own the code.', detail: 'Application scope: separate', tone: 'muted' },
  { role: 'The outage', owns: 'has no owner.', detail: 'Incident status: unresolved', tone: 'danger' },
] as const

export function ownershipSection(): Section {
  return {
    html: `
<section id="ownership" class="ownership-section is-pending py-24 sm:py-32" aria-labelledby="ownership-title">
  <div class="container-page">
    <div class="ownership-layout">
      <div class="ownership-feed-wrap">
        <p class="ownership-overline">A typical production handoff</p>
        <ol class="ownership-feed" aria-label="How production ownership is split">
          ${handoffs.map((item, index) => `<li class="ownership-entry${index === 0 ? ' is-active' : ''}" data-handoff="${index}" data-tone="${item.tone}" style="--step:${index}"><span class="ownership-count">${String(index + 1).padStart(2, '0')}</span><div><p><b>${item.role}</b> ${item.owns}</p><small>${item.detail}</small></div></li>`).join('')}
        </ol>
      </div>
      <div class="ownership-answer">
        <span class="ownership-answer-rule" aria-hidden="true"></span>
        <p class="ownership-answer-kicker">VavenCloud · production ownership</p>
        <h2 id="ownership-title"><span>When something breaks,</span><span>you make one call.</span><span>We own the outcome.</span></h2>
        <p>We own the servers, deployments and code behind your live product. We stay on it until it is working again.</p>
        <div class="ownership-actions"><a href="${routes.book}" class="btn-primary !px-7 !py-3.5 !text-base">Book a free production review ${icon('arrow-right', 'h-4 w-4')}</a><a href="${routes.book}" class="ownership-link">See what we review ${icon('arrow-right', 'h-4 w-4')}</a></div>
        <p class="ownership-reassurance">45 minutes with a senior engineer. You keep the written roadmap, whether or not you work with us.</p>
      </div>
    </div>
  </div>
</section>`,
    init() {
      const section = qs<HTMLElement>('#ownership')
      const items = qsa<HTMLElement>('[data-handoff]', section)
      const reveal = () => section.classList.add('is-visible')
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) reveal()
      else {
        const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { reveal(); observer.disconnect() } }, { threshold: 0.2 })
        observer.observe(section)
      }
      if (prefersReducedMotion()) return
      const update = () => {
        const anchor = window.innerHeight * 0.5
        const active = items.reduce((closest, item) => Math.abs(item.getBoundingClientRect().top - anchor) < Math.abs(closest.getBoundingClientRect().top - anchor) ? item : closest, items[0])
        items.forEach((item) => item.classList.toggle('is-active', item === active))
      }
      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      update()
    },
  }
}
