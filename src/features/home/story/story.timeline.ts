import { scenes, type CallerId, type Scene, type SiteState } from './story.data.ts'

/*
 * The story's timeline (see useStoryPlayer.ts): every scene placed in ms from the start, and what the clock, the site
 * and each call are doing at any moment. Shared by the markup (Story.tsx, which writes each element's
 * data-from/data-to) and the player (useStoryPlayer.ts, which shows a moment t).
 */

/** How long "them" is seen typing before each message */
export const TYPING = 1000

export type Timed = Scene & { start: number }
export const timeline = scenes.reduce<Timed[]>((list, s) => {
  const prev = list.at(-1)
  return [...list, { ...s, start: prev ? prev.start + prev.ms : 0 }]
}, [])
export const lastScene = timeline[timeline.length - 1]
export const END = lastScene.start + lastScene.ms

/* ---------- The clock: minutes past 02:00 at any moment ---------- */

export const keys = timeline.flatMap((s) => s.clock.map(([ms, m]): [number, number] => [s.start + ms, m]))

/** Straight lines between the keys; two keys at one moment make the clock jump (the time between calls) */
export const minuteAt = (t: number) => {
  let minute = keys[0][1]
  for (let i = 0; i < keys.length; i++) {
    const [ms, m] = keys[i]
    if (t < ms) {
      const [pms, pm] = keys[i - 1] ?? keys[i]
      return ms === pms ? m : pm + ((t - pms) / (ms - pms)) * (m - pm)
    }
    minute = m
  }
  return minute
}

/** 74 → "03:14", or "3:14" as a phone shows it */
export const clockTime = (minutes: number, short = false) => {
  const m = Math.floor(minutes)
  const h = 2 + Math.floor(m / 60)
  return `${short ? h : String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
export const timeAt = (t: number) => clockTime(minuteAt(t))

/* ---------- The moments everything hangs on ---------- */

const siteChanges: [number, SiteState][] = [
  [0, 'ok'],
  ...timeline.flatMap((s) => (s.site ?? []).map((c): [number, SiteState] => [s.start + c.at, c.state])),
]
export const siteAt = (t: number) => siteChanges.filter(([ms]) => t >= ms).at(-1)![1]
const minuteOf = (state: SiteState) => Math.floor(minuteAt(siteChanges.find(([, s]) => s === state)![0]))

export interface Call {
  id: CallerId
  dial: number
  answered?: number
  missed?: number
  connected?: string
  verdict: number
}

export const calls: Call[] = timeline.flatMap((s) => {
  if (!s.call || s.screen === 'lock') return []
  const id = s.screen
  const ends = timeline.filter((x) => x.screen === id && x.verdict !== undefined).at(-1)!
  const abs = (ms?: number) => (ms === undefined ? undefined : s.start + ms)
  return [
    {
      id,
      dial: s.start,
      answered: abs(s.call.answered),
      missed: abs(s.call.missed),
      connected: s.call.connected,
      verdict: ends.start + ends.verdict!,
    },
  ]
})
export const callOf = (id: CallerId) => calls.find((c) => c.id === id)!

export const crashMinute = minuteOf('down')
export const upMinute = minuteOf('up')
export const callMinute = Math.floor(minuteAt(callOf('vaven').dial))

/** Each screen shows from the first scene that uses it to the end of its last */
export const screens = [...new Set(timeline.map((s) => s.screen))].map((id) => {
  const own = timeline.filter((s) => s.screen === id)
  const last = own.at(-1)!
  return { id, from: own[0].start, to: last === lastScene ? undefined : last.start + last.ms, scenes: own }
})

/** The narration: every caption on the timeline */
export const captions = timeline.flatMap((s) =>
  s.captions.map((c) => ({ at: s.start + c.at, text: c.text, tone: s.tone })),
)

/** When the "nobody owns it" note joins the list of calls */
export const loopAt = timeline.filter((s) => s.loop !== undefined).map((s) => s.start + s.loop!)[0]
