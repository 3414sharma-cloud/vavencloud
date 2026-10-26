import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { onNeedChange } from '@/modules/needs/needs.store.ts'
import { qs } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { initContactForm } from './contact-form.ts'

/**
 * Contact form subjects, worded around the customer's product (docs/messaging.md).
 * The needs picker pre-selects one of these (see modules/needs/needs.data.ts → `subject`).
 */
export const contactSubjects = [
  'Launch my product',
  'Web Hosting',
  'Cloud Servers',
  'Move from another host',
  'On-call support',
  'A fix or new feature',
  'Other',
]

interface ContactOptions {
  /** Options for the "Subject" dropdown. The first one is pre-selected. */
  subjects?: string[]
}

const required = '<span class="text-rose-600 dark:text-rose-400" aria-hidden="true">*</span>'
const label = (id: string, text: string, isRequired = false) =>
  `<label for="${id}" class="text-sm font-medium text-neutral-800 dark:text-neutral-200">${text} ${isRequired ? required : '<span class="font-normal text-neutral-500">(optional)</span>'}</label>`

const infoItem = (iconName: 'phone' | 'mail' | 'map-pin', title: string, content: string) => `
  <li class="flex gap-4">
    <span class="icon-box">${icon(iconName, 'h-5 w-5')}</span>
    <div class="text-sm leading-relaxed">
      <p class="font-medium text-neutral-950 dark:text-white">${title}</p>
      <p class="mt-0.5">${content}</p>
    </div>
  </li>`

const linkClass = 'hover:text-neutral-950 hover:underline underline-offset-4 dark:hover:text-white'

export function contactSection({ subjects = contactSubjects }: ContactOptions = {}): Section {
  const { contact } = site
  return {
    html: `
<section id="contact" class="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-28 dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
    <div>
      ${sectionHeading({
        eyebrow: 'Contact',
        title: "Let's talk about your launch",
        description: 'Tell us what you have built and where it runs today. A real person will get back to you shortly.',
      })}
      <ul class="mt-10 space-y-6">
        ${infoItem('phone', 'Phone', contact.phones.map((p) => `<a href="${p.href}" class="${linkClass}">${p.label}</a>`).join('<br />'))}
        ${infoItem('mail', 'Email', `<a href="mailto:${contact.email}" class="${linkClass}">${contact.email}</a>`)}
        ${infoItem('map-pin', 'Office', contact.address)}
      </ul>
    </div>

    <form id="contact-form" class="card p-6 sm:p-8" novalidate>
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
          ${label('contact-subject', 'Subject', true)}
          <select id="contact-subject" name="subject" required class="field">
            ${subjects.map((s, i) => `<option${i === 0 ? ' selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="sm:col-span-2">
          ${label('contact-message', 'Message', true)}
          <textarea id="contact-message" name="message" rows="5" required class="field resize-none" placeholder="What does your product do, and where does it run today?"></textarea>
        </div>
      </div>

      <button type="submit" class="btn-primary mt-6 w-full !py-3">
        <span data-label>Send message</span> ${icon('arrow-right', 'h-4 w-4')}
      </button>
      <p id="form-status" class="mt-4 text-xs leading-relaxed text-neutral-500" role="status" aria-live="polite">
        This site is protected by reCAPTCHA and the Google
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="font-medium text-neutral-700 underline dark:text-neutral-300">Privacy Policy</a> and
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="font-medium text-neutral-700 underline dark:text-neutral-300">Terms of Service</a> apply.
      </p>
    </form>
  </div>
</section>`,
    init() {
      const form = qs<HTMLFormElement>('#contact-form')
      initContactForm(form)

      // Pre-select the subject that matches the visitor's choice in the hero picker
      const subject = qs<HTMLSelectElement>('#contact-subject', form)
      onNeedChange((need) => {
        if (need && subjects.includes(need.subject)) subject.value = need.subject
      })
    },
  }
}
