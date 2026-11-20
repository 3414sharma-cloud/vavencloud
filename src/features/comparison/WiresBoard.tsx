import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon.tsx'
import { prefersReducedMotion } from '@/lib/motion.ts'
import { kindLabel, layers, studioPrices, studioProviders, usd, type Who } from './comparison.model.ts'
import * as s from './board.styles.ts'
import { PlatformLogo } from './logos.tsx'

/*
 * "Follow the wires": who does each of the five tasks on each platform. Wires run from each task to whoever
 * does it: the platform, or your team. "Advice only" tasks get a dashed wire to the platform and a solid one to
 * your team. The wires are drawn from the real positions of the ports, so they follow the layout at any width,
 * with packets flowing along each one; picking a platform draws them again. Until someone picks one, the
 * platforms take turns by themselves while the board is on screen. With reduced motion: no packets, no turns.
 * Below, an estimate of what running it yourself costs, from your hours and rate.
 */

const order: Who[] = ['aws', 'azure', 'vaven']
/** How long each platform shows while they take turns, ms */
const TURN = 4800

type Kind = 'yes' | 'half' | 'you' | 'advice'
interface Wire {
  kind: Kind
  d: string
  /** A price wire, from an owner to its fee */
  cost?: boolean
  /** The dot that runs along it, unless motion is reduced (and never on an advice wire) */
  packet?: { dur: string; begin: string }
}

/** A curve from a to b, leaving and arriving level */
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = a.x + (b.x - a.x) * 0.5
  return `M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
}

/** The fields' numbers, as the estimate uses them: 0 to 10,000 */
const amount = (text: string) => Math.max(0, Math.min(10000, Number(text) || 0))

const Port = ({ className }: { className: string }) => (
  <span className={className} data-cw-port="" aria-hidden="true"></span>
)

export function WiresBoard() {
  const [who, setWho] = useState<Who>('aws')
  const [hours, setHours] = useState('20')
  const [rate, setRate] = useState('50')
  const [wires, setWires] = useState<{ viewBox?: string; list: Wire[]; id: number }>({ list: [], id: 0 })
  const [motion] = useState(() => !prefersReducedMotion())

  const stage = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const tasks = useRef<(HTMLLIElement | null)[]>([])
  const cloud = useRef<HTMLDivElement>(null)
  const team = useRef<HTMLDivElement>(null)
  const cost = useRef<HTMLDivElement>(null)
  const teamCost = useRef<HTMLDivElement>(null)
  // The platforms' turns: stopped for good once someone picks one, held while the board is off screen
  const userPicked = useRef(false)
  const visible = useRef(false)
  const turns = useRef(0)

  const plan = studioProviders.find((p) => p.who === who)!
  const handled = layers.filter((l) => l.cover[who][0] === 'yes').length
  const load = layers.length - handled
  const fee = studioPrices()
  const teamEstimate = load ? amount(hours) * amount(rate) : 0

  /** Measures where every port is now and draws the wires between them */
  const draw = useEffectEvent(() => {
    const area = stage.current
    if (!area || !cloud.current || !team.current || !cost.current || !teamCost.current) return
    const box = area.getBoundingClientRect()
    const port = (el: Element) => {
      const r = el.querySelector('[data-cw-port]')!.getBoundingClientRect()
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
    }
    /** From the right edge of a destination, level with its middle */
    const edge = (el: Element) => {
      const r = el.getBoundingClientRect()
      return { x: r.right - box.left, y: r.top + r.height / 2 - box.top }
    }
    const to = { cloud: port(cloud.current), team: port(team.current) }
    const list: Wire[] = layers.flatMap((l, r) => {
      const state = l.cover[who][0]
      const from = port(tasks.current[r]!)
      const lines: [keyof typeof to, Kind][] =
        state === 'yes'
          ? [['cloud', 'yes']]
          : state === 'half'
            ? [
                ['cloud', 'advice'],
                ['team', 'half'],
              ]
            : [['team', 'you']]
      return lines.map(([end, kind]): Wire => {
        const start = r * 0.12
        return {
          kind,
          d: curve(from, to[end]),
          packet: motion && kind !== 'advice' ? { dur: `${1.7 + r * 0.13}s`, begin: `${start}s` } : undefined,
        }
      })
    })
    const price = (kind: Kind, d: string): Wire => ({
      kind,
      d,
      cost: true,
      packet: motion ? { dur: '1.7s', begin: '0s' } : undefined,
    })
    list.push(price('yes', curve(edge(cloud.current), port(cost.current))))
    if (who !== 'vaven') list.push(price('you', curve(edge(team.current), port(teamCost.current))))
    // A new id each time: every wire is drawn afresh, so its packet starts again from the task
    setWires((w) => ({ viewBox: `0 0 ${box.width} ${box.height}`, list, id: w.id + 1 }))
  })

  // Drawn again once the board shows a new platform or estimate (after the layout has settled, before paint)
  useLayoutEffect(() => draw(), [who, hours, rate])

  const show = (next: Who | ((current: Who) => Who)) => setWho(next)
  const stopTurns = () => {
    window.clearInterval(turns.current)
    turns.current = 0
  }
  /** Someone chose: the platforms stop taking turns for good */
  const picked = () => {
    userPicked.current = true
    stopTurns()
  }

  const startTurns = useEffectEvent(() => {
    stopTurns()
    if (!motion || userPicked.current || !visible.current) return
    turns.current = window.setInterval(() => show((w) => order[(order.indexOf(w) + 1) % order.length]!), TURN)
  })

  useEffect(() => {
    const area = stage.current
    const el = board.current
    if (!area || !el) return
    const resize = new ResizeObserver(() => draw())
    resize.observe(area)
    // The platforms take turns only while the board is on screen; coming into view draws the wires afresh
    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible.current
        visible.current = entry?.isIntersecting ?? false
        if (visible.current && !was) {
          draw()
          startTurns()
        }
        if (!visible.current) stopTurns()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      resize.disconnect()
      io.disconnect()
      stopTurns()
    }
  }, [])

  return (
    <div ref={board} className={s.board} data-cw="" data-who={who}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <div>
          <span className="block font-[ui-monospace,monospace] text-[0.65rem] font-semibold tracking-[0.12em] text-(--cw-muted)">
            FOLLOW THE WIRES
          </span>
          <h4 className="mt-3 text-[length:clamp(1.75rem,3.2vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.045em]">
            Every task is wired <em className="text-brand-600 not-italic dark:text-brand-300">to someone.</em>
          </h4>
          <p className="mt-[0.6rem] text-[0.9rem] text-(--cw-muted)">Pick a platform and watch where each job goes.</p>
        </div>
        <div className={s.tabs} role="group" aria-label="Platform">
          {studioProviders.map((p) => (
            <button
              key={p.who}
              type="button"
              className={s.tab}
              data-cw-who={p.who}
              aria-pressed={p.who === who}
              onClick={() => {
                picked()
                show(p.who)
              }}
            >
              <PlatformLogo who={p.who} nameClassName={s.tabName} />
            </button>
          ))}
        </div>
      </div>
      <div className={s.diagram} tabIndex={0} role="region" aria-label="Task ownership and monthly costs">
        <div ref={stage} className={s.stage} data-cw-stage="">
          <ul className={s.tasks}>
            {layers.map((l, r) => {
              const [state, note] = l.cover[who]
              return (
                <li
                  key={l.name}
                  ref={(el) => void (tasks.current[r] = el)}
                  className={`${s.task} ${s.taskAccent[l.icon] ?? ''}`}
                  data-cw-task={r}
                  data-state={state}
                  title={kindLabel[state]}
                >
                  <span className={s.taskIcon[state]}>
                    <Icon name={l.icon} className="h-4 w-4" />
                  </span>
                  <span className={s.taskText}>
                    <strong className={s.taskName}>{l.name}</strong>
                    <small className={s.taskNote} data-cw-note="">
                      {note}
                    </small>
                  </span>
                  <Port className={s.taskPort[state]} />
                </li>
              )
            })}
          </ul>
          <svg className={s.wires} data-cw-wires="" aria-hidden="true" viewBox={wires.viewBox}>
            {wires.list.map((w, i) => (
              <g key={`${wires.id}-${i}`} data-kind={w.kind} data-cost={w.cost ? '' : undefined}>
                <path className={s.wireBase(w.kind)} d={w.d} />
                <path className={s.wireLine(w.kind)} d={w.d} pathLength={1} />
                {w.packet && (
                  <circle className={s.packet(w.kind)} r="3.5" visibility="hidden">
                    <set attributeName="visibility" to="visible" begin={w.packet.begin} />
                    <animateMotion dur={w.packet.dur} begin={w.packet.begin} repeatCount="indefinite" path={w.d} />
                  </circle>
                )}
              </g>
            ))}
          </svg>
          {/* The owners sit in the stage's own grid */}
          <div className="contents">
            <div
              ref={cloud}
              className={s.cloudCard(handled === 5, who === 'vaven')}
              data-cw-cloud=""
              data-load={handled}
            >
              <Port className={s.inPort('border-(--cw-yes)')} />
              <span className={s.providerLogo(who === 'azure')} data-cw-cloud-logo="">
                <PlatformLogo
                  who={who}
                  svgClassName={s.providerSvg}
                  markClassName={s.providerMark}
                  nameClassName={s.providerName}
                />
              </span>
              <small className={s.destNote} data-cw-cloud-count="">
                Handles {handled} of 5
              </small>
            </div>
            <div ref={team} className={s.teamCard(load > 0)} data-cw-team="" data-load={load} hidden={who === 'vaven'}>
              <Port className={s.inPort(load > 0 ? 'border-(--cw-half)' : 'border-(--cw-line)')} />
              <span className={s.teamIcon(load > 0)}>
                <Icon name="users" className="h-5 w-5" />
              </span>
              <strong className={s.destName}>Self-managed</strong>
              <small className={s.destNote} data-cw-team-count="">
                {load ? `${load} task${load > 1 ? 's' : ''} on your plate` : 'Free to build your product'}
              </small>
            </div>
          </div>
          <div ref={cost} className={s.costCard(false, who === 'vaven')} data-cw-cost="">
            <Port className={s.inPort('border-(--cw-yes)')} />
            <div className={s.price} data-cw-price="">
              <div>
                <span className={s.priceLabel}>{plan.plan}</span>
                <strong className={s.priceValue}>
                  {usd(fee[who])}
                  <small className={s.priceUnit}> / month</small>
                </strong>
              </div>
              <p className={s.priceNote}>{who === 'vaven' ? 'Management fee only' : 'Support fee only'}</p>
            </div>
          </div>
          <div ref={teamCost} className={s.costCard(true, false)} data-cw-team-cost="" hidden={who === 'vaven'}>
            <Port className={s.inPort('border-(--cw-you)')} />
            <div className={s.price} data-cw-team-price="">
              <div>
                <span className={s.priceLabel}>Estimated management cost</span>
                <strong className={s.priceValue}>
                  {usd(teamEstimate)}
                  <small className={s.priceUnit}> / month</small>
                </strong>
              </div>
              <p className={s.priceNote}>
                {load ? `${amount(hours)} hours × ${usd(amount(rate))} / hour` : 'Covered tasks handled by VavenCloud'}
              </p>
              <p className={s.priceNote}>
                Support + management: {who === 'vaven' ? 'from ' : ''}
                {usd(fee[who] + teamEstimate)} / month
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={s.assumptions} hidden={who === 'vaven'}>
        <span className={s.assumptionsTitle}>Estimate your management time</span>
        {/* onInput, not onChange: it also hears a value set by script or by the browser */}
        <label className={s.field}>
          Hours / month{' '}
          <input
            type="number"
            min="0"
            max="10000"
            step="1"
            defaultValue="20"
            className={s.input}
            data-cw-hours=""
            onInput={(e) => {
              picked()
              setHours(e.currentTarget.value)
            }}
          />
        </label>
        <label className={s.field}>
          Hourly rate (USD){' '}
          <input
            type="number"
            min="0"
            max="10000"
            step="1"
            defaultValue="50"
            className={s.input}
            data-cw-rate=""
            onInput={(e) => {
              picked()
              setRate(e.currentTarget.value)
            }}
          />
        </label>
        <p className={s.assumptionsNote}>
          Illustrative inputs, not a market quote. Adjust to your management workload and rate; this is not a 24/7
          staffing estimate.
        </p>
      </div>
      <p className="sr-only" aria-live="polite" data-cw-sr="">
        {`${plan.name}: handles ${handled} of 5 tasks, ${load} left for you to manage. ${plan.plan}: ${usd(fee[who])} per month, excluding servers.`}
      </p>
      <div className={s.legend} aria-hidden="true">
        <span>
          <i className={s.legendKey.yes}></i>Handled for you
        </span>
        <span>
          <i className={s.legendKey.half}></i>Advice only, you fix it
        </span>
        <span>
          <i className={s.legendKey.you}></i>You do it
        </span>
      </div>
      <footer className="mt-6 flex items-start gap-6 border-t border-t-(--cw-line) pt-5 max-[521px]:flex-col">
        <span className="flex flex-1 items-center gap-2 text-[0.75rem]">
          <Icon name="check" className="h-4 w-4 flex-none" />
          Monthly support and management fees
        </span>
        <p className="flex-[1.4] text-[0.7rem] leading-[1.6] text-(--cw-muted)">
          Server costs are shown separately above. AWS support is calculated from that AWS server bill; VavenCloud
          management is a starting price agreed after a free review.
        </p>
      </footer>
    </div>
  )
}
