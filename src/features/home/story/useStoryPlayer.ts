import { useEffect, useRef } from 'react'
import { qs, qsa } from '@/lib/dom.ts'
import { prefersReducedMotion } from '@/lib/motion.ts'
import { site } from './story.data.ts'
import { callMinute, clockTime, crashMinute, END, minuteAt, siteAt, timeline, upMinute } from './story.timeline.ts'

/*
 * Plays the story (Story.tsx). Everything is placed on one timeline (ms from the start). Showing a moment `t`
 * sets data-on on every [data-from] element whose time has come and whose data-to hasn't, data-scene and
 * data-site on the stage, and the clock, the counters and the bars; Story.tsx's classes do the rest, so playing,
 * pausing, jumping and replaying are all just "show t".
 *
 * It plays once it's scrolled to and holds while off screen or in a background tab. The index under it jumps to
 * a scene; the button at its end pauses, plays and replays. With reduced motion nothing plays by itself: the end
 * shows, and the index shows the end of each scene.
 *
 * This runs every frame while it plays, over a few hundred elements, so it writes to them directly (they're
 * fixed markup that React never re-renders) instead of through React state.
 */
export function useStoryPlayer<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const off = new AbortController()
    const listen = { signal: off.signal }

    const timed = qsa('[data-from]', root).map((el) => ({
      el,
      from: Number(el.dataset.from),
      to: el.dataset.to === undefined ? Infinity : Number(el.dataset.to),
      on: false,
    }))
    const tabs = qsa<HTMLButtonElement>('[data-goto]', root)
    const bars = tabs.map((b) => qs('[data-scene-bar] i', b))
    const control = qs<HTMLButtonElement>('[data-control]', root)
    const controlLabel = qs('[data-control-label]', control)
    const clocks = qsa('[data-clock]', root)
    const out = {
      down: qs('[data-down]', root),
      failed: qs('[data-failed]', root),
      lost: qs('[data-lost]', root),
      fix: qs('[data-fix]', root),
      barLost: qs('[data-bar-lost]', root),
      barFix: qs('[data-bar-fix]', root),
    }
    const total = upMinute - crashMinute

    let t = 0
    const shown = { scene: -1, site: '', minute: -1 }

    const render = () => {
      const k = Math.max(
        timeline.findLastIndex((s) => t >= s.start),
        0,
      )
      if (k !== shown.scene) {
        shown.scene = k
        root.dataset.scene = timeline[k].id
        tabs.forEach((b, i) => b.setAttribute('aria-current', String(i === k)))
      }
      const state = siteAt(t)
      if (state !== shown.site) root.dataset.site = shown.site = state
      timed.forEach((x) => {
        const on = t >= x.from && t < x.to
        if (on === x.on) return
        x.on = on
        x.el.toggleAttribute('data-on', on)
      })
      bars.forEach((b, i) => {
        const s = timeline[i]
        b.style.transform = `scaleX(${Math.min(Math.max((t - s.start) / s.ms, 0), 1)})`
      })
      const m = Math.floor(minuteAt(t))
      if (m === shown.minute) return
      shown.minute = m
      clocks.forEach((c) => (c.textContent = clockTime(m, true)))
      const down = Math.max(Math.min(m, upMinute) - crashMinute, 0)
      const lost = Math.max(Math.min(m, callMinute) - crashMinute, 0)
      const fix = Math.max(Math.min(m, upMinute) - callMinute, 0)
      out.down.textContent = `${down} min`
      out.failed.textContent = String(down * site.failedPerMinute)
      out.lost.textContent = String(lost)
      out.fix.textContent = String(fix)
      out.barLost.style.width = `${(lost / total) * 100}%`
      out.barFix.style.width = `${(fix / total) * 100}%`
    }

    /** Show a moment straight away, without playing every change in between */
    const jump = (to: number) => {
      t = to
      root.classList.add('is-jumping')
      render()
      void root.offsetWidth
      root.classList.remove('is-jumping')
    }

    if (prefersReducedMotion()) {
      control.hidden = true
      jump(END)
      tabs.forEach((b, i) =>
        b.addEventListener(
          'click',
          () => jump(i === tabs.length - 1 ? END : timeline[i].start + timeline[i].ms - 1),
          listen,
        ),
      )
      return () => off.abort()
    }

    let state: 'ready' | 'playing' | 'paused' | 'ended' = 'ready'
    const holds = new Set<string>()
    let frame = 0
    let last = 0

    const sync = () => {
      const playing = state === 'playing'
      root.classList.toggle('is-paused', !playing || holds.size > 0)
      controlLabel.textContent = playing ? 'Pause' : state === 'ended' ? 'Replay' : 'Play'
      qs('[data-icon="pause"]', control).hidden = !playing
      qs('[data-icon="play"]', control).hidden = playing
    }

    const tick = (now: number) => {
      // A frame's timestamp can be a little earlier than the moment play was pressed: never run backwards
      t = Math.min(t + Math.max(now - last, 0), END)
      last = now
      render()
      if (t >= END) {
        state = 'ended'
        sync()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    /** Runs the clock while playing and nothing holds it */
    const run = () => {
      cancelAnimationFrame(frame)
      sync()
      if (state !== 'playing' || holds.size > 0) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const play = () => {
      if (state === 'ended') jump(0)
      state = 'playing'
      run()
    }
    const hold = (reason: string, on: boolean) => {
      if (on) holds.add(reason)
      else holds.delete(reason)
      run()
    }

    render()
    control.addEventListener(
      'click',
      () => {
        if (state === 'playing') {
          state = 'paused'
          run()
        } else play()
      },
      listen,
    )
    tabs.forEach((b, i) =>
      b.addEventListener(
        'click',
        () => {
          jump(timeline[i].start)
          state = 'playing'
          run()
        },
        listen,
      ),
    )
    document.addEventListener('visibilitychange', () => hold('hidden', document.hidden), listen)
    // Plays the first time it reaches the middle of the screen; holds whenever it's out of view
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return
        hold('offscreen', !e.isIntersecting)
        if (e.isIntersecting && state === 'ready') play()
      },
      { rootMargin: '-30% 0px -30% 0px' },
    )
    io.observe(root)

    return () => {
      off.abort()
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}
