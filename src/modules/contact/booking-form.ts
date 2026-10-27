import { qs, qsa } from '@/shared/lib/dom.ts'
import { loadRecaptcha, submitContactForm, type ContactFormInput } from './contact.service.ts'

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const ERROR = 'text-rose-600 dark:text-rose-400'

/** Marks the required fields of one step; returns false (and focuses the first problem) if any are invalid. */
function validate(step: HTMLElement): boolean {
  const fields = qsa<Field>('input, select, textarea', step).filter((f) => f.required)
  let first: Field | undefined
  fields.forEach((f) => {
    const invalid = !f.checkValidity()
    f.setAttribute('aria-invalid', String(invalid))
    // Radio groups show the error on their option cards
    const target = f.type === 'radio' ? f.closest('fieldset') : f
    target?.classList.toggle(f.type === 'radio' ? 'is-invalid' : '!border-rose-400', invalid)
    if (invalid && !first) first = f
  })
  first?.focus()
  return !first
}

/** Turns both steps into the existing /api/contact payload: one subject, one readable message. */
function toPayload(data: FormData): ContactFormInput {
  const v = (key: string) => String(data.get(key) ?? '').trim()
  const urgent = v('urgent') === 'yes'
  const lines = [
    `Role: ${v('role')}`,
    `Product: ${v('product')}`,
    `Live: ${v('live')}`,
    `Monthly users: ${v('users')}`,
    `Hosted on: ${v('hosting')}`,
    `Monthly hosting spend: ${v('spend') || 'not given'}`,
    `Built and maintained by: ${v('builder')}`,
    `Biggest worry: ${v('worry') || 'not given'}`,
    `Wants it run: ${v('runOn')}`,
    `Urgent: ${urgent ? 'YES, something is broken right now' : 'no'}`,
  ]
  return {
    name: v('name'),
    email: v('email'),
    company: v('company') || undefined,
    subject: `${urgent ? '[URGENT] ' : ''}Production review request`,
    message: lines.join('\n'),
  }
}

/**
 * Two-step booking form: step 1 (contact) → step 2 (about the product) → confirmation.
 * Sends through the existing contact endpoint with reCAPTCHA v3.
 */
export function initBookingForm(form: HTMLFormElement): void {
  const [one, two] = qsa('[data-step]', form)
  const done = qs('[data-done]', form)
  const status = qs('#form-status', form)
  const submit = qs<HTMLButtonElement>('button[type="submit"]', form)
  const submitLabel = qs('[data-label]', submit)

  const show = (step: HTMLElement) => {
    ;[one, two, done].forEach((s) => (s.hidden = s !== step))
    status.textContent = ''
    qs<HTMLElement>('[data-step-title], [data-done-title]', step).focus()
  }

  // Load reCAPTCHA in the background once the form is near the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      observer.disconnect()
      loadRecaptcha().catch(() => {})
    },
    { rootMargin: '400px' },
  )
  observer.observe(form)

  // Clear an error as soon as the visitor fixes it
  form.addEventListener('change', (e) => {
    const f = e.target as Field
    if (f.getAttribute('aria-invalid') !== 'true' || !f.checkValidity()) return
    f.setAttribute('aria-invalid', 'false')
    f.classList.remove('!border-rose-400')
    f.closest('fieldset')?.classList.remove('is-invalid')
  })

  qs('[data-next]', one).addEventListener('click', () => {
    if (!validate(one)) {
      status.className = `mt-4 text-sm font-medium ${ERROR}`
      status.textContent = 'Please fill in the fields marked *.'
      return
    }
    show(two)
  })
  qs('[data-back]', two).addEventListener('click', () => show(one))

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (two.hidden) {
      qs<HTMLButtonElement>('[data-next]', one).click()
      return
    }
    if (!validate(two)) {
      status.className = `mt-4 text-sm font-medium ${ERROR}`
      status.textContent = 'Please answer the questions marked *.'
      return
    }
    submit.disabled = true
    submitLabel.textContent = 'Booking…'
    try {
      await submitContactForm(toPayload(new FormData(form)))
      show(done)
    } catch (error) {
      console.error(error)
      status.className = `mt-4 text-sm font-medium ${ERROR}`
      status.textContent = 'Something went wrong. Please try again, or email us and we’ll book it for you.'
    } finally {
      submit.disabled = false
      submitLabel.textContent = 'Book my free review'
    }
  })
}
