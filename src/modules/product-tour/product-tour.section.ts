import type { Section } from '@/app/types.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { playButton } from '@/shared/ui/play-button.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'

const highlights: { icon: IconName; label: string; value: string }[] = [
  { icon: 'shield', label: 'DDoS protection', value: 'Active' },
  { icon: 'globe', label: 'Edge locations', value: '15+' },
  { icon: 'lock', label: 'SSL certificates', value: 'Auto' },
  { icon: 'clock', label: 'Daily backups', value: '30 days' },
]

/** "Discover what makes VavenCloud different" – big dark video banner. */
export function productTourSection(): Section {
  return {
    html: `
<section class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      ${sectionHeading({
        title: 'Discover what makes <span class="text-brand-600">VavenCloud</span> different',
        description: 'Take a two-minute tour of our platform, infrastructure and the team behind it.',
      })}
    </div>

    <div class="reveal relative mt-14">
      <div class="absolute -inset-x-6 -inset-y-6 rounded-[3rem] bg-linear-to-r from-brand-200/60 via-brand-100 to-brand-100 blur-2xl" aria-hidden="true"></div>
      <div data-nav="dark" class="relative overflow-hidden rounded-[2rem] bg-ink-950 shadow-2xl">
        <div class="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-600/50 blur-3xl" aria-hidden="true"></div>
        <div class="absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" aria-hidden="true"></div>
        ${particleLayer()}

        <div class="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span class="eyebrow-dark">${icon('play', 'h-3 w-3', true)} Product tour</span>
            <p class="mt-5 text-4xl leading-tight font-extrabold text-white sm:text-5xl">VavenCloud:<br /><span class="gradient-text">Secure Cloud Hosting</span></p>
            <p class="mt-4 max-w-md text-slate-400">Built-in security, global performance and expert support on every plan.</p>
            <div class="mt-8 flex flex-wrap items-center gap-5">
              ${playButton('Play product tour video', 'h-14 w-14')}
              <span class="text-sm font-semibold text-white">Watch now <span class="font-normal text-slate-400">· 2 min</span></span>
            </div>
          </div>

          <div class="hidden gap-3 lg:grid lg:grid-cols-2" aria-hidden="true">
            ${highlights
              .map(
                (h) => `
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <span class="text-brand-200">${icon(h.icon, 'h-5 w-5')}</span>
              <p class="mt-4 text-sm text-slate-400">${h.label}</p>
              <p class="text-xl font-bold text-white">${h.value}</p>
            </div>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`,
  }
}
