import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react'
import { site } from '@/app/site.config.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { afterSteps } from './booking.data.ts'
import { ERROR, check, fieldCls, isFixed, toPayload, type InvalidFields } from './booking.form.ts'
import { loadRecaptcha, submitContactForm } from './booking.service.ts'
import { Choices, Help, Label } from './fields.tsx'
import { RoleSelect } from './RoleSelect.tsx'
import { btnPrimary, btnSecondary, field } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The two-step booking form: step 1 asks only what we need to reach them, step 2 qualifies, then the
 * confirmation. Both go to the existing POST /api/contact endpoint as one structured message (toPayload), with
 * reCAPTCHA v3, loaded once the form is near the screen. Each step is checked before moving on: the fields that
 * need answering turn red, the first is focused and a line says what's missing; fixing a field clears its red
 * at once.
 */

type Step = 'contact' | 'product' | 'done'

const titleCls = 'mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white'

interface StepProps {
  shown: boolean
  invalid: InvalidFields
  titleRef: RefObject<HTMLHeadingElement | null>
}

function ContactStep({
  shown,
  invalid,
  titleRef,
  role,
  onRole,
  roleTrigger,
  onNext,
}: StepProps & {
  role: string
  onRole: (role: string) => void
  roleTrigger: RefObject<HTMLButtonElement | null>
  onNext: () => void
}) {
  return (
    <div data-step="1" hidden={!shown}>
      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Step 1 of 2</p>
      <h3 ref={titleRef} className={titleCls} tabIndex={-1} data-step-title="">
        Let’s start with you.
      </h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label id="bk-name" text="Full name" />
          <input
            id="bk-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={fieldCls(invalid.name)}
            aria-invalid={invalid.name}
          />
        </div>
        <div>
          <Label id="bk-email" text="Work email" />
          <input
            id="bk-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldCls(invalid.email)}
            aria-invalid={invalid.email}
            aria-describedby="bk-email-help"
          />
          <Help id="bk-email" text="We’ll send your roadmap here." />
        </div>
        <div>
          <Label id="bk-company" text="Company and website" />
          <input
            id="bk-company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            className={fieldCls(invalid.company)}
            aria-invalid={invalid.company}
            aria-describedby="bk-company-help"
          />
          <Help id="bk-company" text="So we can look at your product before the call." />
        </div>
        <div>
          <Label id="bk-role" text="Your role" />
          <RoleSelect value={role} onChoose={onRole} invalid={invalid.role} triggerRef={roleTrigger} />
        </div>
      </div>
      <button type="button" className={cn(btnPrimary, 'mt-7 w-full !py-3')} data-next="" onClick={onNext}>
        Continue <Icon name="arrow-right" className="h-4 w-4" />
      </button>
    </div>
  )
}

function ProductStep({
  shown,
  invalid,
  titleRef,
  sending,
  onBack,
}: StepProps & { sending: boolean; onBack: () => void }) {
  return (
    <div data-step="2" hidden={!shown}>
      <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">Step 2 of 2</p>
      <h3 ref={titleRef} className={titleCls} tabIndex={-1} data-step-title="">
        Tell us about your product.
      </h3>
      <p className="mt-1 text-sm text-neutral-500">Two minutes, and your call will be far more useful.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label id="bk-product" text="What does your product do?" />
          <input
            id="bk-product"
            name="product"
            type="text"
            required
            className={fieldCls(invalid.product)}
            aria-invalid={invalid.product}
            aria-describedby="bk-product-help"
          />
          <Help id="bk-product" text="One or two sentences is perfect." />
        </div>
        <Choices
          name="live"
          legend="Is it live with paying users?"
          options={[
            'Yes, live with paying users',
            'Live, not yet paying',
            'Launching in the next 3 months',
            'Still an idea',
          ]}
          invalid={invalid.live}
        />
        <Choices
          name="users"
          legend="Roughly how many monthly users?"
          options={['Under 1,000', '1,000 to 10,000', '10,000 to 100,000', 'Over 100,000']}
          cols="grid-cols-2 sm:grid-cols-4"
          invalid={invalid.users}
        />
        <Choices
          name="hosting"
          legend="Where is it hosted today?"
          options={['AWS', 'Google Cloud', 'Azure', 'DigitalOcean or similar', 'Shared or managed hosting', 'Not sure']}
          hint="Not sure is a fine answer. We’ll find out together."
          cols="grid-cols-2 sm:grid-cols-3"
          invalid={invalid.hosting}
        />
        <Choices
          name="spend"
          legend="Monthly hosting spend"
          options={['Under $200', '$200 to $1,000', '$1,000 to $5,000', 'Over $5,000', 'Not sure']}
          required={false}
          cols="grid-cols-2 sm:grid-cols-3"
        />
        <Choices
          name="builder"
          legend="Who builds and maintains it today?"
          options={['In-house team', 'An agency', 'Freelancers', 'Nobody right now']}
          cols="grid-cols-2 sm:grid-cols-4"
          invalid={invalid.builder}
        />
        <div className="sm:col-span-2">
          <Label id="bk-worry" text="What’s the biggest worry right now?" required={false} />
          <input id="bk-worry" name="worry" type="text" className={field} aria-describedby="bk-worry-help" />
          <Help id="bk-worry" text="For example: an outage last month, slow pages, no backups, the developer left." />
        </div>
        <Choices
          name="runOn"
          legend="How would you like us to run it?"
          options={['On VavenCloud', 'On our own cloud account', 'Not sure yet']}
          cols="sm:grid-cols-3"
          invalid={invalid.runOn}
        />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm sm:col-span-2 dark:border-amber-900 dark:bg-amber-950/40">
          <input type="checkbox" name="urgent" value="yes" className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-950" />
          <span>
            <span className="font-medium text-neutral-950 dark:text-white">
              Something is broken right now. We need help urgently.
            </span>{' '}
            <span className="mt-0.5 block text-neutral-600 dark:text-neutral-400">
              Tick this and an engineer will contact you within 1 hour.
            </span>
          </span>
        </label>
      </div>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" className={cn(btnSecondary, '!py-3')} data-back="" onClick={onBack}>
          Back
        </button>
        <button type="submit" className={cn(btnPrimary, 'flex-1 !py-3')} disabled={sending}>
          <span data-label="">{sending ? 'Booking…' : 'Book my free review'}</span>{' '}
          <Icon name="arrow-right" className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">
        We only use this to prepare for your call. No newsletters, no sharing, ever. This site is protected by reCAPTCHA
        and the Google{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </div>
  )
}

function Confirmation({ shown, titleRef }: { shown: boolean; titleRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <div data-done="" hidden={!shown}>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <Icon name="check" className="h-6 w-6" />
      </span>
      <h3
        ref={titleRef}
        className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white"
        tabIndex={-1}
        data-done-title=""
      >
        You’re booked. Here’s what happens next.
      </h3>
      <ol className="mt-6 space-y-4">
        {afterSteps.map((t, i) => (
          <li key={i} className="flex gap-4">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
              {i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{t}</span>
          </li>
        ))}
      </ol>
      {site.bookingCalendarUrl && (
        <a
          href={site.bookingCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(btnPrimary, 'mt-8 w-full !py-3')}
        >
          Pick your time<span className="sr-only"> (opens in a new tab)</span>{' '}
          <Icon name="arrow-right" className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

export function BookingForm() {
  const [step, setStep] = useState<Step>('contact')
  const [invalid, setInvalid] = useState<InvalidFields>({})
  const [role, setRole] = useState('')
  const [sending, setSending] = useState(false)
  // The line under the form (what's missing, or that sending failed). Moving to another step clears its text
  const [status, setStatus] = useState({ text: '', error: false })

  const form = useRef<HTMLFormElement>(null)
  const contactTitle = useRef<HTMLHeadingElement>(null)
  const productTitle = useRef<HTMLHeadingElement>(null)
  const doneTitle = useRef<HTMLHeadingElement>(null)
  const roleTrigger = useRef<HTMLButtonElement>(null)
  // Set when the visitor moves between steps, so the new step's title takes focus once it's on screen
  const moved = useRef(false)

  const show = (next: Step) => {
    moved.current = true
    setStep(next)
    setStatus((s) => ({ ...s, text: '' }))
  }
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    ;({ contact: contactTitle, product: productTitle, done: doneTitle })[step].current?.focus()
  })

  /** Checks a step; if anything needs answering, marks it, focuses the first and says what's missing */
  const passes = (which: 'contact' | 'product', message: string) => {
    const el = form.current?.querySelector<HTMLElement>(`[data-step="${which === 'contact' ? 1 : 2}"]`)
    if (!el) return false
    const { fields, first } = check(el)
    setInvalid((prev) => ({ ...prev, ...fields }))
    if (!first) return true
    // The role's real field is hidden: its menu button takes the focus instead
    ;(first.name === 'role' ? roleTrigger.current : first)?.focus()
    setStatus({ text: message, error: true })
    return false
  }

  const next = () => {
    if (passes('contact', 'Please fill in the fields marked *.')) show('product')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (step === 'contact') return next()
    if (!passes('product', 'Please answer the questions marked *.')) return
    setSending(true)
    try {
      await submitContactForm(toPayload(new FormData(form.current!)))
      show('done')
    } catch (error) {
      console.error(error)
      setStatus({
        text: 'Something went wrong. Please try again, or email us and we’ll book it for you.',
        error: true,
      })
    } finally {
      setSending(false)
    }
  }

  const chooseRole = (value: string) => {
    setRole(value)
    setInvalid((prev) => (prev.role ? { ...prev, role: false } : prev))
  }

  useEffect(() => {
    const el = form.current
    if (!el) return
    // Clear a field's red as soon as the visitor fixes it. A native listener, so it also hears changes made by
    // the browser itself (autofill) or by other scripts, which React's onChange can miss.
    const onChange = (e: Event) => {
      const f = e.target as HTMLInputElement
      if (!f.name || !isFixed(el, f)) return
      setInvalid((prev) => (prev[f.name] ? { ...prev, [f.name]: false } : prev))
    }
    el.addEventListener('change', onChange)

    // Load reCAPTCHA in the background once the form is near the screen
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        loadRecaptcha().catch(() => {})
      },
      { rootMargin: '400px' },
    )
    io.observe(el)
    return () => {
      el.removeEventListener('change', onChange)
      io.disconnect()
    }
  }, [])

  return (
    <form
      ref={form}
      id="booking-form"
      className="mt-8 border-y border-neutral-200 py-8 sm:py-10 dark:border-neutral-800"
      noValidate
      aria-label="Book a free production review"
      onSubmit={submit}
    >
      <ContactStep
        shown={step === 'contact'}
        invalid={invalid}
        titleRef={contactTitle}
        role={role}
        onRole={chooseRole}
        roleTrigger={roleTrigger}
        onNext={next}
      />
      <ProductStep
        shown={step === 'product'}
        invalid={invalid}
        titleRef={productTitle}
        sending={sending}
        onBack={() => show('contact')}
      />
      <Confirmation shown={step === 'done'} titleRef={doneTitle} />
      <p
        id="form-status"
        className={'mt-4 text-sm font-medium' + (status.error ? ` ${ERROR}` : '')}
        role="status"
        aria-live="polite"
      >
        {status.text}
      </p>
    </form>
  )
}
