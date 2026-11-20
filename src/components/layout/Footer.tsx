import { Fragment, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { site } from '@/app/site.config.ts'
import { useInViewOnce } from '@/hooks/useInViewOnce.ts'
import { useThemePreference } from '@/hooks/useTheme.ts'
import { prefersReducedMotion } from '@/lib/motion.ts'
import { setThemePreference, type ThemePreference } from '@/lib/theme.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import type { IconName } from '@/components/ui/icons.ts'
import { BrandLink } from '@/components/ui/Logo.tsx'
import { copyrightOwner, footerColumns, legalLinks } from './footer.data.ts'
import { container } from '@/components/ui/classes.ts'

/*
 * The site footer, on every page: a night-blue block in light mode, near black in dark mode, with light type,
 * the white-wordmark logo, the theme switch and a big wordmark across its foot.
 */

const linkClass = 'transition-colors [&:hover]:text-white'
/** The hairlines on the dark block */
const line = 'border-[rgb(255_255_255/0.14)]'

const themeOptions: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
]

/**
 * System / Light / Dark switch. Native radios, so it works with keyboard and screen readers as-is. Follows the
 * theme however it changes (the header's toggle too), and sets it when a radio is picked.
 */
function ThemeSwitch() {
  const preference = useThemePreference()
  return (
    <fieldset id="theme-switch" className="flex items-center gap-3">
      <legend className="sr-only">Theme</legend>
      <span className="text-xs text-inherit opacity-70" aria-hidden="true">
        Theme
      </span>
      <div className={`inline-flex rounded-full border p-0.5 ${line}`}>
        {themeOptions.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-inherit transition-colors has-checked:bg-white has-checked:text-neutral-950 has-focus-visible:outline-2 has-focus-visible:outline-brand-600 [&:hover]:text-white [&:hover]:has-checked:text-neutral-950"
          >
            <input
              type="radio"
              name="theme"
              value={o.value}
              className="sr-only"
              checked={preference === o.value}
              onChange={() => setThemePreference(o.value)}
            />
            <Icon name={o.icon} className="h-3.5 w-3.5" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** "VAVENCLOUD" across the foot of the page, each letter stretched to its own width */
const letters: [string, number, number][] = [
  ['V', 0, 102],
  ['A', 102, 102],
  ['V', 204, 102],
  ['E', 306, 90],
  ['N', 396, 106],
  ['C', 502, 104],
  ['L', 606, 84],
  ['O', 690, 109],
  ['U', 799, 104],
  ['D', 903, 97],
]

const letter = [
  'cursor-default fill-current font-[Inter,sans-serif] text-[170px] font-bold tracking-[-8px] [pointer-events:all]',
  '[transform-box:fill-box] [transform-origin:center_bottom] [transition:fill_0.25s_ease,transform_0.42s_cubic-bezier(0.34,1.56,0.64,1)]',
  '[&:hover]:fill-brand-400 [&:hover]:[transform:translateY(-11px)_scale(1.045)_rotate(var(--hover-tilt,-2deg))]',
  'motion-reduce:[transition:none] motion-reduce:[&:hover]:[transform:none]! motion-reduce:[transform:none]',
].join(' ')

const dropOrder = [0, 3, 1, 5, 2, 6, 4, 8, 7, 9]

/** Each letter drops from the footer's top edge the first time the wordmark comes into view. */
function Wordmark() {
  const [dropDistance, setDropDistance] = useState<number | null>(null)
  const ref = useInViewOnce<HTMLDivElement>(
    (el) => {
      const footer = el.closest('footer')
      const { top, height } = el.getBoundingClientRect()
      // SVG transforms use viewBox units, so convert the measured distance from CSS pixels.
      setDropDistance(
        footer && height && !prefersReducedMotion() ? ((top - footer.getBoundingClientRect().top) * 174) / height : 0,
      )
    },
    { threshold: 0.2 },
  )
  return (
    <div ref={ref} className="mt-14 w-full select-none" aria-hidden="true">
      <svg
        viewBox="0 0 1000 174"
        preserveAspectRatio="none"
        role="presentation"
        focusable="false"
        className="block h-auto w-full overflow-visible text-[rgb(255_255_255/0.08)]"
      >
        {letters.map(([char, x, width], i) => {
          const tilt = (i % 2 ? 1 : -1) * (14 + (i % 3) * 7)
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={
                dropDistance
                  ? {
                      y: [-dropDistance, 0, -36, 0, -10, 0],
                      rotate: [tilt, -tilt / 3, tilt / 4, -tilt / 8, tilt / 12, 0],
                      opacity: [0, 1],
                      color: ['#ffffff', '#ffffff', '#ffffff80', '#ffffff45', '#ffffff25', '#ffffff14'],
                    }
                  : { opacity: dropDistance === null ? 0 : 1 }
              }
              transition={
                dropDistance
                  ? {
                      delay: dropOrder[i] * 0.11,
                      duration: 1,
                      times: [0, 0.58, 0.73, 0.86, 0.93, 1],
                      ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn'],
                      opacity: { duration: 0, delay: dropOrder[i] * 0.11 },
                    }
                  : { duration: 0 }
              }
              className="[transform-box:fill-box] [transform-origin:center_bottom] motion-reduce:opacity-100!"
            >
              <text
                className={`${letter} ${i % 2 ? '[--hover-tilt:2deg]' : ''}`}
                x={x}
                y="148"
                textLength={width}
                lengthAdjust="spacingAndGlyphs"
              >
                {char}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-t-transparent bg-(--color-ink-950) bg-[radial-gradient(90%_120%_at_0%_0%,color-mix(in_srgb,var(--color-brand-500)_22%,transparent)_0%,transparent_55%)] pt-16 pb-10 text-sm text-(--color-ink-text) dark:bg-[#050504] dark:bg-[radial-gradient(90%_120%_at_0%_0%,color-mix(in_srgb,var(--color-brand-500)_10%,transparent)_0%,transparent_55%)] dark:text-neutral-400">
      <div className={container}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <BrandLink tone="dark" />
            <p className="mt-5 max-w-sm leading-relaxed">
              VavenCloud, by Vavensoft. One team for your servers, your deployments and your code.
            </p>
            <ul className="mt-6 flex gap-2">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-inherit transition-colors ${line} [&:hover]:border-white [&:hover]:text-white`}
                    aria-label={`VavenCloud on ${s.label}`}
                  >
                    <Icon name={s.icon} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} className="lg:col-span-2" aria-label={col.title}>
              <p className="font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {l.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link to={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <p className="font-semibold text-white">Contact</p>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0" />
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {site.contact.phones.map((p, i) => (
                    <Fragment key={p.href}>
                      {i > 0 && ', '}
                      <a href={p.href} className={`${linkClass} whitespace-nowrap`}>
                        {p.label}
                      </a>
                    </Fragment>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-relaxed">{site.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`relative mt-14 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${line}`}
        >
          <p>
            © <span id="year">{new Date().getFullYear()}</span> {copyrightOwner}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            {/* Plain text for now, not links (as on the live site). To link them, use
                <Link to={l.href} className={linkClass}> in place of the <span> (the paths are in footer.data.ts). */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <span>{l.label}</span>
                </li>
              ))}
            </ul>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      <Wordmark />
    </footer>
  )
}
