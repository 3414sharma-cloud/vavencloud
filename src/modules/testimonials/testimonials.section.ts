import type { Section } from '@/app/types.ts'
import { icon } from '@/shared/ui/icons.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { playButton } from '@/shared/ui/play-button.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { caseStudyVideo, results, testimonial } from './testimonials.data.ts'

export function testimonialsSection(): Section {
  return {
    html: `
<section id="clients" class="bg-white py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
    <div class="reveal">
      ${sectionHeading({
        eyebrow: 'Client Spotlight',
        title: 'Results our clients can <span class="text-brand-600">measure</span>',
        description:
          'See how teams use VavenCloud to launch faster, cut infrastructure costs and deliver better experiences to their customers.',
      })}

      <figure class="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <div class="flex text-brand-400">${icon('star', 'h-5 w-5', true).repeat(5)}</div>
        <blockquote class="mt-4 text-lg leading-relaxed font-medium text-slate-900">“${testimonial.quote}”</blockquote>
        <figcaption class="mt-6 flex items-center gap-4">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-400 font-bold text-white">${testimonial.initials}</span>
          <div>
            <p class="font-semibold text-slate-900">${testimonial.name}</p>
            <p class="text-sm text-slate-500">${testimonial.role}</p>
          </div>
        </figcaption>
      </figure>

      <ul class="mt-8 grid gap-4 sm:grid-cols-3">
        ${results
          .map(
            (r) =>
              `<li class="rounded-2xl border border-slate-200 p-4"><p class="text-2xl font-extrabold text-slate-900">${r.value}</p><p class="text-sm text-slate-500">${r.label}</p></li>`,
          )
          .join('')}
      </ul>
    </div>

    <div class="reveal relative" style="transition-delay:150ms">
      <div class="absolute -inset-4 rounded-[2.5rem] bg-linear-to-tr from-brand-200 to-brand-100 blur-2xl" aria-hidden="true"></div>
      <div data-nav="dark" class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-950 shadow-2xl">
        <div class="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-600/50 blur-3xl" aria-hidden="true"></div>
        <div class="absolute -right-10 -bottom-20 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" aria-hidden="true"></div>
        ${particleLayer()}
        <div class="absolute inset-x-8 top-8 grid grid-cols-3 gap-3 opacity-70" aria-hidden="true">
          <div class="col-span-2 h-24 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="h-24 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="h-16 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="col-span-2 h-16 rounded-xl border border-white/10 bg-white/5"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">${playButton('Play client story video')}</div>
        <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950 to-transparent p-6">
          <p class="text-xs font-semibold tracking-wider text-brand-200 uppercase">${caseStudyVideo.eyebrow}</p>
          <p class="mt-1 text-lg font-semibold text-white">${caseStudyVideo.title}</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
  }
}
