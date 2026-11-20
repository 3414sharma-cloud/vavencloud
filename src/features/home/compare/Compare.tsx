import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { compare, compareColumns, compareMeans } from './compare.data.ts'
import { bandMist, card, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Compare: the real choice (three vendors, one hire, or us), as one table on a mist band. A gap gets a rose
 * cross, VavenCloud's column a blue tick and a tinted background. On a phone (767px or less: Tailwind's
 * max-[768px]:) each row stacks instead: the question, then the three answers, each under its column's name
 * (data-label, shown by ::before), VavenCloud's last and tinted.
 */

const mark =
  'mt-[0.15rem] inline-flex size-[1.1rem] flex-none items-center justify-center rounded-full text-[0.68rem] font-bold'
const markYes = `${mark} bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300`
const markNo = `${mark} bg-[rgb(255_228_230)] text-[rgb(190_18_60)] dark:bg-[rgb(244_63_94/0.15)] dark:text-[rgb(253_164_175)]`

const Mark = ({ yes }: { yes: boolean }) => (
  <span className={yes ? markYes : markNo} aria-hidden="true">
    <Icon name={yes ? 'check' : 'x'} className="h-3 w-3" />
  </span>
)

const cellText = 'flex items-start gap-[0.55rem]'

const Cell = ({ text, no = false }: { text: string; no?: boolean }) => (
  <span className={cellText}>
    {no && <Mark yes={false} />}
    {text}
  </span>
)

/* ---------- The table's classes ---------- */

/** On a phone every part of the table is a plain block */
const block = 'max-[768px]:block max-[768px]:w-auto max-[768px]:min-w-0'
const cell = `border-b border-b-neutral-100 px-[1.35rem] text-left align-top dark:border-b-neutral-800 ${block}`
/** The head: the three choices, VavenCloud's in brand blue */
const headCell = `${cell} py-5 font-[650]`
const head = `${headCell} bg-neutral-50 text-[0.82rem] text-neutral-600 dark:bg-[color-mix(in_srgb,var(--color-neutral-800)_45%,transparent)] dark:text-neutral-400`
const headOurs = `${headCell} bg-[linear-gradient(180deg,var(--color-brand-500),var(--color-brand-600))] text-[0.95rem] text-white`
/** A row: one card on a phone */
const row = `${block} max-[768px]:border-b max-[768px]:border-b-neutral-100 max-[768px]:px-[1.2rem] max-[768px]:pt-[1.1rem] max-[768px]:pb-[1.2rem] max-[768px]:last:border-b-0 dark:max-[768px]:border-b-neutral-800`
/** A body cell: no line under the last row; on a phone, no border and its own spacing */
const bodyCell = `${cell} py-[1.1rem] [tr:last-child>&]:border-b-0 max-[768px]:border-0`
const question = `${bodyCell} w-[22%] font-[650] text-neutral-950 max-[768px]:p-0 max-[768px]:text-[1rem] dark:text-white`
/** An answer: under its column's name on a phone */
const answerBase = [
  bodyCell,
  'w-[26%] max-[768px]:mt-[0.7rem] max-[768px]:text-[0.9rem]',
  'max-[768px]:before:mb-[0.2rem] max-[768px]:before:block max-[768px]:before:text-[0.66rem] max-[768px]:before:font-[650]',
  'max-[768px]:before:tracking-[0.08em] max-[768px]:before:uppercase max-[768px]:before:content-[attr(data-label)]',
].join(' ')
const answer = `${answerBase} text-neutral-600 max-[768px]:p-0 max-[768px]:before:text-neutral-500 dark:text-neutral-400`
const answerOurs = `${answerBase} bg-brand-50 font-semibold text-neutral-950 max-[768px]:rounded-[0.9rem] max-[768px]:px-[0.85rem] max-[768px]:py-[0.7rem] max-[768px]:before:text-brand-600 dark:bg-brand-950 dark:text-white dark:max-[768px]:before:text-brand-300`

export function Compare() {
  const [vendors, hire, vaven] = compareColumns
  return (
    <section
      id="compare"
      className={cn(bandMist, 'py-20 sm:py-26 border-t border-neutral-200 dark:border-neutral-800')}
      aria-labelledby="compare-title"
    >
      <div className={container}>
        {/* A heading across the whole width: the paragraph as wide as the table */}
        <div>
          <SectionHeading
            id="compare-title"
            title="Only one option <em>has an owner.</em>"
            description="The real choice isn’t us or another agency. It’s keeping three vendors, hiring a DevOps engineer, or handing production to one team."
            leadClassName="max-w-none"
          />
        </div>
        <div
          data-reveal=""
          className={cn(
            card,
            'mt-12 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-600',
          )}
          role="region"
          aria-labelledby="compare-title"
          tabIndex={0}
        >
          <table className={`w-full min-w-[42rem] border-collapse text-[0.95rem] ${block}`}>
            <thead className="max-[768px]:hidden">
              <tr className={block}>
                <td className={head}></td>
                <th scope="col" className={head}>
                  {vendors}
                </th>
                <th scope="col" className={head}>
                  {hire}
                </th>
                <th scope="col" className={headOurs}>
                  {vaven}
                </th>
              </tr>
            </thead>
            <tbody className={block}>
              {compare.map((r) => (
                <tr key={r.label} className={row}>
                  <th scope="row" className={question}>
                    {r.label}
                  </th>
                  <td data-label={vendors} className={answer}>
                    <Cell text={r.vendors.text} no={r.vendors.no} />
                  </td>
                  <td data-label={hire} className={answer}>
                    <Cell text={r.hire.text} no={r.hire.no} />
                  </td>
                  <td data-label={vaven} className={answerOurs}>
                    <span className={cellText}>
                      <Mark yes />
                      {r.vaven}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-[0.94rem] text-balance text-neutral-700 dark:text-neutral-300" data-reveal="">
          <b className="text-neutral-950 dark:text-white">What this means for you:</b> {compareMeans}
        </p>
        <div className="mt-4" data-reveal="">
          <Link
            to={routes.comparison}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 underline underline-offset-4 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 dark:text-brand-300 dark:hover:text-brand-200"
          >
            See the AWS and Azure price comparison <Icon name="arrow-right" className="size-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  )
}
