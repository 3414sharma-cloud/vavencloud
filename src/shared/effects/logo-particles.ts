/**
 * Logo particles: a few thousand dots on a 2D canvas that form one image after another (on the team page:
 * the "VAVENCLOUD" wordmark, then the "V" mark), in the images' own colours, and answer the pointer.
 *
 * How it works:
 *  1. Each image is drawn on a hidden canvas, fitted to the stage, and its opaque pixels are sampled on a grid
 *     (left to right). Every particle takes one sample from each image: its home in that form and the
 *     image's colour there.
 *  2. Every frame each particle's target is a blend of its homes, the blend weights easing from one form to
 *     the next; halfway through a morph the dots swing out a little, so they visibly fly across. Depth is
 *     faked with a perspective divide (800 / (800 - z)) that the pointer tilts.
 *  3. A damped spring pulls each particle toward its target, so they lag, overshoot a little and settle.
 *  4. Pointer: moving pushes nearby dots aside and heats them pink; holding gathers them into an orbit around
 *     the pointer; letting go throws them out in a burst with a ring.
 *  5. Optionally (scrollOut), as the stage scrolls away the dots pour down and spread out of it and fade.
 *
 * Pure canvas 2D (fillRect per particle), no libraries. Pauses off screen and in background tabs; with reduced
 * motion it draws the first form once and stays still.
 *
 * Usage:
 *   const logo = mountLogoParticles(stageElement, { sources: ['/logo-text.png', '/logo-mark.png'] })
 *   logo?.destroy()
 */

export interface LogoParticlesOptions {
  /** The images the dots form, in order (same origin, so their pixels can be read) */
  sources: string[]
  /** Seconds each form stays before morphing to the next (one per source; default 7 each) */
  holds?: number[]
  /** Called with the form now showing (its index in `sources`) */
  onForm?: (form: number) => void
  /** Called once the images are sampled and drawing */
  onReady?: () => void
  /**
   * Whether the stage is on a dark background, checked every frame so a theme switch shows at once.
   * Default: the stage is inside a `.dark` element.
   */
  isDark?: () => boolean
  /** An element whose scaleX fills (0 to 1) as the current form's time runs out */
  progress?: HTMLElement
  /** Draw faint orbit ellipses and drifting dust behind the particles */
  backdrop?: boolean
  /**
   * Blend the images' colours toward a colour (any CSS colour, or a custom property name like
   * '--color-brand-400', read from the stage) by `amount` (0 to 1).
   */
  tint?: { colour: string; amount: number }
  /** The colour of the glow, trail and heated dots (CSS colour or custom property name). Default: logo pink */
  accent?: string
  /**
   * As the stage scrolls up out of view, the dots pour down and spread out of it and fade. The progress
   * (0 to 1) is also set on the stage as `--out`, for CSS to fade anything else with it.
   */
  scrollOut?: boolean
}

export interface LogoParticlesInstance {
  destroy: () => void
}

/** One sampled point of an image: position from the stage centre, and its colour on dark / light */
interface Sample {
  x: number
  y: number
  onDark: string
  onLight: string
}

interface Particle {
  /** this particle's sample in each form */
  homes: Sample[]
  z: number
  /** position along the sampling order, -0.5 to 0.5 (drives the sweeping highlight) */
  u: number
  x: number
  y: number
  vx: number
  vy: number
  seed: number
  phase: number
  heat: number
  size: number
}

const TAU = Math.PI * 2
const MORPH = 2.4 // seconds a morph takes
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x))
const smooth = (x: number) => x * x * (3 - 2 * x)
/** Deterministic 0..1 hash, so the layout is the same on every load */
const rand = (i: number) => {
  const t = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return t - Math.floor(t)
}

type RGB = [number, number, number]
const LOGO_PINK: RGB = [255, 31, 174]
const rgb = ([r, g, b]: RGB) => `rgb(${r | 0},${g | 0},${b | 0})`
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** Any CSS colour, or a custom property name read from `el`, as RGB (the canvas normalises it to #rrggbb) */
function resolveColour(value: string, el: Element, fallback: RGB): RGB {
  const css = value.startsWith('--') ? getComputedStyle(el).getPropertyValue(value).trim() : value
  const g = document.createElement('canvas').getContext('2d')
  if (!css || !g) return fallback
  g.fillStyle = '#000'
  g.fillStyle = css
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(g.fillStyle))
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fallback
}

/** Heat ramp to the accent: from white on dark backgrounds, from charcoal on light ones */
const heatRamp = (from: RGB, to: RGB) => Array.from({ length: 16 }, (_, i) => rgb(mix(from, to, i / 15)))

/** A logo pixel's colour, made to read on a near-black background */
function onDark(r: number, g: number, b: number): RGB {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max - min < 14 && max < 140) return [236, 238, 244] // the charcoal "VAVEN" -> near white
  if (max < 150) {
    // lift the deep navy of the "V" so it doesn't vanish
    const s = 150 / Math.max(max, 1)
    r *= s
    g *= s
    b *= s
  }
  return mix([r, g, b], [255, 255, 255], 0.12)
}

function glowSprite(accent: RGB): HTMLCanvasElement | null {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  if (!g) return null
  const [r, gr, b] = accent
  const core = mix(accent, [255, 255, 255], 0.7)
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(${core[0] | 0},${core[1] | 0},${core[2] | 0},0.75)`)
  grad.addColorStop(0.15, `rgba(${r},${gr},${b},0.35)`)
  grad.addColorStop(0.5, `rgba(${r},${gr},${b},0.08)`)
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export function mountLogoParticles(stage: HTMLElement, options: LogoParticlesOptions): LogoParticlesInstance | null {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  const ctx = canvas.getContext('2d')
  if (!ctx || !options.sources.length) return null
  stage.append(canvas)

  const forms = options.sources.length
  const holds = options.sources.map((_, i) => options.holds?.[i] ?? 7)
  const isDark = options.isDark ?? (() => stage.closest('.dark') !== null)
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const accent = options.accent ? resolveColour(options.accent, stage, LOGO_PINK) : LOGO_PINK
  const accentCss = accent.join(',')
  const tint = options.tint ? resolveColour(options.tint.colour, stage, [255, 255, 255]) : null
  const tintAmount = clamp(options.tint?.amount ?? 0)
  const tinted = (c: RGB) => rgb(tint ? mix(c, tint, tintAmount) : c)
  const HEAT_DARK = heatRamp([238, 238, 238], accent)
  const HEAT_LIGHT = heatRamp([60, 64, 72], accent)
  const glow = glowSprite(accent)
  const dust = Array.from({ length: 54 }, (_, i) => ({ x: rand(i + 81), y: rand(i + 94), phase: rand(i + 45) * TAU }))
  let images: HTMLImageElement[] = []

  let W = 0
  let H = 0
  let P: Particle[] = []
  let time = 0
  let intro = 0
  let form = 0
  let from = options.sources.map((_, i) => Number(i === 0))
  let weights = from.slice()
  let morphT = MORPH
  let holdT = 0
  let charge = 0
  let tiltX = 0
  let tiltY = 0
  let out = 0 // eased scroll-out progress
  let ring: { x: number; y: number; life: number; power: number } | null = null
  let trail: { x: number; y: number; life: number }[] = []
  const ptr = { x: 0, y: 0, sx: 0, sy: 0, speed: 0, active: false, holding: false }
  let rect = stage.getBoundingClientRect()
  let visible = true
  let raf = 0
  let last: number | null = null
  let destroyed = false

  /** An image's opaque pixels, fitted to the stage, left to right */
  function sample(img: HTMLImageElement, step: number): Sample[] {
    const off = document.createElement('canvas')
    off.width = Math.ceil(W)
    off.height = Math.ceil(H)
    const o = off.getContext('2d', { willReadFrequently: true })
    if (!o) return []
    // Wide shapes (the wordmark) fill the width; tall ones (the mark) are held to half the height
    const scale = Math.min((W * 0.86) / img.naturalWidth, (H * 0.5) / img.naturalHeight)
    const iw = img.naturalWidth * scale
    const ih = img.naturalHeight * scale
    o.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih)
    const data = o.getImageData(0, 0, off.width, off.height).data
    const out: Sample[] = []
    for (let y = 0; y < off.height; y += step)
      for (let x = 0; x < off.width; x += step) {
        const j = (y * off.width + x) * 4
        if (data[j + 3] <= 140) continue
        const [r, g, b] = [data[j], data[j + 1], data[j + 2]]
        out.push({ x: x - W / 2, y: y - H / 2, onDark: tinted(onDark(r, g, b)), onLight: tinted([r, g, b]) })
      }
    return out.sort((a, b) => a.x - b.x || a.y - b.y)
  }

  /** Sample every image and give each particle one home in each */
  function build() {
    if (!images.length || W < 2 || H < 2) return
    const step = W < 600 ? 2 : 3
    const shapes = images.map((img) => sample(img, step))
    if (shapes.some((s) => !s.length)) return
    const cap = W < 600 ? 1800 : W < 1000 ? 3200 : 4600
    const n = Math.min(cap, Math.max(...shapes.map((s) => s.length)))
    P = []
    for (let i = 0; i < n; i++) {
      const seed = rand(i + 1)
      const homes = shapes.map((s, k) => {
        const sm = s[Math.floor((i * s.length) / n)]
        if (s.length >= n) return sm
        // Fewer samples than dots: spread the doubled-up ones a little so they don't stack
        return { ...sm, x: sm.x + (rand(i + 300 + k) - 0.5) * step, y: sm.y + (rand(i + 500 + k) - 0.5) * step }
      })
      P.push({
        homes,
        z: (seed - 0.5) * 24,
        u: i / n - 0.5,
        x: homes[form].x,
        y: homes[form].y,
        vx: 0,
        vy: 0,
        seed,
        phase: rand(i + 71) * TAU,
        heat: 0,
        size: (W < 600 ? 0.9 : 1.05) + 1.05 * seed,
      })
    }
    if (reduced) frame(0, true)
    else if (time === 0) intro = 0 // the dots fly in on first show only
  }

  function resize() {
    rect = stage.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    if (w === W && h === H) return
    W = w
    H = h
    const dpr = Math.min(window.devicePixelRatio || 1, W < 600 ? 1.5 : 1.75)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    ptr.x = ptr.sx = W / 2
    ptr.y = ptr.sy = H / 2
    build()
  }

  function setForm(next: number) {
    from = weights.slice()
    form = next
    morphT = 0
    holdT = 0
    options.onForm?.(form)
  }

  function release(cancel = false) {
    if (!ptr.holding) return
    ptr.holding = false
    if (cancel || reduced) return
    const power = Math.max(0.3, charge)
    ring = { x: ptr.sx, y: ptr.sy, life: 1, power }
    for (const p of P) {
      const dx = p.x + W / 2 - ptr.sx
      const dy = p.y + H / 2 - ptr.sy
      const d = Math.hypot(dx, dy) || 1
      const f = (9 + 13 * p.seed) * power
      p.vx += (dx / d) * f - (dy / d) * power * 3 // outward push + a little swirl
      p.vy += (dy / d) * f + (dx / d) * power * 3
      p.heat = Math.max(p.heat, power * (0.4 + 0.6 * p.seed))
    }
  }

  /** One step of the simulation and a full redraw. `k` is the frame's length in 60fps frames. */
  function frame(k: number, snap = false) {
    const g = ctx!
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(W * 0.24, (H - 16) * 0.28) // scale for the backdrop, the morph swing and the gather orbit
    const live = snap ? 0 : 1
    const dark = isDark()
    const HEAT = dark ? HEAT_DARK : HEAT_LIGHT

    let mt = 1
    if (!snap) {
      time += k / 60
      if (forms > 1 && !ptr.holding && charge < 0.02 && !ring) {
        holdT += k / 60
        if (holdT >= holds[form]) setForm((form + 1) % forms)
      }
      morphT = Math.min(MORPH, morphT + k / 60)
      mt = smooth(morphT / MORPH)
      weights = from.map((f, i) => f + (Number(i === form) - f) * mt)
      intro = Math.min(1, intro + k / 85)
      charge += (Number(ptr.holding) - charge) * (1 - Math.exp(-(ptr.holding ? 0.032 : 0.11) * k))
      ptr.sx += (ptr.x - ptr.sx) * (1 - Math.exp(-0.22 * k))
      ptr.sy += (ptr.y - ptr.sy) * (1 - Math.exp(-0.22 * k))
      ptr.speed *= Math.pow(0.86, k)
      const ease = 1 - Math.exp(-0.075 * k)
      tiltX += ((ptr.active ? (ptr.x / W - 0.5) * 0.22 : 0.025 * Math.sin(time * 0.26)) - tiltX) * ease
      tiltY += ((ptr.active ? (ptr.y / H - 0.5) * 0.12 : 0) - tiltY) * ease
      if (options.scrollOut) {
        const target = clamp(-rect.top / Math.max(rect.height, 1))
        const next = out + (target - out) * ease
        if (Math.abs(next - out) > 0.0005) stage.style.setProperty('--out', next.toFixed(3))
        out = next
      }
    }

    g.clearRect(0, 0, W, H)
    if (options.progress) options.progress.style.transform = `scaleX(${snap ? 0 : clamp(holdT / holds[form])})`

    if (options.backdrop) {
      // Faint orbit ellipses and drifting dust specks (some drawn as small crosses)
      g.strokeStyle = dark ? 'rgba(230,230,230,0.055)' : 'rgba(30,34,40,0.07)'
      g.lineWidth = 0.7
      for (let e = 0; e < 3; e++) {
        g.beginPath()
        g.ellipse(cx, cy, Math.min(W * 0.43, R * 2.9), R * (0.66 + 0.24 * e), -0.18 + 0.15 * e + 0.045 * Math.sin(time * 0.15), 0, TAU)
        g.stroke()
      }
      g.fillStyle = dark ? 'rgba(238,238,238,0.2)' : 'rgba(30,34,40,0.22)'
      dust.forEach((d, i) => {
        const x = d.x * W + 8 * Math.sin(time * 0.2 + d.phase) * live
        const y = d.y * (H - 8) + 5 * Math.cos(time * 0.16 + d.phase) * live
        g.fillRect(x, y, i % 7 === 0 ? 4 : 1, 1)
        if (i % 7 === 0) g.fillRect(x + 1.5, y - 1.5, 1, 4)
      })
    }

    // The form whose colours the dots wear: they switch halfway through a morph, while flying
    let shown = 0
    weights.forEach((w, i) => w > weights[shown] && (shown = i))
    const swing = Math.sin(Math.PI * mt) * live // 0 at rest, 1 mid-morph
    const gather = 0.98 * smooth(charge)
    const scatter = (1 - smooth(intro)) * live
    const pour = smooth(clamp(out * 1.6)) * live // scroll-out: the dots fall and spread
    const fade = 1 - pour * 0.75
    const band = 0.65 * Math.sin(time * 0.42) // a highlight sweeping across the shape
    const rs = Math.min(1, W / 700)
    const damp = Math.pow(0.79, k)
    const repelR = Math.min(W * 0.2, 140)
    const glowing: Particle[] = []

    for (let i = 0; i < P.length; i++) {
      const p = P[i]
      let x = 0
      let y = 0
      for (let f = 0; f < forms; f++) {
        x += p.homes[f].x * weights[f]
        y += p.homes[f].y * weights[f]
      }
      const z = p.z + Math.sin(p.phase) * R * 0.6 * swing
      const persp = 800 / (800 - z)
      x = (x + z * tiltX) * persp
      y = (y + z * tiltY) * persp

      // A soft wave through the shape, the swing out mid-morph, and the scatter they fly in from
      const a = (p.homes[shown].x / W) * TAU
      const w1 = Math.sin(a * 2.4 - time * 2.2)
      const w2 = Math.sin(a * 3.8 + time * 1.65 + (p.homes[shown].y / H) * 2)
      x += (3 * w1 + 1.5 * w2) * rs * live + Math.cos(p.phase) * R * 0.45 * swing + Math.sin(p.phase * 2 + time) * 60 * scatter
      y += (6 * w1 + 3 * w2) * rs * live + Math.sin(p.phase) * R * 0.3 * swing + Math.cos(p.phase + time) * Math.min(H * 0.3, 75) * scatter

      if (ptr.active && !snap) {
        const dx = x + cx - ptr.sx
        const dy = y + cy - ptr.sy
        const d = Math.hypot(dx, dy) || 1
        const f = clamp(1 - d / repelR)
        const push = f * f * (28 + Math.min(22, ptr.speed)) * (1 - gather)
        x += (dx / d) * push - (dy / d) * push * 0.22
        y += (dy / d) * push + (dx / d) * push * 0.22
        p.heat = Math.max(p.heat, f * Math.min(1, 0.16 + 0.035 * ptr.speed))
      }
      if (gather > 0.001) {
        const ang = p.phase + time * (1.6 + 2.5 * charge) + p.seed * 6
        const rad = (12 + p.seed * R * 0.78) * (1 - 0.35 * charge)
        const ox = ptr.sx - cx + Math.cos(ang) * rad
        const oy = ptr.sy - cy + Math.sin(ang) * rad * 0.53 + Math.cos(p.phase * 3 + time) * 8
        x += (ox - x) * gather
        y += (oy - y) * gather
        p.heat = Math.max(p.heat, gather * (0.25 + 0.75 * p.seed))
      }
      if (pour > 0) {
        x += Math.sin(p.phase + time * 0.3) * pour * 80
        y += pour * (H * 0.65 + 80 * p.seed)
      }

      if (snap) {
        p.x = x
        p.y = y
        p.vx = p.vy = p.heat = 0
      } else {
        p.vx = (p.vx + (x - p.x) * 0.027 * k) * damp
        p.vy = (p.vy + (y - p.y) * 0.027 * k) * damp
        p.x += p.vx * k
        p.y += p.vy * k
        p.heat = Math.max(0, p.heat - 0.014 * k)
      }

      const lit = Math.max(0, 1 - Math.abs(p.u - band) * 5) * live
      const shade = clamp(Math.round(6 + p.seed * 5 + (z / R) * 3 + lit * 5), 0, 15)
      const s = p.size * persp * (1 + p.heat * 0.25 + lit * 0.16)
      if (p.heat > 0.06) {
        g.globalAlpha = fade
        g.fillStyle = HEAT[Math.min(15, Math.round(p.heat * 15))]
      } else {
        g.globalAlpha = (0.45 + (shade / 15) * 0.55) * fade // depth (and the sweeping highlight) as brightness
        g.fillStyle = dark ? p.homes[shown].onDark : p.homes[shown].onLight
      }
      g.fillRect(cx + p.x - s / 2, cy + p.y - s / 2, s, s)
      if (p.heat > 0.24 && i % 9 === 0) glowing.push(p)
    }
    g.globalAlpha = 1
    if (snap) return

    if (glow) {
      for (const p of glowing) {
        const s = 14 + 12 * p.heat
        g.globalAlpha = 0.62 * p.heat
        g.drawImage(glow, cx + p.x - s / 2, cy + p.y - s / 2, s, s)
      }
      g.globalAlpha = 1
    }

    // Pointer trail
    if (ptr.active && ptr.speed > 0.8) {
      trail.push({ x: ptr.sx, y: ptr.sy, life: 1 })
      if (trail.length > 20) trail.shift()
    }
    g.lineCap = 'round'
    for (let i = trail.length - 1; i >= 0; i--) {
      const t = trail[i]
      t.life -= 0.045 * k
      if (t.life <= 0) {
        trail.splice(i, 1)
        continue
      }
      if (i === 0) continue
      const prev = trail[i - 1]
      g.strokeStyle = `rgba(${accentCss},${0.45 * t.life})`
      g.lineWidth = 1.8 * t.life
      g.beginPath()
      g.moveTo(prev.x, prev.y)
      g.lineTo(t.x, t.y)
      g.stroke()
    }
    // Charge arc while holding
    if (charge > 0.02) {
      g.strokeStyle = dark ? `rgba(238,238,238,${0.4 * charge})` : `rgba(40,44,52,${0.4 * charge})`
      g.lineWidth = 1
      g.beginPath()
      g.ellipse(ptr.sx, ptr.sy, 18 + charge * R * 0.7, 8 + charge * R * 0.34, -0.2, -Math.PI / 2, -Math.PI / 2 + TAU * charge)
      g.stroke()
    }
    // Release ring
    if (ring) {
      ring.life -= 0.025 * k
      if (ring.life <= 0) ring = null
      else {
        const e = 1 - Math.pow(ring.life, 3)
        g.strokeStyle = dark ? `rgba(140,175,255,${0.35 * ring.life})` : `rgba(49,87,168,${0.4 * ring.life})`
        g.lineWidth = 0.75
        g.beginPath()
        g.ellipse(ring.x, ring.y, 14 + e * R * (1 + ring.power), 7 + e * R * (0.55 + ring.power * 0.3), -0.12, 0, TAU)
        g.stroke()
      }
    }
  }

  // ---------- loop: only while on screen and the tab is visible ----------
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    const k = last === null ? 1 : clamp((now - last) / (1000 / 60), 0.1, 2)
    last = now
    if (P.length) frame(k)
  }
  const syncLoop = () => {
    const run = !destroyed && !reduced && visible && !document.hidden && images.length > 0
    if (run && !raf) {
      last = null
      raf = requestAnimationFrame(tick)
    } else if (!run && raf) {
      cancelAnimationFrame(raf)
      raf = 0
      release(true)
      ptr.active = false
      trail = []
    }
  }

  // ---------- pointer ----------
  const move = (e: PointerEvent) => {
    rect = stage.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, W)
    const y = clamp(e.clientY - rect.top, 0, H)
    ptr.speed = ptr.active ? Math.min(60, Math.hypot(x - ptr.x, y - ptr.y)) : 0
    ptr.x = x
    ptr.y = y
    if (!ptr.active) {
      ptr.sx = x
      ptr.sy = y
    }
    ptr.active = true
  }
  const onDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return
    move(e)
    ptr.holding = true
    holdT = 0
  }
  const onMove = (e: PointerEvent) => e.isPrimary && move(e)
  const onUp = (e: PointerEvent) => {
    if (!e.isPrimary) return
    release()
    if (e.pointerType !== 'mouse') ptr.active = false
  }
  const onCancel = () => {
    release(true)
    ptr.active = false
  }
  const onLeave = () => {
    release()
    ptr.active = false
  }
  const onVisibility = () => syncLoop()
  const onScroll = () => (rect = stage.getBoundingClientRect())

  if (!reduced) {
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onCancel) // e.g. a touch that turns into a scroll
    stage.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
  }
  document.addEventListener('visibilitychange', onVisibility)

  const resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(stage)
  const viewObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    syncLoop()
  })
  viewObserver.observe(stage)

  Promise.all(options.sources.map(loadImage))
    .then((loaded) => {
      if (destroyed) return
      images = loaded
      resize() // builds if the size is new
      if (!P.length) build()
      options.onReady?.()
      syncLoop()
    })
    .catch(() => {
      /* an image failed to load: the stage stays empty */
    })

  return {
    destroy() {
      destroyed = true
      syncLoop()
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      viewObserver.disconnect()
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onCancel)
      stage.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
      P = []
    },
  }
}
