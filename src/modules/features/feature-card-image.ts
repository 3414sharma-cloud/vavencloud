import { icon } from '@/shared/ui/icons.ts'
import type { Feature } from './features.data.ts'

/*
 * CircularGallery shows images, so each feature card is painted onto a canvas in the site's style
 * (ink gradient, brand glow, icon tile, title, description) and handed over as a PNG data URL.
 * 780x1000 = the gallery's default 0.78 aspect, large enough to stay sharp on 2x screens.
 */
const W = 780
const H = 1000
const PAD = 72
const FONT = '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'

/** One shared accent for every card (brand-300) so the gallery reads as a single set. */
const ACCENT = { hex: '#93b2e8', rgb: '147 178 232' }

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

/** Greedy word wrap for canvas text. */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Waits for the page font so canvas text uses Plus Jakarta Sans (falls back after 1.5s). */
async function fontsReady() {
  const load = Promise.all([document.fonts.load(`700 60px ${FONT}`), document.fonts.load(`500 36px ${FONT}`)])
  await Promise.race([load, new Promise((r) => setTimeout(r, 1500))])
}

async function paintCard(feature: Feature, index: number, total: number): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')

  const accent = ACCENT
  const rgba = (a: number) => `rgb(${accent.rgb} / ${a})`

  // Frosted glass: mostly transparent, so the section's glow and particles show through the card
  const glass = ctx.createLinearGradient(0, 0, W, H)
  glass.addColorStop(0, 'rgb(255 255 255 / 0.13)')
  glass.addColorStop(0.5, 'rgb(255 255 255 / 0.06)')
  glass.addColorStop(1, 'rgb(255 255 255 / 0.03)')
  ctx.fillStyle = glass
  ctx.fillRect(0, 0, W, H)

  // A soft wash of the card's own accent colour in the top corner
  const wash = ctx.createRadialGradient(W, 0, 0, W, 0, 560)
  wash.addColorStop(0, rgba(0.28))
  wash.addColorStop(1, rgba(0))
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, W, H)

  // Glass edge: hairline border that is brighter at the top, like light catching the rim
  const rim = ctx.createLinearGradient(0, 0, 0, H)
  rim.addColorStop(0, 'rgb(255 255 255 / 0.4)')
  rim.addColorStop(0.4, 'rgb(255 255 255 / 0.12)')
  rim.addColorStop(1, 'rgb(255 255 255 / 0.06)')
  ctx.strokeStyle = rim
  ctx.lineWidth = 3
  roundRect(ctx, 14, 14, W - 28, H - 28, 44)
  ctx.stroke()

  // Icon tile: tinted glass in the accent colour, icon in the accent colour
  const tile = 148
  ctx.save()
  ctx.shadowColor = rgba(0.45)
  ctx.shadowBlur = 60
  ctx.fillStyle = rgba(0.16)
  roundRect(ctx, PAD, PAD, tile, tile, 40)
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = rgba(0.45)
  ctx.lineWidth = 2
  roundRect(ctx, PAD + 1, PAD + 1, tile - 2, tile - 2, 39)
  ctx.stroke()
  const svg = icon(feature.icon, '').replace('<svg ', '<svg width="80" height="80" ').replaceAll('currentColor', accent.hex)
  const glyph = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`)
  ctx.drawImage(glyph, PAD + (tile - 80) / 2, PAD + (tile - 80) / 2, 80, 80)

  // Counter, top right: "01 / 06"
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'right'
  ctx.font = `600 30px ${FONT}`
  ctx.fillStyle = 'rgb(255 255 255 / 0.45)'
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, W - PAD, PAD + 44)
  ctx.textAlign = 'left'

  // Title
  let y = PAD + tile + 130
  ctx.font = `700 60px ${FONT}`
  ctx.fillStyle = '#ffffff'
  for (const line of wrapLines(ctx, feature.title, W - PAD * 2)) {
    ctx.fillText(line, PAD, y)
    y += 72
  }

  // Description
  y += 24
  ctx.font = `500 36px ${FONT}`
  ctx.fillStyle = '#cbd5e1' // slate-300: brighter than before, since the card behind is now see-through
  for (const line of wrapLines(ctx, feature.description, W - PAD * 2)) {
    ctx.fillText(line, PAD, y)
    y += 54
  }

  // Accent bar at the bottom
  const bar = ctx.createLinearGradient(PAD, 0, PAD + 220, 0)
  bar.addColorStop(0, accent.hex)
  bar.addColorStop(1, rgba(0))
  ctx.fillStyle = bar
  roundRect(ctx, PAD, H - PAD - 6, 220, 6, 3)
  ctx.fill()

  return canvas.toDataURL('image/png')
}

/** One gallery image per feature, in order. */
export async function featureCardImages(features: Feature[]): Promise<string[]> {
  await fontsReady()
  return Promise.all(features.map((f, i) => paintCard(f, i, features.length)))
}
