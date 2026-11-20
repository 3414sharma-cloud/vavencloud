import { useState, type CSSProperties } from 'react'
import { sectionLead, sectionTitle } from '@/components/ui/classes.ts'
import { useInViewOnce } from '@/hooks/useInViewOnce.ts'
import { cn } from '@/lib/cn.ts'
import { prefersReducedMotion } from '@/lib/motion.ts'
import { problemIntro } from './story.data.ts'

/*
 * The problem's heading: "Who do you call?" and what you get ("Three vendors. Three answers." then "Zero
 * fixes."), the night in a paragraph under it, all in one column across the page. The beats wrap one per line
 * where the screen is narrow. "Zero fixes." is in the serif italic, with a dry brush stroke drawn under it.
 */

/** A beat of the title: it waits out of sight (data-state="waiting" on the title), then rises in, a beat apart */
const beatCls = [
  'inline-block whitespace-nowrap',
  // the delay inside the shorthand: a separate transition-delay class can come before it in the stylesheet and be reset
  '[transition:opacity_0.7s_ease_calc(var(--i)*0.16s),filter_0.7s_ease_calc(var(--i)*0.16s),transform_0.8s_cubic-bezier(0.2,0.7,0.2,1)_calc(var(--i)*0.16s)]',
  '[[data-state=waiting]>&]:opacity-0 [[data-state=waiting]>&]:[filter:blur(8px)] [[data-state=waiting]>&]:[transform:translateY(0.35em)]',
].join(' ')
/** The stroke, drawn in once the title is in */
const brushCls = [
  'pointer-events-none absolute -bottom-[0.27em] -left-[0.05em] h-[0.36em] w-[calc(100%+0.17em)] overflow-visible',
  '[&_path]:fill-none [&_path]:stroke-current [&_path]:[stroke-width:17] [&_path]:[stroke-linecap:round] [&_path]:[stroke-dasharray:1_3] [&_path]:[stroke-dashoffset:0]',
  '[&_path]:[transition:stroke-dashoffset_0.7s_cubic-bezier(0.65,0.05,0.3,1)_0.85s] [[data-state=waiting]_&_path]:[stroke-dashoffset:1.02]',
].join(' ')

/** A dry brush stroke under "Zero fixes.": the filter roughens its edges and leaves gaps where the bristles ran dry */
const brush = `
        <filter id="v2-brush-dry" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="80" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.5" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1.05" result="streaks" />
          <feComposite in="rough" in2="streaks" operator="in" />
        </filter>
        <path d="M10 23 C 100 16, 230 14, 390 18" pathLength="1" filter="url(#v2-brush-dry)" />
      `

const beat = (i: number) => ({ '--i': i }) as CSSProperties

/** The title's three beats wait out of sight, then rise in one by one as it comes into view (not with reduced motion) */
const canAnimate = () => !prefersReducedMotion() && 'IntersectionObserver' in window

export function ProblemHeading() {
  const [state, setState] = useState<'waiting' | 'in' | undefined>(() => (canAnimate() ? 'waiting' : undefined))
  const ref = useInViewOnce<HTMLHeadingElement>(() => setState('in'), { threshold: 0.6, reduced: 'skip' })
  return (
    <div>
      <h2
        ref={ref}
        id="problem-title"
        className={cn(sectionTitle, 'pb-[0.2em] text-[length:clamp(2.5rem,5.4vw,4.6rem)]')}
        data-tagline=""
        data-state={state}
      >
        <span className={beatCls} style={beat(0)}>
          Three vendors.
        </span>{' '}
        <span className={beatCls} style={beat(1)}>
          Three answers.
        </span>
        <br />
        <strong
          className={`${beatCls} relative font-['Instrument_Serif',Georgia,serif] text-[1.12em] leading-[0.95] font-normal tracking-[-0.02em] text-brand-600 italic dark:text-brand-400`}
          style={beat(2)}
        >
          Zero fixes.
          <svg
            className={brushCls}
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            // A fixed SVG filter, kept as written (its attribute names are case-sensitive)
            dangerouslySetInnerHTML={{ __html: brush }}
          />
        </strong>
      </h2>
      <p className={cn(sectionLead, 'mt-7 max-w-none')}>{problemIntro}</p>
    </div>
  )
}
