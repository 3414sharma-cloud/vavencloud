import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { brandLink } from '@/shared/ui/logo.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { footerColumns, legalLinks } from './footer.data.ts'

const html = () => `
<footer data-nav="dark" class="relative overflow-hidden bg-ink-950 pt-20 pb-10 text-slate-400">
  <div class="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-brand-700/20 blur-[120px]" aria-hidden="true"></div>
  ${particleLayer()}
  <div class="relative mx-auto max-w-7xl px-6">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        ${brandLink()}
        <p class="mt-5 max-w-sm leading-relaxed">VavenCloud delivers secure web hosting, scalable cloud servers, CDN, backups and professional email to help businesses of every size grow online.</p>
        <ul class="mt-6 flex gap-3">
          ${site.socials
            .map(
              (s) =>
                `<li><a href="${s.href}" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-brand-400 hover:bg-brand-500 hover:text-white" aria-label="VavenCloud on ${s.label}">${icon(s.icon, 'h-4 w-4')}</a></li>`,
            )
            .join('')}
        </ul>
      </div>

      ${footerColumns
        .map(
          (col) => `
      <nav class="lg:col-span-2" aria-label="${col.title}">
        <p class="text-sm font-semibold text-white">${col.title}</p>
        <ul class="mt-5 space-y-3 text-sm">
          ${col.links.map((l) => `<li><a href="${l.href}" class="transition hover:text-white">${l.label}</a></li>`).join('')}
        </ul>
      </nav>`,
        )
        .join('')}

      <div class="lg:col-span-4">
        <p class="text-sm font-semibold text-white">Contact Info</p>
        <ul class="mt-5 space-y-4 text-sm">
          <li class="flex gap-3"><span class="text-brand-300">${icon('mail', 'h-5 w-5')}</span><a href="mailto:${site.contact.email}" class="hover:text-white">${site.contact.email}</a></li>
          <li class="flex gap-3"><span class="text-brand-300">${icon('phone', 'h-5 w-5')}</span><span>${site.contact.phones.map((p) => `<a href="${p.href}" class="hover:text-white">${p.label}</a>`).join(', ')}</span></li>
          <li class="flex gap-3"><span class="text-brand-300">${icon('map-pin', 'h-5 w-5')}</span><span>${site.contact.address}</span></li>
        </ul>
      </div>
    </div>

    <div class="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
      <p>© <span id="year"></span> ${site.name}. All rights reserved.</p>
      <ul class="flex flex-wrap gap-6">
        ${legalLinks.map((l) => `<li><a href="${l.href}" class="hover:text-white">${l.label}</a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>`

export function footer(): Section {
  return {
    html: html(),
    init() {
      qs('#year').textContent = String(new Date().getFullYear())
    },
  }
}
