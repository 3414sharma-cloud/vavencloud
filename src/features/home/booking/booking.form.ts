import { field } from '@/components/ui/classes.ts'
import { qsa } from '@/lib/dom.ts'
import type { ContactFormInput } from './booking.service.ts'

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/**
 * Whether a field was found wrong the last time its step was checked: undefined until then (no aria-invalid at
 * all), then true or false
 */
export type Invalid = boolean | undefined

/** Each field's state by its name (a radio group goes by the group's name) */
export type InvalidFields = Record<string, boolean>

/** A field's classes: the red border while it's wrong */
export const fieldCls = (invalid: Invalid, base = field) => `${base}${invalid ? ' !border-rose-400' : ''}`

export const ERROR = 'text-rose-600 dark:text-rose-400'

/**
 * Checks one step's required fields, with the browser's own rules (required, type="email"). Returns each one's
 * state by name, and the first that is wrong.
 */
export function check(step: HTMLElement): { fields: InvalidFields; first?: Field } {
  const fields: InvalidFields = {}
  let first: Field | undefined
  qsa<Field>('input, select, textarea', step)
    .filter((f) => f.required)
    .forEach((f) => {
      const invalid = !f.checkValidity()
      fields[f.name] = invalid
      if (invalid && !first) first = f
    })
  return { fields, first }
}

/** Whether the field (or the radio group) a change came from is filled in correctly now */
export function isFixed(form: HTMLFormElement, changed: Field): boolean {
  const required =
    changed.type === 'radio' ? form.querySelector<HTMLInputElement>(`input[name="${changed.name}"][required]`) : changed
  return required?.checkValidity() ?? true
}

/**
 * The subject sent to the backend: one of the old contact form's own options (vavencloud-static-website,
 * constants/contact/contactPageData.ts: CONTACT_PAGE_SUBJECTS), so a backend that only accepts those still takes it.
 * What kind of request it is, and whether it's urgent, leads the message instead.
 */
const BACKEND_SUBJECT = 'DevOps & Server Support'

/**
 * Turns both steps into the old contact form's /api/contact payload, field for field: name, email, company?,
 * phone?, subject, message (the service adds recaptchaToken). Step 2's answers become one readable message.
 */
export function toPayload(data: FormData): ContactFormInput {
  const v = (key: string) => String(data.get(key) ?? '').trim()
  const urgent = v('urgent') === 'yes'
  const lines = [
    urgent ? 'URGENT: production review request, something is broken right now' : 'Production review request',
    '',
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
    phone: v('phone') || undefined,
    subject: BACKEND_SUBJECT,
    message: lines.join('\n'),
  }
}
