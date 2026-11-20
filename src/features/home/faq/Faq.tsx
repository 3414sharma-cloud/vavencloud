import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { faqs, type Faq as FaqItem } from './faq.data.ts'
import { btnSecondary, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/** The FAQ: native <details>, so it opens and closes without script. A page can pass its own questions. */
export function Faq({ items = faqs }: { items?: FaqItem[] }) {
  return (
    <section id="faq" className="border-t border-neutral-200 py-20 sm:py-28 dark:border-neutral-800">
      <div className={container}>
        <div className="mx-auto max-w-6xl text-center">
          <SectionHeading
            wide
            title="Questions founders ask <em>before they hand over production.</em>"
            description="Something else on your mind? Ask it in your free review. You’ll get a straight answer from an engineer."
          />
          <Link to={routes.book} className={cn(btnSecondary, 'mt-8')}>
            Book a free review
          </Link>
        </div>

        <div className="mt-14 border-t border-neutral-200 dark:border-neutral-800">
          {items.map((f) => (
            <details key={f.q} className="group border-b border-neutral-200 dark:border-neutral-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-white">
                {f.q}
                <span className="shrink-0 text-neutral-500">
                  <span className="group-open:hidden">
                    <Icon name="plus" className="h-4 w-4" />
                  </span>
                  <span className="hidden group-open:block">
                    <Icon name="minus" className="h-4 w-4" />
                  </span>
                </span>
              </summary>
              <p className="max-w-3xl pb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
