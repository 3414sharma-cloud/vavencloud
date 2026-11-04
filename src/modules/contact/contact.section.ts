import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { icon } from '@/shared/ui/icons.ts'
import { sectionHeading } from '@/shared/ui/section-heading.ts'
import { initBookingForm } from './booking-form.ts'

/**
 * Final call to action + two-step booking form (VavenCloud-Sample-Content.md).
 * Step 1 asks only what we need to reach them; step 2 qualifies. Both go to the existing
 * POST /api/contact endpoint as one structured message (see booking-form.ts).
 */

const req = '<span class="text-rose-600 dark:text-rose-400" aria-hidden="true">*</span>'
const label = (id: string, text: string, required = true) =>
  `<label for="${id}" class="text-sm font-medium text-neutral-800 dark:text-neutral-200">${text} ${required ? req : '<span class="font-normal text-neutral-500">(optional)</span>'}</label>`
const help = (id: string, text: string) => `<p id="${id}-help" class="mt-1.5 text-xs text-neutral-500">${text}</p>`

/** What happens after the form, shown before it so booking feels small and certain */
const nextSteps = [
  { title: 'We reply', text: 'Within one business day, to pick a time.' },
  { title: 'Free review', text: '45 minutes with a senior engineer.' },
  { title: 'Written roadmap', text: 'Yours to keep, within 48 hours.' },
]

/** The design spaces the number out; the link itself comes from site.config.ts */
const emergencyPhone = '+91 90609 79706'

/** A way to reach us other than the form: an icon, a short line, the number or address */
const reach = (ic: 'phone' | 'mail', text: string, value: string, href: string) => `
        <a href="${href}" class="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-400">
          <span class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300" aria-hidden="true">${icon(ic, 'h-4 w-4')}</span>
          <span class="min-w-0"><span class="block text-xs text-neutral-500">${text}</span><span class="block font-semibold text-neutral-950 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">${value}</span></span>
        </a>`

const choice = (name: string, value: string, required: boolean, first: boolean) => `
  <label class="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-colors hover:border-neutral-400 has-checked:border-brand-600 has-checked:bg-brand-600 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:has-checked:border-brand-500 dark:has-checked:bg-brand-500 dark:has-checked:text-white">
    <input type="radio" name="${name}" value="${value}" class="sr-only" ${required && first ? 'required' : ''} />
    ${value}
  </label>`

const choices = (name: string, legend: string, options: string[], { required = true, hint = '', cols = 'sm:grid-cols-2' } = {}) => `
  <fieldset class="sm:col-span-2" ${hint ? `aria-describedby="${name}-help"` : ''}>
    <legend class="text-sm font-medium text-neutral-800 dark:text-neutral-200">${legend} ${required ? req : '<span class="font-normal text-neutral-500">(optional)</span>'}</legend>
    <div class="mt-2 grid gap-2 ${cols}">${options.map((o, i) => choice(name, o, required, i === 0)).join('')}</div>
    ${hint ? help(name, hint) : ''}
  </fieldset>`

const step1 = `
  <div data-step="1">
    <p class="text-xs font-medium tracking-wide text-neutral-500 uppercase">Step 1 of 2</p>
    <h3 class="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white" tabindex="-1" data-step-title>Let’s start with you.</h3>
    <div class="mt-6 grid gap-5 sm:grid-cols-2">
      <div>
        ${label('bk-name', 'Full name')}
        <input id="bk-name" name="name" type="text" autocomplete="name" required class="field" />
      </div>
      <div>
        ${label('bk-email', 'Work email')}
        <input id="bk-email" name="email" type="email" autocomplete="email" required class="field" aria-describedby="bk-email-help" />
        ${help('bk-email', 'We’ll send your roadmap here.')}
      </div>
      <div>
        ${label('bk-company', 'Company and website')}
        <input id="bk-company" name="company" type="text" autocomplete="organization" required class="field" aria-describedby="bk-company-help" />
        ${help('bk-company', 'So we can look at your product before the call.')}
      </div>
      <div>
        ${label('bk-role', 'Your role')}
        <div class="relative mt-1.5" data-custom-select>
          <select id="bk-role" name="role" required tabindex="-1" aria-hidden="true" class="pointer-events-none absolute h-px w-px opacity-0">
            <option value="" selected disabled>Choose your role</option>
            <option>Founder or CEO</option>
            <option>CTO</option>
            <option>Head of engineering</option>
            <option>Other</option>
          </select>
          <button type="button" class="field mt-0 flex w-full items-center justify-between text-left font-medium" data-role-trigger aria-haspopup="listbox" aria-expanded="false" aria-controls="bk-role-options">
            <span data-role-label class="text-neutral-500 dark:text-neutral-400">Choose your role</span>
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-transform duration-200 dark:bg-neutral-800 dark:text-neutral-300" data-role-chevron>${icon('chevron-down', 'h-4 w-4')}</span>
          </button>
          <div id="bk-role-options" class="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_18px_36px_-18px_rgb(0_0_0/0.28)] dark:border-neutral-700 dark:bg-neutral-900" data-role-options role="listbox" aria-label="Your role" hidden>
            ${['Founder or CEO', 'CTO', 'Head of engineering', 'Other']
              .map(
                (role) => `<button type="button" role="option" aria-selected="false" data-role-option="${role}" class="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-800 focus-visible:bg-brand-50 focus-visible:text-brand-800 focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-brand-950/60 dark:hover:text-brand-200 dark:focus-visible:bg-brand-950/60 dark:focus-visible:text-brand-200">${role}<span class="hidden text-brand-600 dark:text-brand-300" data-role-check>${icon('check', 'h-4 w-4')}</span></button>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="btn-primary mt-7 w-full !py-3" data-next>Continue ${icon('arrow-right', 'h-4 w-4')}</button>
  </div>`

const step2 = `
  <div data-step="2" hidden>
    <p class="text-xs font-medium tracking-wide text-neutral-500 uppercase">Step 2 of 2</p>
    <h3 class="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white" tabindex="-1" data-step-title>Tell us about your product.</h3>
    <p class="mt-1 text-sm text-neutral-500">Two minutes, and your call will be far more useful.</p>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      <div class="sm:col-span-2">
        ${label('bk-product', 'What does your product do?')}
        <input id="bk-product" name="product" type="text" required class="field" aria-describedby="bk-product-help" />
        ${help('bk-product', 'One or two sentences is perfect.')}
      </div>
      ${choices('live', 'Is it live with paying users?', ['Yes, live with paying users', 'Live, not yet paying', 'Launching in the next 3 months', 'Still an idea'])}
      ${choices('users', 'Roughly how many monthly users?', ['Under 1,000', '1,000 to 10,000', '10,000 to 100,000', 'Over 100,000'], { cols: 'grid-cols-2 sm:grid-cols-4' })}
      ${choices('hosting', 'Where is it hosted today?', ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean or similar', 'Shared or managed hosting', 'Not sure'], { hint: 'Not sure is a fine answer. We’ll find out together.', cols: 'grid-cols-2 sm:grid-cols-3' })}
      ${choices('spend', 'Monthly hosting spend', ['Under $200', '$200 to $1,000', '$1,000 to $5,000', 'Over $5,000', 'Not sure'], { required: false, cols: 'grid-cols-2 sm:grid-cols-3' })}
      ${choices('builder', 'Who builds and maintains it today?', ['In-house team', 'An agency', 'Freelancers', 'Nobody right now'], { cols: 'grid-cols-2 sm:grid-cols-4' })}
      <div class="sm:col-span-2">
        ${label('bk-worry', 'What’s the biggest worry right now?', false)}
        <input id="bk-worry" name="worry" type="text" class="field" aria-describedby="bk-worry-help" />
        ${help('bk-worry', 'For example: an outage last month, slow pages, no backups, the developer left.')}
      </div>
      ${choices('runOn', 'How would you like us to run it?', ['On VavenCloud', 'On our own cloud account', 'Not sure yet'], { cols: 'sm:grid-cols-3' })}
      <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm sm:col-span-2 dark:border-amber-900 dark:bg-amber-950/40">
        <input type="checkbox" name="urgent" value="yes" class="mt-0.5 h-4 w-4 shrink-0 accent-neutral-950" />
        <span><span class="font-medium text-neutral-950 dark:text-white">Something is broken right now. We need help urgently.</span>
        <span class="mt-0.5 block text-neutral-600 dark:text-neutral-400">Tick this and an engineer will contact you within 1 hour.</span></span>
      </label>
    </div>
    <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
      <button type="button" class="btn-secondary !py-3" data-back>Back</button>
      <button type="submit" class="btn-primary flex-1 !py-3"><span data-label>Book my free review</span> ${icon('arrow-right', 'h-4 w-4')}</button>
    </div>
    <p class="mt-4 text-xs leading-relaxed text-neutral-500">We only use this to prepare for your call. No newsletters, no sharing, ever. This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="underline">Privacy Policy</a> and
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="underline">Terms of Service</a> apply.</p>
  </div>`

const confirmation = `
  <div data-done hidden>
    <span class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">${icon('check', 'h-6 w-6')}</span>
    <h3 class="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white" tabindex="-1" data-done-title>You’re booked. Here’s what happens next.</h3>
    <ol class="mt-6 space-y-4">
      ${[
        site.bookingCalendarUrl
          ? 'Pick a 45-minute slot in the calendar. You’ll then get an invite and a short email from the engineer who’ll run your review.'
          : 'You’ll get a calendar invite and a short email from the engineer who’ll run your review.',
        'Before the call, we’ll take a quick look at your product from the outside, so we don’t waste your time on basics.',
        'Within 48 hours of the call, your written growth roadmap arrives in your inbox.',
      ]
        .map(
          (t, i) => `
      <li class="flex gap-4"><span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">${i + 1}</span><span class="pt-0.5 leading-relaxed">${t}</span></li>`,
        )
        .join('')}
    </ol>
    ${site.bookingCalendarUrl ? `<a href="${site.bookingCalendarUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary mt-8 w-full !py-3">Pick your time<span class="sr-only"> (opens in a new tab)</span> ${icon('arrow-right', 'h-4 w-4')}</a>` : ''}
  </div>`

/** `title`: the closing line above the form, for a page that ends on its own (an <em> goes on its own line) */
export function contactSection({ title = 'Stop running servers. <em>Start running your business.</em>' }: { title?: string } = {}): Section {
  return {
    html: `
<section id="book" class="band-linen border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800" aria-labelledby="book-title">
  <div class="container-page">
    <div class="max-w-5xl">
      ${sectionHeading({ id: 'book-title', eyebrow: 'A free production review', title })}
    </div>

    <div class="mx-auto mt-14 max-w-4xl border-t border-neutral-200 pt-10 dark:border-neutral-800">
      <div class="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p class="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">Start here</p>
          <h3 class="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">Tell us about your product.</h3>
        </div>
        <p class="text-sm text-neutral-500">Free. No commitment.</p>
      </div>
      <ol class="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-3" aria-label="What happens next">
        ${nextSteps
          .map(
            (s, i) => `
        <li class="border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <span class="font-mono text-xs text-brand-700 dark:text-brand-300" aria-hidden="true">0${i + 1}</span>
          <p class="mt-1 font-semibold text-neutral-950 dark:text-white">${s.title}</p>
          <p class="mt-1 text-sm text-neutral-500">${s.text}</p>
        </li>`,
          )
          .join('')}
      </ol>
      <form id="booking-form" class="mt-8 border-y border-neutral-200 py-8 sm:py-10 dark:border-neutral-800" novalidate aria-label="Book a free production review">
        ${step1}
        ${step2}
        ${confirmation}
        <p id="form-status" class="mt-4 text-sm font-medium" role="status" aria-live="polite"></p>
      </form>
      <div class="mt-8 grid gap-3 sm:grid-cols-2">
        ${reach('phone', 'Site down right now? Call 24/7', emergencyPhone, site.contact.phones[0].href)}
        ${reach('mail', 'Prefer email? A senior engineer replies within one business day', site.contact.email, `mailto:${site.contact.email}`)}
      </div>
    </div>
  </div>
</section>`,
    init() {
      initBookingForm(document.querySelector<HTMLFormElement>('#booking-form')!)
    },
  }
}
