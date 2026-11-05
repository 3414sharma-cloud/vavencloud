import type { Section } from '@/app/types.ts'
import { legalPaths } from './legal.routes.ts'

/*
 * The legal pages' layout, ported from vavencloud-static-website (components/legal/LegalPageLayout.tsx):
 * title, subtitle, intro and effective date, then each section's paragraphs, table, list, closing paragraphs,
 * related links and contact, and the links to the other policies at the end. The copy is the old site's, in
 * ./data, unchanged. Styled with this site's type and colours.
 */

interface LegalTable {
  headers: readonly string[]
  rows: readonly (readonly string[])[]
}

export interface LegalSection {
  heading: string
  body?: readonly string[]
  list?: readonly string[]
  table?: LegalTable
  bodyAfter?: readonly string[]
  links?: readonly { label: string; href: string }[]
  contact?: { email: string; address?: string }
}

export interface LegalPage {
  title: string
  subtitle?: string
  intro?: string
  effectiveDate?: string
  sections: readonly LegalSection[]
}

/** The copy is plain text: escape it before it goes into the markup */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const para = (text: string) => `<p class="mt-3 leading-relaxed">${esc(text)}</p>`
const linkCls = 'font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-200'

const table = (t: LegalTable) => `
  <div class="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800" role="region" tabindex="0" aria-label="Table">
    <table class="w-full min-w-[500px] border-collapse text-left text-sm">
      <thead><tr class="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">${t.headers.map((h) => `<th scope="col" class="px-4 py-3 font-semibold text-neutral-950 dark:text-white">${esc(h)}</th>`).join('')}</tr></thead>
      <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">${t.rows.map((r) => `<tr>${r.map((c) => `<td class="px-4 py-3">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>`

const links = (items: readonly { label: string; href: string }[]) => `
  <ul class="mt-3 space-y-2">${items
    .map((l) => {
      const external = !l.href.startsWith('/') && !l.href.startsWith('#')
      return `<li class="flex items-center gap-2"><span class="text-brand-600 dark:text-brand-400" aria-hidden="true">→</span><a href="${esc(l.href)}" class="${linkCls}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(l.label)}</a></li>`
    })
    .join('')}</ul>`

const contact = (c: { email: string; address?: string }) => `
  <p class="mt-3 leading-relaxed"><strong class="font-semibold text-neutral-800 dark:text-neutral-200">Email:</strong> <a href="mailto:${esc(c.email)}" class="${linkCls}">${esc(c.email)}</a>${
    c.address ? `<br><strong class="font-semibold text-neutral-800 dark:text-neutral-200">Address:</strong> ${esc(c.address)}` : ''
  }</p>`

const section = (s: LegalSection) => `
  <section>
    <h2 class="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-white">${esc(s.heading)}</h2>
    ${(s.body ?? []).map(para).join('')}
    ${s.table ? table(s.table) : ''}
    ${s.list ? `<ul class="mt-3 list-disc space-y-2 pl-5 leading-relaxed">${s.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
    ${(s.bodyAfter ?? []).map(para).join('')}
    ${s.links ? links(s.links) : ''}
    ${s.contact ? contact(s.contact) : ''}
  </section>`

/** The other policies, at the foot of every legal page (the one on screen is marked) */
const policies = [
  { label: 'Terms of Service', href: legalPaths.termsOfService },
  { label: 'Privacy Policy', href: legalPaths.privacyPolicy },
  { label: 'Acceptable Use Policy', href: legalPaths.acceptableUsePolicy },
  { label: 'Service Level Agreement (SLA)', href: legalPaths.serviceLevelAgreement },
  { label: 'Trust & Security', href: legalPaths.trustAndSecurity },
  { label: 'Contact Us', href: legalPaths.contact },
]

export function legalSection(page: LegalPage, current: string): Section {
  return {
    html: `
<section class="band-linen -mt-18 border-b border-neutral-200 pt-36 pb-14 sm:pt-44 sm:pb-20 dark:border-neutral-800" aria-labelledby="legal-title">
  <div class="container-page max-w-4xl">
    <h1 id="legal-title" class="text-5xl leading-[0.95] font-semibold tracking-[-0.05em] text-neutral-950 sm:text-6xl dark:text-white">${esc(page.title)}</h1>
    ${page.subtitle ? `<p class="mt-5 text-lg font-medium text-neutral-700 dark:text-neutral-300">${esc(page.subtitle)}</p>` : ''}
    ${page.intro ? `<p class="mt-5 max-w-3xl text-lg leading-relaxed">${esc(page.intro)}</p>` : ''}
    ${page.effectiveDate ? `<p class="mt-4 text-sm text-neutral-500"><strong class="font-semibold text-neutral-700 dark:text-neutral-300">Effective date:</strong> ${esc(page.effectiveDate)}</p>` : ''}
  </div>
</section>
<section class="py-16 sm:py-20" aria-label="${esc(page.title)}">
  <div class="container-page max-w-4xl">
    <div class="space-y-12">${page.sections.map(section).join('')}</div>
    <nav class="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-neutral-200 pt-8 text-sm dark:border-neutral-800" aria-label="Policies">
      ${policies.map((p) => `<a href="${p.href}" class="${linkCls}"${p.href === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
    </nav>
  </div>
</section>`,
  }
}
