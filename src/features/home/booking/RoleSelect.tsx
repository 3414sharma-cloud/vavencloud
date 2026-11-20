import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { Icon } from '@/components/ui/Icon.tsx'
import { fieldCls, type Invalid } from './booking.form.ts'
import { roles } from './booking.data.ts'
import { field } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

interface RoleSelectProps {
  value: string
  onChoose: (role: string) => void
  invalid: Invalid
  /** The button that opens the menu: focused when the field needs answering */
  triggerRef: RefObject<HTMLButtonElement | null>
}

/**
 * "Your role": a real <select> (sent with the form, and checked like any field) behind a menu styled like the
 * other fields. The button opens the menu (also with the up and down arrows), the arrows, Home and End move
 * through it, Escape or a click elsewhere closes it, and picking a role sets the select.
 */
export function RoleSelect({ value, onChoose, invalid, triggerRef }: RoleSelectProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])

  // Shown at once, so focus can move into it, or back out, in the same moment
  const show = (next: boolean, focusOption = false) => {
    flushSync(() => setOpen(next))
    if (next && focusOption) (options.current[roles.indexOf(value)] ?? options.current[0])?.focus()
  }
  const choose = (role: string) => {
    onChoose(role)
    show(false)
    triggerRef.current?.focus()
  }

  // A click anywhere else closes it
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const onMenuKey = (e: KeyboardEvent) => {
    const list = options.current
    const index = list.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      show(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      list[(index + (e.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length]?.focus()
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      list[e.key === 'Home' ? 0 : list.length - 1]?.focus()
    }
  }

  return (
    <div ref={root} className={fieldCls(invalid, 'relative mt-1.5')} data-custom-select="">
      {/* The real field (sent with the form); the menu below sets it */}
      <select
        id="bk-role"
        name="role"
        required
        tabIndex={-1}
        aria-hidden="true"
        aria-invalid={invalid}
        className="pointer-events-none absolute h-px w-px opacity-0"
        value={value}
        onChange={(e) => onChoose(e.target.value)}
      >
        <option value="" disabled>
          Choose your role
        </option>
        {roles.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <button
        ref={triggerRef}
        type="button"
        className={cn(field, 'mt-0 flex w-full items-center justify-between text-left font-medium')}
        data-role-trigger=""
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="bk-role-options"
        onClick={() => show(!open, true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            show(true, true)
          }
        }}
      >
        <span data-role-label="" className={value ? undefined : 'text-neutral-500 dark:text-neutral-400'}>
          {value || 'Choose your role'}
        </span>
        <span
          className={
            `inline-flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-transform duration-200 dark:bg-neutral-800 dark:text-neutral-300` +
            (open ? ' rotate-180' : '')
          }
          data-role-chevron=""
        >
          <Icon name="chevron-down" className="h-4 w-4" />
        </span>
      </button>
      <div
        id="bk-role-options"
        className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-[0_18px_36px_-18px_rgb(0_0_0/0.28)] dark:border-neutral-700 dark:bg-neutral-900"
        data-role-options=""
        role="listbox"
        aria-label="Your role"
        hidden={!open}
        onKeyDown={onMenuKey}
      >
        {roles.map((role, i) => (
          <button
            key={role}
            ref={(el) => void (options.current[i] = el)}
            type="button"
            role="option"
            aria-selected={role === value}
            data-role-option={role}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-800 focus-visible:bg-brand-50 focus-visible:text-brand-800 focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-brand-950/60 dark:hover:text-brand-200 dark:focus-visible:bg-brand-950/60 dark:focus-visible:text-brand-200"
            onClick={() => choose(role)}
          >
            {role}
            <span className={`${role === value ? '' : 'hidden '}text-brand-600 dark:text-brand-300`} data-role-check="">
              <Icon name="check" className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
