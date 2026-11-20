import type { Invalid } from './booking.form.ts'

/* The booking form's labels, hints and option groups */

export const Req = () => (
  <span className="text-rose-600 dark:text-rose-400" aria-hidden="true">
    *
  </span>
)
export const Optional = () => <span className="font-normal text-neutral-500">(optional)</span>

export const Label = ({ id, text, required = true }: { id: string; text: string; required?: boolean }) => (
  <label htmlFor={id} className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
    {text} {required ? <Req /> : <Optional />}
  </label>
)

export const Help = ({ id, text }: { id: string; text: string }) => (
  <p id={`${id}-help`} className="mt-1.5 text-xs text-neutral-500">
    {text}
  </p>
)

interface ChoicesProps {
  name: string
  legend: string
  options: string[]
  required?: boolean
  hint?: string
  cols?: string
  invalid?: Invalid
}

/**
 * A question answered by picking one option (radios styled as buttons). The group is required through its first
 * radio, which also carries aria-invalid; its options' borders turn red while it's unanswered (except the one
 * under the pointer).
 */
export const Choices = ({
  name,
  legend,
  options,
  required = true,
  hint = '',
  cols = 'sm:grid-cols-2',
  invalid,
}: ChoicesProps) => (
  <fieldset
    className={'sm:col-span-2' + (invalid ? ' [&_label]:border-rose-400' : '')}
    aria-describedby={hint ? `${name}-help` : undefined}
  >
    <legend className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
      {legend} {required ? <Req /> : <Optional />}
    </legend>
    <div className={`mt-2 grid gap-2 ${cols}`}>
      {options.map((o, i) => (
        <label
          key={o}
          className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 transition-colors hover:border-neutral-400 has-checked:border-brand-600 has-checked:bg-brand-600 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:has-checked:border-brand-500 dark:has-checked:bg-brand-500 dark:has-checked:text-white"
        >
          <input
            type="radio"
            name={name}
            value={o}
            className="sr-only"
            required={required && i === 0}
            aria-invalid={required && i === 0 ? invalid : undefined}
          />
          {o}
        </label>
      ))}
    </div>
    {hint && <Help id={name} text={hint} />}
  </fieldset>
)
