import type { IconName } from '@/shared/ui/icons.ts'

/*
 * v3's story (story.v3.ts plays it): one night, scene by scene. The site goes down, you call the hosting
 * provider, the DevOps freelancer and your developers, and each one has a reason it isn't theirs to fix. Then
 * one call to VavenCloud. An example, not a real client. Everything else on v3 comes from v2's data.
 *
 * Times inside a scene (`at`, `ms`) are milliseconds from the scene's start. The story's clock is minutes past
 * 02:00 (14 → 02:14); a message with `time` shows the clock at that moment, and `{time}` in a note does too.
 */

export type CallerId = 'host' | 'devops' | 'devs' | 'vaven'
export type SiteState = 'ok' | 'down' | 'fixing' | 'up'

export interface Caller {
  name: string
  role: string
  /** VavenCloud shows its logo instead */
  icon?: IconName
  /** What they said, in short, on the list of calls */
  excuse: string
  /** Stamped on the call when it's over */
  verdict: string
}

export const callers: Record<CallerId, Caller> = {
  host: { name: 'Hosting provider', role: 'Keeps the server on', icon: 'server', excuse: '“The server’s up. Must be your application.”', verdict: 'Not our layer' },
  devops: { name: 'DevOps freelancer', role: 'Set up the servers last year', icon: 'infinity', excuse: '“The pipeline deployed fine. Ask your developers.”', verdict: 'Not my scope' },
  devs: { name: 'Your developers', role: 'Wrote the code', icon: 'code', excuse: '“We haven’t changed anything. Must be the server.”', verdict: 'Not our code' },
  vaven: { name: 'VavenCloud', role: 'Servers, deployments and code', excuse: '“I can see it. I’m on it.”', verdict: 'Fixed in 27 min' },
}

/** On the list of calls, once all three have passed the problem on */
export const loopNote = 'Three answers, all true on their own. Nobody owns the whole. You’re back where you started.'

/** What's said on the phone: by you, by them, or the phone's own small print */
export type Line = { at: number; you: string } | { at: number; them: string; time?: boolean } | { at: number; note: string }

export interface Scene {
  id: string
  /** Its name in the index under the story */
  tab: string
  ms: number
  /** Colours the narration: trouble, help on the way, fixed */
  tone: 'bad' | 'accent' | 'good'
  /** What the phone shows: the lock screen, or the call with one of the callers (a call can run over two scenes) */
  screen: 'lock' | CallerId
  /** The clock: [ms into the scene, minutes past 02:00], in straight lines between */
  clock: [number, number][]
  /** The narration, each line shown until the next */
  captions: { at: number; text: string }[]
  /** When the site changes state (it starts "ok") */
  site?: { at: number; state: SiteState }[]
  /** Notifications on the lock screen */
  alerts?: { at: number; icon: IconName; tone: 'bad' | 'warn' | 'brand'; app: string; title: string; text: string }[]
  /** Starts a call: when they pick up, or when it rings out */
  call?: { answered?: number; missed?: number; connected?: string }
  lines?: Line[]
  /** When the call is over and its verdict is stamped */
  verdict?: number
  /** When the list of calls shows the loop */
  loop?: number
}

/** The site in the example */
export const site = {
  url: 'yourapp.com/checkout',
  states: {
    ok: { chip: 'Online', code: '200', text: 'All good. Orders are coming in.' },
    down: { chip: 'Down', code: '502', text: 'Bad gateway. Customers can’t pay.' },
    fixing: { chip: 'Engineer on it', code: '502', text: 'Still down, but an engineer is fixing it.' },
    up: { chip: 'Back online', code: '200', text: 'Fast again. Customers can pay.' },
  } satisfies Record<SiteState, { chip: string; code: string; text: string }>,
  /** For the example: checkouts that fail each minute it's down */
  failedPerMinute: 3,
}

export const scenes: Scene[] = [
  {
    id: 'crash',
    tab: 'It breaks',
    ms: 5600,
    tone: 'bad',
    screen: 'lock',
    clock: [
      [0, 14],
      [5600, 15],
    ],
    captions: [{ at: 0, text: 'Your site goes down. Customers can’t pay.' }],
    site: [{ at: 700, state: 'down' }],
    alerts: [
      { at: 1300, icon: 'activity', tone: 'bad', app: 'Uptime monitor', title: 'yourapp.com is down', text: '502 Bad Gateway on /checkout' },
      { at: 2500, icon: 'wallet', tone: 'warn', app: 'Payments', title: 'No successful payments', text: 'None in the last 10 minutes' },
      { at: 3700, icon: 'mail', tone: 'brand', app: 'Mail', title: 'A customer', text: '“I can’t pay. Is your site down?”' },
    ],
  },
  {
    id: 'host',
    tab: 'Hosting provider',
    ms: 8600,
    tone: 'bad',
    screen: 'host',
    clock: [
      [0, 16],
      [8600, 29],
    ],
    captions: [{ at: 0, text: 'You call your hosting provider.' }],
    call: { answered: 1300 },
    lines: [
      { at: 1600, you: 'Our site is down. Checkout shows a 502 error.' },
      { at: 3400, them: 'Your server is up and running on our side.' },
      { at: 5200, them: 'It must be your application. Please open a ticket. We reply within 24 to 48 hours.' },
    ],
    verdict: 6700,
  },
  {
    id: 'devops',
    tab: 'DevOps freelancer',
    ms: 7800,
    tone: 'bad',
    screen: 'devops',
    clock: [
      [0, 31],
      [7800, 38],
    ],
    captions: [{ at: 0, text: 'You try the DevOps freelancer who set up your servers.' }],
    call: { missed: 2200 },
    lines: [
      { at: 2200, note: 'No answer' },
      { at: 2800, you: 'Site’s down. Can you take a look? It’s urgent.' },
      { at: 3600, note: 'Seen {time}' },
      { at: 5300, them: 'I’m away until Monday. The pipeline deployed fine, so it’s not the servers. Ask your developers.' },
    ],
    verdict: 6500,
  },
  {
    id: 'devs',
    tab: 'Developers',
    ms: 10500,
    tone: 'bad',
    screen: 'devs',
    clock: [
      [0, 40],
      [10500, 52],
    ],
    captions: [
      { at: 0, text: 'You wake up your developers.' },
      { at: 7300, text: 'Three calls, and everyone says it’s someone else’s problem.' },
    ],
    call: { answered: 1200 },
    lines: [
      { at: 1500, you: 'Checkout is down. Did anything change today?' },
      { at: 3200, them: 'It works on my machine.' },
      { at: 5000, them: 'We haven’t changed anything since Tuesday. Must be the server. Ask your host.' },
    ],
    verdict: 6300,
    loop: 7300,
  },
  {
    id: 'vaven',
    tab: 'VavenCloud',
    ms: 9600,
    tone: 'accent',
    screen: 'vaven',
    clock: [
      [0, 53],
      [4600, 65],
      [7400, 72],
    ],
    captions: [
      { at: 0, text: 'You make one call. To VavenCloud.' },
      { at: 3000, text: 'One engineer looks at the servers, the deployments and the code.' },
    ],
    call: { answered: 600, connected: 'Answered on the first ring' },
    site: [{ at: 2600, state: 'fixing' }],
    lines: [
      { at: 900, you: 'Checkout is down.' },
      { at: 2200, them: 'I can see it on our monitoring. I’m on it.' },
      { at: 4600, them: 'Found it: a missing database index on the orders table. Every checkout was timing out.', time: true },
      { at: 7400, them: 'Index added and tested. Rolling it out now.', time: true },
    ],
  },
  {
    id: 'fixed',
    tab: 'Fixed',
    ms: 7000,
    tone: 'good',
    screen: 'vaven',
    clock: [
      [0, 72],
      [1800, 80],
    ],
    captions: [{ at: 1800, text: 'Fixed in 27 minutes. You go back to sleep.' }],
    site: [{ at: 1800, state: 'up' }],
    lines: [{ at: 1800, them: 'Fixed and verified. Checkout is fast again. Your written report will be in your inbox by 09:00.', time: true }],
    verdict: 3000,
  },
]
