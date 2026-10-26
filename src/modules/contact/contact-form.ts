import { qs, qsa } from '@/shared/lib/dom.ts'
import { contactFromFormData, loadRecaptcha, submitContactForm } from './contact.service.ts'

type Status = 'idle' | 'error' | 'invalid' | 'sent'

const messages: Record<Exclude<Status, 'idle'>, { text: string; className: string }> = {
  invalid: { text: 'Please fill in the required fields marked *.', className: 'text-rose-600 dark:text-rose-400' },
  error: { text: 'Something went wrong. Please try again or email us directly.', className: 'text-rose-600 dark:text-rose-400' },
  sent: { text: 'Thanks, your message has been sent. We’ll get back to you shortly.', className: 'text-emerald-700 dark:text-emerald-400' },
}

/**
 * Contact form behaviour, matching the old site's ContactPageCard: validation, phone-character filter,
 * "Sending…" state, POST to /api/contact with an invisible reCAPTCHA v3 token.
 */
export function initContactForm(form: HTMLFormElement): void {
  const status = qs<HTMLParagraphElement>('#form-status', form)
  const submit = qs<HTMLButtonElement>('button[type="submit"]', form)
  const submitLabel = qs('[data-label]', submit)
  const idleText = status.innerHTML

  // Load reCAPTCHA in the background as soon as the form is near the viewport
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return
    observer.disconnect()
    loadRecaptcha().catch(() => {})
  }, { rootMargin: '400px' })
  observer.observe(form)

  // Phone: digits, spaces, + - ( ) only
  qs<HTMLInputElement>('input[name="phone"]', form).addEventListener('input', (e) => {
    const input = e.currentTarget as HTMLInputElement
    input.value = input.value.replace(/[^\d\s+\-()]/g, '')
  })

  const show = (state: Status) => {
    if (state === 'idle') {
      status.innerHTML = idleText
      status.className = 'mt-4 text-xs leading-relaxed text-neutral-500'
      return
    }
    status.textContent = messages[state].text
    status.className = `mt-4 text-sm font-medium ${messages[state].className}`
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const fields = qsa<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[required]', form)
    fields.forEach((field) => {
      const invalid = !field.checkValidity()
      field.setAttribute('aria-invalid', String(invalid))
      field.classList.toggle('!border-rose-400', invalid)
    })
    if (!form.checkValidity()) {
      show('invalid')
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    submit.disabled = true
    submitLabel.textContent = 'Sending…'
    try {
      await submitContactForm(contactFromFormData(new FormData(form)))
      show('sent')
      form.reset()
      fields.forEach((f) => f.removeAttribute('aria-invalid'))
    } catch (error) {
      console.error(error)
      show('error')
    } finally {
      submit.disabled = false
      submitLabel.textContent = 'Send message'
    }
  })
}
