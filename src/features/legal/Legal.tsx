import { Link } from 'react-router'
import { legalPaths } from './legal.routes.ts'
import type { LegalPage, LegalSection } from './legal.types.ts'
import { bandLinen, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * A legal page, ported from vavencloud-static-website (components/legal/LegalPageLayout.tsx): title, subtitle,
 * intro and effective date, then each section's paragraphs, table, list, closing paragraphs, related links and
 * contact, and the links to the other policies at the end. The copy (./data) is plain text; React escapes it.
 */

/** A link inside the site goes through the router; anything else (another site, mailto:) is a plain link */
const isInternal = (href: string) => href.startsWith('/') || href.startsWith('#')

const linkCls =
  'font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-200'

/** The other policies, at the foot of every legal page (the one on screen is marked) */
const policies = [
  { label: 'Terms of Service', href: legalPaths.termsOfService },
  { label: 'Privacy Policy', href: legalPaths.privacyPolicy },
  { label: 'Acceptable Use Policy', href: legalPaths.acceptableUsePolicy },
  { label: 'Service Level Agreement (SLA)', href: legalPaths.serviceLevelAgreement },
  { label: 'Trust & Security', href: legalPaths.trustAndSecurity },
  { label: 'Contact Us', href: legalPaths.contact },
]

const strongCls = 'font-semibold text-neutral-800 dark:text-neutral-200'

/** Title band: title, subtitle, intro, effective date */
function LegalHero({ page }: { page: LegalPage }) {
  return (
    <section
      className={cn(
        bandLinen,
        '-mt-18 border-b border-neutral-200 pt-36 pb-14 sm:pt-44 sm:pb-20 dark:border-neutral-800',
      )}
      aria-labelledby="legal-title"
    >
      <div className={cn(container, 'max-w-4xl')}>
        <h1
          id="legal-title"
          className="text-5xl leading-[0.95] font-[540] tracking-[-0.05em] text-neutral-950 sm:text-6xl dark:text-white"
        >
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="mt-5 text-lg font-medium text-neutral-700 dark:text-neutral-300">{page.subtitle}</p>
        )}
        {page.intro && <p className="mt-5 max-w-3xl text-lg leading-relaxed">{page.intro}</p>}
        {page.effectiveDate && (
          <p className="mt-4 text-sm text-neutral-500">
            <strong className="font-semibold text-neutral-700 dark:text-neutral-300">Effective date:</strong>{' '}
            {page.effectiveDate}
          </p>
        )}
      </div>
    </section>
  )
}

const Para = ({ text }: { text: string }) => <p className="mt-3 leading-relaxed">{text}</p>

function Block({ s }: { s: LegalSection }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-white">{s.heading}</h2>
      {s.body?.map((t, i) => (
        <Para key={i} text={t} />
      ))}
      {s.table && (
        <div
          className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800"
          role="region"
          tabIndex={0}
          aria-label="Table"
        >
          <table className="w-full min-w-[500px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                {s.table.headers.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {s.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="px-4 py-3">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {s.list && (
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
          {s.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {s.bodyAfter?.map((t, i) => (
        <Para key={i} text={t} />
      ))}
      {s.links && (
        <ul className="mt-3 space-y-2">
          {s.links.map((l, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-brand-600 dark:text-brand-400" aria-hidden="true">
                →
              </span>
              {isInternal(l.href) ? (
                <Link to={l.href} className={linkCls}>
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} className={linkCls} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      {s.contact && (
        <p className="mt-3 leading-relaxed">
          <strong className={strongCls}>Email:</strong>{' '}
          <a href={`mailto:${s.contact.email}`} className={linkCls}>
            {s.contact.email}
          </a>
          {s.contact.address && (
            <>
              <br />
              <strong className={strongCls}>Address:</strong> {s.contact.address}
            </>
          )}
        </p>
      )}
    </section>
  )
}

/** The page's sections, then the links to the other policies */
function LegalBody({ page, current }: { page: LegalPage; current: string }) {
  return (
    <section className="py-16 sm:py-20" aria-label={page.title}>
      <div className={cn(container, 'max-w-4xl')}>
        <div className="space-y-12">
          {page.sections.map((s, i) => (
            <Block key={i} s={s} />
          ))}
        </div>
        <nav
          className="mt-16 flex flex-wrap gap-x-6 gap-y-3 border-t border-neutral-200 pt-8 text-sm dark:border-neutral-800"
          aria-label="Policies"
        >
          {policies.map((p) => (
            <Link key={p.href} to={p.href} className={linkCls} aria-current={p.href === current ? 'page' : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}

/** A whole legal page: the title band, then the body. `current` is its own path, marked in the list of policies. */
export function LegalDocument({ page, current }: { page: LegalPage; current: string }) {
  return (
    <>
      <LegalHero page={page} />
      <LegalBody page={page} current={current} />
    </>
  )
}
