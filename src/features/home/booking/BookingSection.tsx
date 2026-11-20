import { site } from '@/app/site.config.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { emergency, nextSteps } from './booking.data.ts'
import { BookingForm } from './BookingForm.tsx'
import { bandLinen, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The final call to action (#book, where every "Book a free review" button leads): the closing line, what
 * happens after the form, the two-step booking form, and the other ways to reach us (VavenCloud-Sample-Content.md).
 */

/** A way to reach us other than the form: an icon, a short line, the number or address */
const Reach = ({ icon, text, value, href }: { icon: 'phone' | 'mail'; text: string; value: string; href: string }) => (
  <a
    href={href}
    className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition-colors hover:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand-400"
  >
    <span
      className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
      aria-hidden="true"
    >
      <Icon name={icon} className="h-4 w-4" />
    </span>
    <span className="min-w-0">
      <span className="block text-xs text-neutral-500">{text}</span>
      <span className="block font-semibold text-neutral-950 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
        {value}
      </span>
    </span>
  </a>
)

/** `title`: the closing line above the form (an <em> goes on its own line) */
export function BookingSection({
  title = 'Stop running servers. <em>Start running your business.</em>',
}: {
  title?: string
}) {
  return (
    <section
      id="book"
      className={cn(bandLinen, 'border-t border-neutral-200 py-24 sm:py-32 dark:border-neutral-800')}
      aria-labelledby="book-title"
    >
      <div className={container}>
        <div className="max-w-5xl">
          <SectionHeading id="book-title" title={title} />
        </div>

        <div className="mx-auto mt-14 max-w-4xl border-t border-neutral-200 pt-10 dark:border-neutral-800">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">Start here</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
                Tell us about your product.
              </h3>
            </div>
            <p className="text-sm text-neutral-500">Free. No commitment.</p>
          </div>
          <ol className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-3" aria-label="What happens next">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <span className="font-mono text-xs text-brand-700 dark:text-brand-300" aria-hidden="true">
                  0{i + 1}
                </span>
                <p className="mt-1 font-semibold text-neutral-950 dark:text-white">{s.title}</p>
                <p className="mt-1 text-sm text-neutral-500">{s.text}</p>
              </li>
            ))}
          </ol>
          <BookingForm />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Reach icon="phone" text="Site down right now? Call 24/7" value={emergency.label} href={emergency.href} />
            <Reach
              icon="mail"
              text="Prefer email? A senior engineer replies within one business day"
              value={site.contact.email}
              href={`mailto:${site.contact.email}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
