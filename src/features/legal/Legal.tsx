import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { legalPaths } from './legal.routes.ts'
import type { LegalBlock, LegalPage, LegalSection } from './legal.types.ts'
import { legalValues } from './legal.values.ts'
import { bandLinen, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * A legal page ("VavenCloud Legal Pages v1"): the title band (title, last updated, intro), then each section's
 * paragraphs, lists and tables in order, and the links to the other policies at the end. The copy (./data) is
 * plain text with a little inline markup (see legal.types.ts); React escapes it.
 */

const linkCls =
  'font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-200'
const strongCls = 'font-semibold text-neutral-900 dark:text-neutral-100'
/** A value still to be decided: loud on purpose, so no placeholder reaches the live site unnoticed */
const placeholderCls =
  'rounded-sm bg-amber-200 px-1 font-semibold text-amber-950 ring-1 ring-amber-400 dark:bg-amber-400/25 dark:text-amber-100 dark:ring-amber-400/50'

/** The other policies, at the foot of every legal page (the one on screen is marked) */
const policies = [
  { label: 'Terms of Service', href: legalPaths.termsOfService },
  { label: 'Privacy Policy', href: legalPaths.privacyPolicy },
  { label: 'Acceptable Use Policy', href: legalPaths.acceptableUsePolicy },
  { label: 'Service Level Agreement', href: legalPaths.serviceLevelAgreement },
  { label: 'Trust & Security', href: legalPaths.trustAndSecurity },
  { label: 'Contact Us', href: legalPaths.contact },
]

/** **bold**, [PLACEHOLDER] or an @vavencloud.com / @vavensoft.com address */
const inlineToken = /(\*\*.+?\*\*|\[[A-Z0-9][A-Z0-9 -]*\]|[a-z.]+@vaven(?:cloud|soft)\.com)/g

/**
 * A placeholder: its value from legal.values.ts (with its email addresses linked), or the [NAME] highlighted
 * while it's still empty
 */
function Placeholder({ name }: { name: string }) {
  const value = legalValues[name]
  if (value) return <Inline text={value.trim()} />
  return (
    <mark className={placeholderCls} title="Placeholder: fill it in src/features/legal/legal.values.ts">
      [{name}]
    </mark>
  )
}

/** A string of copy with its inline markup turned into elements */
function Inline({ text }: { text: string }): ReactNode {
  return text.split(inlineToken).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>
    if (part.startsWith('**'))
      return (
        <strong key={i} className={strongCls}>
          <Inline text={part.slice(2, -2)} />
        </strong>
      )
    if (part.startsWith('[')) return <Placeholder key={i} name={part.slice(1, -1)} />
    return (
      <a key={i} href={`mailto:${part}`} className={linkCls}>
        {part}
      </a>
    )
  })
}

/** Title band: title, last updated, intro */
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
        <p className="mt-5 text-sm text-neutral-500">
          <strong className="font-semibold text-neutral-700 dark:text-neutral-300">Last updated:</strong>{' '}
          <Inline text={page.lastUpdated} />
        </p>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed">
          <Inline text={page.intro} />
        </p>
      </div>
    </section>
  )
}

function Table({ headers, rows }: { headers: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    <div
      className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800"
      role="region"
      tabIndex={0}
      aria-label="Table"
    >
      <table className="w-full min-w-[500px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-3 align-bottom font-semibold text-neutral-950 dark:text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 align-top leading-relaxed">
                  <Inline text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Block({ b }: { b: LegalBlock }) {
  if (typeof b === 'string')
    return (
      <p className="mt-3 leading-relaxed">
        <Inline text={b} />
      </p>
    )
  if ('table' in b) return <Table {...b.table} />
  const List = b.ordered ? 'ol' : 'ul'
  return (
    <List
      className={cn(
        'mt-3 space-y-2 pl-5 leading-relaxed',
        b.ordered ? 'list-decimal marker:font-semibold' : 'list-disc',
        'marker:text-neutral-400 dark:marker:text-neutral-500',
      )}
    >
      {b.list.map((item, i) => (
        <li key={i} className="pl-1">
          <Inline text={item} />
        </li>
      ))}
    </List>
  )
}

function Section({ s }: { s: LegalSection }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl dark:text-white">{s.heading}</h2>
      {s.blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
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
            <Section key={i} s={s} />
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
