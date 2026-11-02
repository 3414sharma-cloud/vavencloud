import { qs, qsa } from '@/shared/lib/dom.ts'
import { loadRecaptcha, submitContactForm, type ContactFormInput } from './contact.service.ts'

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const ERROR = 'text-rose-600 dark:text-rose-400'

/** Marks the required fields of one step; returns false (and focuses the first problem) if any are invalid. */
function validate(step: HTMLElement): boolean {
  const fields = qsa<Field>('input, select, textarea', step).filter((f) => f.required)
  let first: Field | undefined
  let firstFocus: HTMLElement | undefined
  fields.forEach((f) => {
    const invalid = !f.checkValidity()
    f.setAttribute('aria-invalid', String(invalid))
    // Radio groups and custom native-backed controls show errors on their visible wrapper.
    const target = f.type === 'radio' ? f.closest('fieldset') : f.closest<HTMLElement>('[data-custom-select]') ?? f
    target?.classList.toggle(f.type === 'radio' ? 'is-invalid' : '!border-rose-400', invalid)
    if (invalid && !first) {
      first = f
      firstFocus = f.closest<HTMLElement>('[data-custom-select]')?.querySelector<HTMLElement>('[data-role-trigger]') ?? f
    }
  })
  firstFocus?.focus()
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
function initRoleSelect(form: HTMLFormElement): void {
  const select = qs<HTMLSelectElement>('#bk-role', form)
  const root = qs<HTMLElement>('[data-custom-select]', form)
  const trigger = qs<HTMLButtonElement>('[data-role-trigger]', root)
  const menu = qs<HTMLElement>('[data-role-options]', root)
  const label = qs<HTMLElement>('[data-role-label]', root)
  const chevron = qs<HTMLElement>('[data-role-chevron]', root)
  const options = qsa<HTMLButtonElement>('[data-role-option]', root)

  const setOpen = (open: boolean, focusOption = false) => {
    menu.hidden = !open
    trigger.setAttribute('aria-expanded', String(open))
    chevron.classList.toggle('rotate-180', open)
    if (open && focusOption) (options.find((option) => option.dataset.roleOption === select.value) ?? options[0])?.focus()
  }
  const choose = (value: string) => {
    select.value = value
    label.textContent = value
    label.classList.remove('text-neutral-500', 'dark:text-neutral-400')
    options.forEach((option) => {
      const selected = option.dataset.roleOption === value
      option.setAttribute('aria-selected', String(selected))
      qs('[data-role-check]', option).classList.toggle('hidden', !selected)
    })
    select.dispatchEvent(new Event('change', { bubbles: true }))
    setOpen(false)
    trigger.focus()
  }

  trigger.addEventListener('click', () => setOpen(menu.hasAttribute('hidden'), true))
  options.forEach((option) => option.addEventListener('click', () => choose(option.dataset.roleOption ?? '')))
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true, true)
    }
  })
  menu.addEventListener('keydown', (event) => {
    const index = options.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      trigger.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      options[(index + (event.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length]?.focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      options[event.key === 'Home' ? 0 : options.length - 1]?.focus()
    }
  })
  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target as Node)) setOpen(false)
  })
}

export function initBookingForm(form: HTMLFormElement): void {
  const [one, two] = qsa('[data-step]', form)
  const done = qs('[data-done]', form)
  const status = qs('#form-status', form)
  const submit = qs<HTMLButtonElement>('button[type="submit"]', form)
  const submitLabel = qs('[data-label]', submit)

  initRoleSelect(form)

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
    const target = f.closest<HTMLElement>('[data-custom-select]') ?? f
    target.classList.remove('!border-rose-400')
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
