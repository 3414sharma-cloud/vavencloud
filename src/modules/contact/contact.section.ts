import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { particleLayer } from '@/shared/ui/particle-layer.ts'
import { initContactForm } from './contact-form.ts'

/**
 * Subjects from the old site's contact form (CONTACT_PAGE_SUBJECTS).
 * "Email Solutions" is left out while email is hidden on the site.
 */
export const contactSubjects = [
  'Website Development',
  'Mobile App Development',
  'DevOps & Server Support',
  'Web Hosting',
  'Cloud Services',
  'Other',
]

interface ContactOptions {
  /** Options for the "Select Subject" dropdown. The first one is pre-selected. */
  subjects?: string[]
}

const required = '<span class="text-rose-500" aria-hidden="true">*</span>'
const label = (id: string, text: string, isRequired = false) =>
  `<label for="${id}" class="text-sm font-medium text-slate-700">${text} ${isRequired ? required : '<span class="font-normal text-slate-400">(optional)</span>'}</label>`

const infoItem = (iconName: 'phone' | 'mail' | 'map-pin', content: string) => `
  <li class="flex gap-4">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">${icon(iconName, 'h-5 w-5')}</span>
    <span class="pt-2 leading-relaxed text-brand-50">${content}</span>
  </li>`

export function contactSection({ subjects = contactSubjects }: ContactOptions = {}): Section {
  const { contact } = site
  return {
    html: `
<section id="contact" class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div data-nav="dark" class="reveal relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-brand-600 via-brand-700 to-ink-950 p-8 shadow-2xl shadow-brand-900/30 sm:p-12 lg:p-16">
      <div class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl" aria-hidden="true"></div>
      ${particleLayer()}

      <div class="relative grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span class="eyebrow-dark">Contact us</span>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">Let's talk about your project</h2>
          <p class="mt-5 max-w-md text-lg text-brand-100">Have a question or need help choosing a plan? Send us a message and our team will get back to you promptly.</p>

          <ul class="mt-10 space-y-5 text-sm">
            ${infoItem('phone', contact.phones.map((p) => `<a href="${p.href}" class="hover:text-white">${p.label}</a>`).join('<br />'))}
            ${infoItem('mail', `<a href="mailto:${contact.email}" class="hover:text-white">${contact.email}</a>`)}
            ${infoItem('map-pin', contact.address)}
          </ul>
        </div>

        <form id="contact-form" data-nav="light" class="rounded-3xl bg-white p-6 shadow-2xl sm:p-8" novalidate>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              ${label('contact-name', 'Name', true)}
              <input id="contact-name" name="name" type="text" autocomplete="name" required class="field" placeholder="John Doe" />
            </div>
            <div>
              ${label('contact-company', 'Company')}
              <input id="contact-company" name="company" type="text" autocomplete="organization" class="field" placeholder="Your company" />
            </div>
            <div>
              ${label('contact-email', 'Email', true)}
              <input id="contact-email" name="email" type="email" autocomplete="email" required class="field" placeholder="john@email.com" />
            </div>
            <div>
              ${label('contact-phone', 'Phone')}
              <input id="contact-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" pattern="[\\d\\s+\\-()]+" title="Digits, spaces, +, - and brackets only" class="field" placeholder="+91 012 3456 789" />
            </div>
            <div class="sm:col-span-2">
              ${label('contact-subject', 'Select Subject', true)}
              <select id="contact-subject" name="subject" required class="field">
                ${subjects.map((s, i) => `<option${i === 0 ? ' selected' : ''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-2">
              ${label('contact-message', 'Message', true)}
              <textarea id="contact-message" name="message" rows="4" required class="field resize-none" placeholder="Write your message…"></textarea>
            </div>
          </div>

          <button type="submit" class="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-70">
            <span data-label>Send Message</span> ${icon('arrow-right', 'h-4 w-4')}
          </button>
          <p id="form-status" class="mt-4 text-xs leading-relaxed text-slate-500" role="status" aria-live="polite">
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="font-medium text-slate-700 underline hover:text-brand-600">Privacy Policy</a> and
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="font-medium text-slate-700 underline hover:text-brand-600">Terms of Service</a> apply.
          </p>
        </form>
      </div>
    </div>
  </div>
</section>`,
    init: () => initContactForm(qs<HTMLFormElement>('#contact-form')),
  }
}
