import { LogoImage } from '@/components/ui/Logo.tsx'
import type { CSSProperties } from 'react'
import { brandLogos, type BrandLogo } from '@/features/shared/brand-logos.ts'
import { toolLogos } from './tool-logos.ts'

/*
 * The strip under the hero: a continuous slider (marquee) of what we run. The clouds keep their brand logos; the
 * tools we run on top of them show their own logo marks (Simple Icons, CC0, in tool-logos.ts) with the name
 * beside them. The list is drawn twice so the loop is seamless; the copy is hidden from screen readers. It pauses
 * on hover and focus, and with reduced motion it stops and simply wraps.
 */

/** The clouds, as logos (brand-logos.ts). Our own logo isn't in the strip: it's about what you already run */
const clouds = ['AWS', 'Azure', 'Google Cloud']

/** The tools we run on those clouds, drawn with their logos from tool-logos.ts */
const tools = ['DigitalOcean', 'Kubernetes', 'Docker', 'Terraform', 'Nginx', 'Redis', 'Cloudflare', 'GitHub Actions']

/** A logo's colours as CSS variables (none: no style at all) */
const colors = (l: BrandLogo): CSSProperties | undefined => {
  const vars: Record<string, string> = {}
  if (l.color) vars['--c'] = l.color
  if (l.darkColor) vars['--c-dark'] = l.darkColor
  return Object.keys(vars).length ? (vars as CSSProperties) : undefined
}

function Mark({ l, width, height }: { l: BrandLogo; width: number; height: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={l.viewBox}
      fill="currentColor"
      style={colors(l)}
      aria-hidden="true"
      // Fixed SVG paths from brand-logos.ts / tool-logos.ts
      dangerouslySetInnerHTML={{ __html: l.body }}
    />
  )
}

function CloudLogo({ name }: { name: string }) {
  const l = brandLogos[name]
  if (!l) return <span>{name}</span>
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  const height = l.wordmark ? 30 : 26
  return (
    <>
      <Mark l={l} width={Math.round((height * w) / h)} height={height} />
      <span className={l.wordmark ? 'sr-only' : undefined}>{name}</span>
    </>
  )
}

/** A tool's logo mark with its name beside it, in the same size as the cloud marks */
function ToolLogo({ name }: { name: string }) {
  const l = toolLogos[name]
  if (!l) return <span>{name}</span>
  return (
    <>
      <Mark l={l} width={26} height={26} />
      <span>{name}</span>
    </>
  )
}

/**
 * A logo and its name, in the brand's colours (--c, and --c-dark on the dark theme, set on the logo). Positioned,
 * so the screen-reader name beside a wordmark stays inside the strip. The names darken under the pointer.
 */
const logo = [
  'relative flex flex-none items-center gap-[0.6rem] text-[1.2rem] font-semibold tracking-[-0.02em] whitespace-nowrap',
  'text-neutral-700 transition-[color] duration-[250ms] hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white',
  '[&_svg]:[color:var(--c,currentColor)] dark:[&_svg]:[color:var(--c-dark,var(--c,currentColor))]',
  'max-[640px]:text-[1rem] max-[640px]:[&_svg]:h-[1.35rem] max-[640px]:[&_svg]:w-auto motion-reduce:[transition:none]',
].join(' ')

/**
 * One copy of the list. With reduced motion the strip stands still: the list wraps, centred, and its copy goes.
 * (On a phone the old grid columns are kept as written, though the row is a flex row: they don't apply.)
 */
const list = [
  'flex min-w-0 flex-none flex-nowrap items-center justify-start gap-x-14 gap-y-0 pr-14',
  'max-[640px]:grid-cols-[repeat(3,max-content)] max-[640px]:justify-items-start max-[640px]:gap-x-9 max-[640px]:pr-9',
  'max-[480px]:grid-cols-[repeat(2,max-content)]',
  'motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-4 motion-reduce:pr-0',
  'max-[640px]:motion-reduce:gap-x-8 max-[640px]:motion-reduce:pr-0',
].join(' ')

const Items = () => (
  <>
    <li className={logo}>
      <LogoImage src="/logo.png" alt="VavenCloud" className="h-5 w-auto" wrapClass="dark:hidden" />
      <LogoImage src="/logo-light.png" alt="VavenCloud" className="h-5 w-auto" wrapClass="hidden dark:inline-flex" />
    </li>
    {clouds.map((c) => (
      <li key={c} className={logo}>
        <CloudLogo name={c} />
      </li>
    ))}
    {tools.map((t) => (
      <li key={t} className={logo}>
        <ToolLogo name={t} />
      </li>
    ))}
  </>
)

export function TrackRecord({ label = 'Runs on what you already run' }: { label?: string }) {
  return (
    <section
      id="track-record"
      aria-labelledby="track-record-title"
      className={[
        'border-b border-neutral-200 dark:border-neutral-800',
        // A sheet laid over the hero's foot: rounded top corners and a soft shadow above it
        'relative z-2 -mt-10 rounded-t-[2.5rem] border-t border-t-[rgb(24_24_27/0.06)] bg-(--color-paper) [box-shadow:0_-18px_40px_-28px_rgb(24_24_27/0.28)]',
        'max-[641px]:-mt-7 max-[641px]:rounded-t-[1.75rem]',
        'dark:border-t-[rgb(255_255_255/0.06)] dark:bg-neutral-950 dark:[box-shadow:0_-18px_40px_-28px_rgb(0_0_0/0.7)]',
        'origin-top [--track-record-offset:2.5rem] max-[641px]:[--track-record-offset:1.75rem]',
        'motion-safe:supports-[animation-timeline:view()]:animate-track-record-rise motion-safe:supports-[animation-timeline:view()]:[animation-timeline:view(block_0px_16%)] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_entry_100%]',
      ].join(' ')}
    >
      {/* The label, then the moving row; narrower than 1400px the label goes on its own line above */}
      <div className="flex items-center gap-x-14 gap-y-5 overflow-hidden px-[clamp(1.5rem,4vw,4rem)] py-7 max-[1400px]:flex-col max-[1400px]:gap-[1.1rem]">
        <p
          id="track-record-title"
          className="flex-none font-[ui-monospace,SFMono-Regular,Menlo,monospace] text-[0.7rem] tracking-[0.12em] text-neutral-500 uppercase"
        >
          {label}
        </p>
        {/* A continuous slider, its edges faded; hover or focus pauses it */}
        <div
          className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] max-[1400px]:w-full motion-reduce:[mask-image:none]"
          data-tr-marquee=""
        >
          {/* The list is drawn twice so the loop is seamless (it moves by one copy's width); the copy is hidden from screen readers */}
          <div className="flex w-max animate-v5-marquee motion-reduce:w-full motion-reduce:[animation:none] [[data-tr-marquee]:focus-within_&]:[animation-play-state:paused] [[data-tr-marquee]:hover_&]:[animation-play-state:paused]">
            <ul className={list}>
              <Items />
            </ul>
            <ul className={`${list} motion-reduce:hidden`} aria-hidden="true">
              <Items />
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
