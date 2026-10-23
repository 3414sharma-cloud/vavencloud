import { site } from '@/app/site.config.ts'

/** Same payload as the old site's POST /api/contact (vavencloud-static-website/src/types/contactForm.ts). */
export interface ContactFormInput {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
}

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

const SCRIPT_ID = 'google-recaptcha-v3'

/** Loads reCAPTCHA v3 once. Rejects when no site key is configured. */
export function loadRecaptcha(): Promise<void> {
  const key = site.api.recaptchaSiteKey
  if (!key) return Promise.reject(new Error('reCAPTCHA site key is not configured.'))
  if (window.grecaptcha?.execute) return new Promise((resolve) => window.grecaptcha!.ready(resolve))

  return new Promise((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => window.grecaptcha?.ready(resolve))
    script.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA.')))
  })
}

async function recaptchaToken(action = 'contact'): Promise<string> {
  await loadRecaptcha()
  const token = await window.grecaptcha!.execute(site.api.recaptchaSiteKey, { action })
  if (!token) throw new Error('reCAPTCHA verification failed.')
  return token
}

export function contactFromFormData(data: FormData): ContactFormInput {
  const value = (key: string) => String(data.get(key) ?? '').trim()
  return {
    name: value('name'),
    email: value('email'),
    company: value('company') || undefined,
    phone: value('phone') || undefined,
    subject: value('subject'),
    message: value('message'),
  }
}

/** Sends the message to the backend with a reCAPTCHA token. Throws with a readable message on failure. */
export async function submitContactForm(input: ContactFormInput): Promise<void> {
  if (!site.api.baseUrl) throw new Error('API base URL is not configured.')
  const response = await fetch(`${site.api.baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, recaptchaToken: await recaptchaToken() }),
  })
  if (!response.ok) {
    let detail = ''
    try {
      const body = (await response.json()) as { message?: string; error?: string }
      detail = body.message ?? body.error ?? ''
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail || `Unable to send message (${response.status}).`)
  }
}
