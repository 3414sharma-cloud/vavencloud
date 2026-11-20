import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { HOURS, monthly, pricesCheckedOn, sizes, type Kind } from './comparison.data.ts'
import { cheaperOf, KIND, noSize, priced, startRows, usd, usd0, type Row } from './comparison.model.ts'
import { ProviderLogo, VavenName as Vaven } from './logos.tsx'
import { WiresBoard } from './WiresBoard.tsx'
import { btnPrimary, card, container, surfaceInk } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * The comparison page's sections (pages/ComparisonPage.tsx lays them out): AWS, Azure and VavenCloud side by
 * side, one part after the other:
 *  1. The servers: five fixed sizes, each compared on its own (no total: nobody buys one of every size); each
 *     cloud's monthly price for one server and what you save with VavenCloud.
 *  2. Someone to run them (#managed): the "follow the wires" board (WiresBoard.tsx), each cloud's support plan
 *     beside VavenCloud's Managed plan. The numbers are in comparison.data.ts, the sums in comparison.model.ts.
 */

export function ComparisonHero() {
  return (
    <section
      id="top"
      className="dark v5-hero-dark mt-[calc(-18*var(--spacing)-1px)] bg-[image:radial-gradient(80%_80%_at_50%_0%,color-mix(in_srgb,var(--color-brand-800)_30%,transparent),transparent_68%),linear-gradient(180deg,var(--color-neutral-950),color-mix(in_oklab,var(--color-neutral-950)_84%,var(--color-brand-950)))] border-b border-b-neutral-800 bg-neutral-950 pt-36 pb-16 scheme-dark min-[900px]:pt-44 min-[900px]:pb-20"
      aria-labelledby="comparison-title"
    >
      <div className={container}>
        <p className="text-[0.78rem] font-[650] tracking-[0.14em] text-brand-300 uppercase">Price comparison</p>
        <h1
          id="comparison-title"
          className="mt-5 max-w-[62rem] text-[length:clamp(2.4rem,6.4vw,5rem)] leading-none font-[540] tracking-[-0.05em] text-balance text-white"
        >
          AWS, Azure or VavenCloud:{' '}
          <em className="block font-['Instrument_Serif',Georgia,serif] text-[1.12em] font-normal tracking-[-0.02em] italic text-brand-400">
            what you’d actually pay.
          </em>
        </h1>
        <p className="mt-6 max-w-[44rem] text-[length:clamp(1.05rem,1.6vw,1.3rem)] leading-[1.6] text-neutral-400">
          See what the same servers cost each month on AWS, Azure and VavenCloud, side by side. Then see what it costs
          to have someone on call to run them.
        </p>
      </div>
    </section>
  )
}

/* ---------- Part 1: cloud servers ---------- */

/*
 * The servers table. On a phone (859px wide or less: Tailwind's max-[860px]:) each row is a card: the server's
 * size first, then each cloud's price beside its name (the cell's data-label, shown by ::before).
 */
const table = 'w-full border-collapse text-left tabular-nums max-[860px]:block'
/** Out of sight on a phone, still read by screen readers */
const thead = 'max-[860px]:absolute max-[860px]:size-px max-[860px]:overflow-hidden max-[860px]:[clip-path:inset(50%)]'
const headRow = 'max-[860px]:block max-[860px]:pt-2 max-[860px]:pb-3'
const headCell = 'px-[1.1rem] py-[1.1rem] align-top max-[860px]:block'
const bodyRow = [
  'transition-[background-color] duration-200 motion-reduce:[transition:none]',
  '[&:hover>*]:bg-[color-mix(in_srgb,var(--color-brand-500)_4%,transparent)]',
  'max-[860px]:block max-[860px]:border-t max-[860px]:border-t-neutral-200 max-[860px]:pt-2 max-[860px]:pb-3',
  'max-[860px]:first:border-t-0 dark:max-[860px]:border-t-neutral-800',
].join(' ')
const bodyCell =
  'border-t border-t-neutral-200 px-[1.1rem] py-4 align-top dark:border-t-neutral-800 max-[860px]:border-t-0 max-[860px]:py-[0.45rem]'
const sizeCell = `${bodyCell} min-w-60 text-[0.93rem] font-[650] text-neutral-800 dark:text-neutral-200 max-[860px]:block max-[860px]:min-w-0`
const priceCell = [
  bodyCell,
  'text-[0.9rem] leading-[1.5] text-neutral-600 dark:text-neutral-400',
  'max-[860px]:grid max-[860px]:grid-cols-[6.2rem_minmax(0,1fr)] max-[860px]:[align-items:start] max-[860px]:gap-x-3 max-[860px]:gap-y-0 max-[860px]:[&>*]:col-start-2',
  'max-[860px]:before:row-[1/span_4] max-[860px]:before:pt-[0.15rem] max-[860px]:before:text-[0.74rem] max-[860px]:before:font-[650]',
  'max-[860px]:before:tracking-[0.08em] max-[860px]:before:text-neutral-500 max-[860px]:before:uppercase max-[860px]:before:content-[attr(data-label)]',
].join(' ')
/** VavenCloud's column: a soft brand tint down the whole table */
const ours = 'bg-[color-mix(in_srgb,var(--color-brand-500)_7%,transparent)]'

/** A price in the table, and the line under it */
const priceCls = 'block text-[1.15rem] font-[650] tracking-[-0.02em]'
const plainPrice = `${priceCls} text-neutral-950 dark:text-white`
const subCls = 'mt-[0.15rem] block text-[0.78rem] leading-[1.4] text-neutral-500'

/** What you save by choosing VavenCloud over the one it's measured against (Azure), as a cell */
function Saving({ cheaper, vaven, cheaperName }: { cheaper: number; vaven: number; cheaperName: string }) {
  const diff = cheaper - vaven
  if (Math.abs(diff) < 0.005)
    return (
      <>
        <span className={plainPrice}>Same</span>
        <span className={subCls}>as {cheaperName}</span>
      </>
    )
  return diff > 0 ? (
    <>
      <span className={`${priceCls} whitespace-nowrap text-[rgb(4_120_87)] dark:text-[rgb(110_231_183)]`}>
        Save {usd(diff)}
      </span>
      <span className={subCls}>
        {Math.round((diff / cheaper) * 100)}% less than {cheaperName}
      </span>
    </>
  ) : (
    <>
      <span className={`${priceCls} whitespace-nowrap text-neutral-600 dark:text-white`}>+{usd(-diff)}</span>
      <span className={subCls}>
        {Math.round((-diff / cheaper) * 100)}% more than {cheaperName}
      </span>
    </>
  )
}

const Price = ({ total, sub }: { total: number; sub: string }) => (
  <>
    <span className={plainPrice}>{usd(total)}</span>
    <span className={subCls}>{sub}</span>
  </>
)

function ServerRow({ row, i, kind }: { row: Row; i: number; kind: Kind }) {
  const p = priced(row, kind)
  const per = (n: number, unit: number) => (n > 1 ? `${n} × ${usd(unit)} · ` : '')
  const cheap = cheaperOf(p.aws, p.azure)
  return (
    <tr className={bodyRow} data-row={i}>
      <th scope="row" className={sizeCell}>
        <span className="inline-flex items-baseline gap-[0.6rem] text-[0.95rem] font-semibold whitespace-nowrap text-neutral-900 dark:text-white">
          {sizes[row.size].vcpu} vCPU · {sizes[row.size].ram} GB
        </span>
      </th>
      <td className={priceCell} data-label="AWS" data-cell="aws">
        <Price
          total={p.aws}
          sub={`${per(row.qty, monthly(p.a))}${p.a.name} · ${p.a.vcpu} vCPU · ${p.a.ram} GB${noSize(p.a, p.size.vcpu, 'AWS')}`}
        />
      </td>
      <td className={priceCell} data-label="Azure" data-cell="azure">
        <Price
          total={p.azure}
          sub={`${per(row.qty, monthly(p.z))}${p.z.name} · ${p.z.vcpu} vCPU · ${p.z.ram} GB${noSize(p.z, p.size.vcpu, 'Azure')}`}
        />
      </td>
      <td className={`${priceCell} ${ours}`} data-label="VavenCloud" data-cell="vaven">
        <Price
          total={p.vaven}
          sub={`${per(row.qty, p.size.monthly)}${p.size.name} · ${p.size.vcpu} vCPU · ${p.size.ram} GB · ${p.size.disk}`}
        />
      </td>
      <td className={priceCell} data-label="You save" data-cell="save">
        <Saving cheaper={cheap.value} vaven={p.vaven} cheaperName={cheap.name} />
      </td>
    </tr>
  )
}

/** A column's name: a cloud's logo (beside its name, for screen readers), ours, or "You save" */
const headCls =
  'px-[1.1rem] py-[1.1rem] align-top max-[860px]:block text-[1rem] font-[650] text-neutral-950 dark:text-white [&_svg]:mr-[0.45rem] [&_svg]:inline-block [&_svg]:align-[-0.2em]'

/** The small print under the summary and the table */
const noteCls = 'mt-[0.9rem] text-[0.86rem] leading-[1.5] text-neutral-500'

/*
 * Nobody buys one of every size, so the table has no "total" row: each row is one server, compared on its own,
 * and the summary above it speaks per server too.
 */
function ServersTable({ rows, kind }: { rows: Row[]; kind: Kind }) {
  return (
    <>
      <div data-reveal="" className={cn(card, 'mt-7 p-0')}>
        <table className={table}>
          <thead className={thead}>
            <tr className={headRow}>
              <th
                scope="col"
                className={`${headCell} text-[0.78rem] font-[650] tracking-[0.1em] text-neutral-500 uppercase`}
              >
                Your servers
              </th>
              <th scope="col" className={headCls}>
                <ProviderLogo name="AWS" />
              </th>
              <th scope="col" className={headCls}>
                <ProviderLogo name="Azure" />
              </th>
              <th scope="col" className={`${headCls} ${ours}`}>
                <Vaven />
              </th>
              <th scope="col" className={headCls}>
                You save
              </th>
            </tr>
          </thead>
          <tbody className="max-[860px]:block" data-rows="">
            {rows.map((r, i) => (
              <ServerRow key={i} row={r} i={i} kind={kind} />
            ))}
          </tbody>
        </table>
      </div>
      <p className={noteCls}>VavenCloud includes SSD storage in every plan. AWS and Azure charge separately for it.</p>
    </>
  )
}

const Stat = ({ label, value, unit, us = false }: { label: string; value: string; unit: string; us?: boolean }) => (
  <div>
    <p
      className={`text-[0.78rem] font-[650] tracking-[0.1em] uppercase ${us ? 'text-brand-700 dark:text-brand-300' : 'text-neutral-500'}`}
    >
      {label}
    </p>
    <p className="mt-[0.2rem] text-[length:clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-[650] tracking-[-0.04em] text-neutral-950 tabular-nums dark:text-white">
      {value}
      <span className="text-[0.85rem] font-medium tracking-normal text-neutral-500"> {unit}</span>
    </p>
  </div>
)

/**
 * The big numbers above the table, per server (never a sum of all the sizes): the saving on the smallest and
 * the largest size against Azure, and the biggest percentage saved on any size.
 */
function Summary({ rows, kind }: { rows: Row[]; kind: Kind }) {
  const each = rows.map((r) => {
    const p = priced({ ...r, qty: 1 }, kind)
    const cheap = cheaperOf(p.aws, p.azure)
    return {
      size: p.size,
      name: cheap.name,
      diff: cheap.value - p.vaven,
      pct: ((cheap.value - p.vaven) / cheap.value) * 100,
    }
  })
  const first = each[0]
  const last = each[each.length - 1]
  const all = each.every((e) => e.diff > 0.005)
  const lo = Math.min(...each.map((e) => e.diff))
  const hi = Math.max(...each.map((e) => e.diff))
  const best = Math.round(Math.max(...each.map((e) => e.pct)))
  const sizeName = (e: (typeof each)[number]) => `${e.size.vcpu} vCPU · ${e.size.ram} GB server`
  return (
    <div className="mt-7" data-summary="">
      <p className="text-[length:clamp(1.1rem,2vw,1.4rem)] leading-[1.4] tracking-[-0.015em] text-neutral-800 dark:text-neutral-200">
        {all ? (
          <>
            Every size costs less on VavenCloud:{' '}
            <b className="font-bold text-brand-700 dark:text-brand-300">
              {usd0(lo)} to {usd0(hi)} less a month per server
            </b>{' '}
            than on {first.name}.
          </>
        ) : (
          'Compare one server at a time: find the size you need and see what it costs on each cloud.'
        )}
      </p>
      <div className="mt-5 grid gap-4 min-[720px]:grid-cols-3 min-[720px]:gap-6">
        <Stat
          label={sizeName(first)}
          value={first.diff > 0 ? `Save ${usd0(first.diff)}` : usd0(first.diff)}
          unit="a month"
        />
        <Stat
          label={sizeName(last)}
          value={last.diff > 0 ? `Save ${usd0(last.diff)}` : usd0(last.diff)}
          unit="a month"
        />
        <Stat label="Any one server" value={`Up to ${best}%`} unit={`less than ${first.name}`} us />
      </div>
    </div>
  )
}

const ServersPanel = () => (
  <>
    <p className={noteCls}>
      Prices are per month, on demand. Compared with each cloud’s compute-optimised and general-purpose servers: full
      performance all the time, what a production server usually needs.
    </p>
    <div data-summary-slot="">
      <Summary rows={startRows()} kind={KIND} />
    </div>
    <div data-table-slot="">
      <ServersTable rows={startRows()} kind={KIND} />
    </div>
  </>
)

/* ---------- The page ---------- */

/** The heading of each part: a number, a title and a line under it */
const PartHead = ({ n, id, title, lead }: { n: number; id: string; title: string; lead: string }) => (
  <div className="mb-6 flex items-start gap-4 max-[640px]:gap-3">
    <span
      className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-brand-600 text-[1rem] font-bold text-white max-[640px]:size-8 max-[640px]:text-[0.9rem]"
      aria-hidden="true"
    >
      {n}
    </span>
    <div>
      <h3
        id={id}
        className="text-[length:clamp(1.5rem,2.4vw,2rem)] leading-[1.15] font-[650] tracking-[-0.03em] text-neutral-950 dark:text-white"
      >
        {title}
      </h3>
      <p className="mt-[0.4rem] max-w-[44rem] text-[1rem] leading-[1.55] text-neutral-600 dark:text-neutral-400">
        {lead}
      </p>
    </div>
  </div>
)

const noteBold = 'text-neutral-900 dark:text-neutral-200'
const noteLink = 'text-brand-700 underline underline-offset-3 dark:text-brand-300'

const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>

export function ComparisonTool() {
  return (
    <section id="compare" className="py-20 sm:py-26" aria-labelledby="compare-title">
      <div className={container}>
        <div className="max-w-4xl">
          <SectionHeading
            id="compare-title"
            title="Compare the cost. <em>See who does the work.</em>"
            description="First the servers, then the people who run them, on AWS, Azure and VavenCloud."
          />
        </div>
        <section className="mt-12 scroll-mt-24" aria-labelledby="cp-servers-title">
          <PartHead
            n={1}
            id="cp-servers-title"
            title="The servers"
            lead="Five common sizes. What one server of each size costs a month on each cloud."
          />
          <ServersPanel />
        </section>
        <section
          id="managed"
          className="mt-[4.5rem] scroll-mt-24 border-t border-t-neutral-200 pt-14 dark:border-t-neutral-800"
          aria-labelledby="cp-managed-title"
        >
          <PartHead
            n={2}
            id="cp-managed-title"
            title="See who takes care of it"
            lead="An interactive look at the work covered by your monthly support or management fee."
          />
          <WiresBoard />
        </section>
        <div className="mt-14 max-w-[52rem] border-t border-t-neutral-200 pt-8 dark:border-t-neutral-800">
          <h2 className="text-[1.05rem] font-[650] text-neutral-950 dark:text-white">How we compared</h2>
          <ul className="mt-4 grid gap-3 text-[0.9rem] leading-[1.6] text-neutral-600 dark:text-neutral-400">
            <li>
              <b className={noteBold}>Servers.</b> AWS prices are taken from the AWS console for EC2 in US East (Ohio).
              Azure prices are from Microsoft’s public pricing page for virtual machines in Central US. Both are Linux,
              on demand, {HOURS} hours a month. For each size we price the cheapest machine with at least that many
              vCPUs and that much RAM. AWS and Azure prices are for the server only: disk, bandwidth and backups cost
              extra there. VavenCloud’s price includes the SSD shown.
            </li>
            <li>
              <b className={noteBold}>List prices.</b> These are AWS’s and Azure’s list prices. What you actually pay
              can vary by account, for example with discounts, reservations or credits.
            </li>
            <li>
              <b className={noteBold}>Managed service.</b> AWS Business Support+ and Azure Standard, at their published
              prices. AWS charges the greater of $29 or a share of your AWS bill; for any one of the servers above,
              that’s the $29 minimum. Their support plans give you help from the cloud’s engineers; they don’t run your
              product for you.
            </li>
            <li>
              <b className={noteBold}>VavenCloud.</b> Server prices are our current monthly plans, with the SSD storage
              shown included. Managed plans are a fixed monthly fee agreed after a free review; the figures shown are
              starting points.
            </li>
            <li>
              <b className={noteBold}>Checked {pricesCheckedOn}.</b> Cloud prices change, so check the calculators
              before you decide:{' '}
              <a href="https://calculator.aws/" target="_blank" rel="noopener" className={noteLink}>
                AWS
                <NewTab />
              </a>{' '}
              ·{' '}
              <a
                href="https://azure.microsoft.com/en-us/pricing/calculator/"
                target="_blank"
                rel="noopener"
                className={noteLink}
              >
                Azure
                <NewTab />
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export function ComparisonCta() {
  return (
    <section id="talk" className="py-20 sm:py-26" aria-labelledby="talk-title">
      <div className={container}>
        <div
          className={cn(
            surfaceInk,
            'grid gap-6 rounded-[1.75rem] px-7 py-9 min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-center min-[900px]:gap-12 min-[900px]:px-[3.25rem] min-[900px]:py-12',
          )}
        >
          <div>
            <h2
              id="talk-title"
              className="text-[length:clamp(1.7rem,3.2vw,2.4rem)] leading-[1.1] font-[650] tracking-[-0.035em] text-white"
            >
              Want the real number for your product?
            </h2>
            <p className="mt-[0.9rem] max-w-xl leading-[1.6]">
              A free 30-minute production review with a senior engineer, not a salesperson. You keep the written roadmap
              either way.
            </p>
          </div>
          <Link to={routes.book} className={cn(btnPrimary, '[justify-self:start] !px-7 !py-3.5 !text-base')}>
            Book a free production review <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
