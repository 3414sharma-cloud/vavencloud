/**
 * GlassSurface – vanilla TypeScript port of the React Bits <GlassSurface /> component
 * (SVG-filter refraction + frosted fallback). Applies the glass to an existing element.
 *
 * - Chromium: real refraction. A displacement map bends whatever is behind the element at its
 *   edges, with RGB channel offsets for chromatic fringes (backdrop-filter: url(#svg-filter)).
 * - Safari / Firefox: frosted glass fallback (blur + sheen + light-catching rim).
 *
 * The element is styled through CSS custom properties, so CSS decides *when* the glass shows:
 *   background: var(--glass-bg); backdrop-filter: var(--glass-filter); box-shadow: var(--glass-shadow);
 * The element also gets a `glass-refractive` or `glass-frosted` class.
 *
 * Not ported: the WebGL renderer and `shape` masks (they need a single known backdrop element).
 */

export type GlassChannel = 'R' | 'G' | 'B'

export interface GlassSurfaceOptions {
  /** Corner radius in px. Defaults to the element's computed border-radius (capped at a pill). */
  borderRadius?: number
  borderWidth?: number
  brightness?: number
  opacity?: number
  blur?: number
  displace?: number
  backgroundOpacity?: number
  saturation?: number
  distortionScale?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  xChannel?: GlassChannel
  yChannel?: GlassChannel
  mixBlendMode?: string
  refraction?: boolean
}

export interface GlassSurfaceInstance {
  refresh: () => void
  destroy: () => void
}

const SVG_NS = 'http://www.w3.org/2000/svg'

// Shadows/rims from the original, using its dark-scheme (white rim) values, which suit
// a navbar that floats over both the dark hero and the light sections.
const SVG_SHADOW = [
  '0 0 2px 1px rgb(255 255 255 / 0.35) inset',
  '0 0 10px 4px rgb(255 255 255 / 0.15) inset',
  '0px 4px 16px rgba(17, 17, 26, 0.05)',
  '0px 8px 24px rgba(17, 17, 26, 0.05)',
  '0px 16px 56px rgba(17, 17, 26, 0.05)',
  '0px 4px 16px rgba(17, 17, 26, 0.05) inset',
  '0px 8px 24px rgba(17, 17, 26, 0.05) inset',
  '0px 16px 56px rgba(17, 17, 26, 0.05) inset',
].join(', ')

const FALLBACK_SHADOW = [
  'inset 0 1px 0 0 hsl(0 0% 100% / 0.3)',
  'inset 0 -1px 0 0 hsl(0 0% 100% / 0.08)',
  '0 0 2px 1px rgb(255 255 255 / 0.28) inset',
  '0 0 12px 3px rgb(255 255 255 / 0.1) inset',
  '0px 4px 16px rgba(17, 17, 26, 0.06)',
  '0px 8px 24px rgba(17, 17, 26, 0.06)',
  '0px 16px 56px rgba(17, 17, 26, 0.06)',
].join(', ')

let uid = 0

const supportsSvgBackdrop = (filterId: string) => {
  const ua = navigator.userAgent
  const isWebkit = /Safari/.test(ua) && !/Chrome/.test(ua)
  const isFirefox = /Firefox/.test(ua)
  if (isWebkit || isFirefox) return false
  const div = document.createElement('div')
  div.style.backdropFilter = `url(#${filterId})`
  return div.style.backdropFilter !== ''
}

export function mountGlassSurface(el: HTMLElement, options: GlassSurfaceOptions = {}): GlassSurfaceInstance {
  const o = {
    borderWidth: 0.07,
    brightness: 50,
    opacity: 0.93,
    blur: 11,
    displace: 0,
    backgroundOpacity: 0,
    saturation: 1,
    distortionScale: -180,
    redOffset: 0,
    greenOffset: 10,
    blueOffset: 20,
    xChannel: 'R' as GlassChannel,
    yChannel: 'G' as GlassChannel,
    mixBlendMode: 'difference',
    refraction: true,
    ...options,
  }

  const id = `glass-${++uid}`
  const filterId = `${id}-filter`
  const redGradId = `${id}-red`
  const blueGradId = `${id}-blue`
  const softId = `${id}-soft`

  // Hidden SVG holding the refraction filter (lives inside the element, like the original)
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:-10'
  svg.innerHTML = `
    <defs>
      <filter id="${filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
        <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap data-ch="r" in="SourceGraphic" in2="map" result="dispRed" />
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feDisplacementMap data-ch="g" in="SourceGraphic" in2="map" result="dispGreen" />
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feDisplacementMap data-ch="b" in="SourceGraphic" in2="map" result="dispBlue" />
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" result="output" />
        <feGaussianBlur in="output" stdDeviation="${o.displace}" />
      </filter>
    </defs>`
  el.prepend(svg)

  const feImage = svg.querySelector('feImage')!
  const channels: [string, number][] = [
    ['r', o.redOffset],
    ['g', o.greenOffset],
    ['b', o.blueOffset],
  ]
  channels.forEach(([ch, offset]) => {
    const node = svg.querySelector(`[data-ch="${ch}"]`)!
    node.setAttribute('scale', String(o.distortionScale + offset))
    node.setAttribute('xChannelSelector', o.xChannel)
    node.setAttribute('yChannelSelector', o.yChannel)
  })

  /** Edge-gradient displacement map sized to the element (red = x, blue = y, calm grey centre). */
  const displacementMap = () => {
    const rect = el.getBoundingClientRect()
    const w = rect.width || 400
    const h = rect.height || 200
    const computed = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
    const radius = Math.min(o.borderRadius ?? computed, h / 2, w / 2)
    const edge = Math.min(w, h) * (o.borderWidth * 0.5)
    const content = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="${SVG_NS}">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/>
          </linearGradient>
          <filter id="${softId}" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="${o.blur}" />
          </filter>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" fill="url(#${redGradId})"/>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${radius}" fill="url(#${blueGradId})" style="mix-blend-mode:${o.mixBlendMode}"/>
        <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${radius}" fill="hsl(0 0% ${o.brightness}% / ${o.opacity})" filter="url(#${softId})"/>
      </svg>`
    return `data:image/svg+xml,${encodeURIComponent(content)}`
  }

  const refractive = o.refraction && supportsSvgBackdrop(filterId)
  const blurSupported =
    CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')

  if (refractive) {
    el.classList.add('glass-refractive')
    el.style.setProperty('--glass-bg', `hsl(0 0% 100% / ${o.backgroundOpacity})`)
    el.style.setProperty('--glass-filter', `url(#${filterId}) saturate(${o.saturation})`)
    el.style.setProperty('--glass-shadow', SVG_SHADOW)
  } else {
    el.classList.add('glass-frosted')
    el.style.setProperty(
      '--glass-bg',
      blurSupported ? `hsl(0 0% 100% / ${0.04 + o.backgroundOpacity * 0.3})` : 'hsl(222 45% 8% / 0.72)',
    )
    el.style.setProperty('--glass-filter', `blur(12px) saturate(${o.saturation * 1.4}) brightness(1.04)`)
    el.style.setProperty('--glass-shadow', FALLBACK_SHADOW)
  }

  // Regenerate the map whenever the element's size/radius changes (e.g. the pill shrinking)
  let frame = 0
  const refresh = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => feImage.setAttribute('href', displacementMap()))
  }
  const sizes = new ResizeObserver(refresh)
  sizes.observe(el)
  el.addEventListener('transitionend', refresh)
  refresh()

  return {
    refresh,
    destroy() {
      cancelAnimationFrame(frame)
      sizes.disconnect()
      el.removeEventListener('transitionend', refresh)
      svg.remove()
      el.classList.remove('glass-refractive', 'glass-frosted')
      ;['--glass-bg', '--glass-filter', '--glass-shadow'].forEach((p) => el.style.removeProperty(p))
    },
  }
}
