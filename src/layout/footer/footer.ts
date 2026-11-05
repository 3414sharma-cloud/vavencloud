import './footer.css'
import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { getThemePreference, onThemeChange, setThemePreference, type ThemePreference } from '@/shared/lib/theme.ts'
import { icon, type IconName } from '@/shared/ui/icons.ts'
import { brandLink } from '@/shared/ui/logo.ts'
import { copyrightOwner, footerColumns, legalLinks } from './footer.data.ts'

const linkClass = 'transition-colors hover:text-neutral-950 dark:hover:text-white'

const themeOptions: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'monitor' },
]

/** System / Light / Dark switch. Native radios, so it works with keyboard and screen readers as-is. */
const themeSwitch = () => `
<fieldset id="theme-switch" class="flex items-center gap-3">
  <legend class="sr-only">Theme</legend>
  <span class="text-xs text-neutral-500" aria-hidden="true">Theme</span>
  <div class="inline-flex rounded-full border border-neutral-200 p-0.5 dark:border-neutral-800">
    ${themeOptions
      .map(
        (o) => `
    <label class="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950 has-checked:bg-neutral-950 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-brand-600 dark:text-neutral-400 dark:hover:text-white dark:has-checked:bg-white dark:has-checked:text-neutral-950">
      <input type="radio" name="theme" value="${o.value}" class="sr-only" />
      ${icon(o.icon, 'h-3.5 w-3.5')}${o.label}
    </label>`,
      )
      .join('')}
  </div>
</fieldset>`

const html = () => `
<footer class="border-t border-neutral-200 bg-neutral-50 pt-16 pb-10 text-sm dark:border-neutral-800 dark:bg-neutral-900/40">
  <div class="container-page">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-3">
        ${brandLink()}
        <p class="mt-5 max-w-sm leading-relaxed">VavenCloud, by Vavensoft. One team for your servers, your deployments and your code.</p>
        <ul class="mt-6 flex gap-2">
          ${site.socials
            .map(
              (s) =>
                `<li><a href="${s.href}" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white" aria-label="VavenCloud on ${s.label}">${icon(s.icon, 'h-4 w-4')}</a></li>`,
            )
            .join('')}
        </ul>
      </div>

      ${footerColumns
        .map(
          (col) => `
      <nav class="lg:col-span-2" aria-label="${col.title}">
        <p class="font-semibold text-neutral-950 dark:text-white">${col.title}</p>
        <ul class="mt-4 space-y-3">
          ${col.links
            .map((l) =>
              l.external
                ? `<li><a href="${l.href}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${l.label}<span class="sr-only"> (opens in a new tab)</span></a></li>`
                : `<li><a href="${l.href}" class="${linkClass}">${l.label}</a></li>`,
            )
            .join('')}
        </ul>
      </nav>`,
        )
        .join('')}

      <div class="lg:col-span-3">
        <p class="font-semibold text-neutral-950 dark:text-white">Contact</p>
        <ul class="mt-4 space-y-3">
          <li class="flex gap-3">${icon('mail', 'mt-0.5 h-4 w-4 shrink-0')}<a href="mailto:${site.contact.email}" class="${linkClass}">${site.contact.email}</a></li>
          <li class="flex gap-3">${icon('phone', 'mt-0.5 h-4 w-4 shrink-0')}<span>${site.contact.phones.map((p) => `<a href="${p.href}" class="${linkClass} whitespace-nowrap">${p.label}</a>`).join(', ')}</span></li>
          <li class="flex gap-3">${icon('map-pin', 'mt-0.5 h-4 w-4 shrink-0')}<span class="leading-relaxed">${site.contact.address}</span></li>
        </ul>
      </div>
    </div>

    <div class="relative mt-14 flex flex-col gap-6 border-t border-neutral-200 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:border-neutral-800">
      <p>© <span id="year"></span> ${copyrightOwner}</p>
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          ${legalLinks.map((l) => `<li><a href="${l.href}" class="${linkClass}">${l.label}</a></li>`).join('')}
        </ul>
        ${themeSwitch()}
      </div>
    </div>

  </div>

  <div class="footer-wordmark mt-14 w-full select-none" aria-hidden="true">
    <svg viewBox="0 0 1000 174" preserveAspectRatio="none" role="presentation" focusable="false">
      <text class="footer-letter" x="0" y="148" textLength="102" lengthAdjust="spacingAndGlyphs">V</text>
      <text class="footer-letter" x="102" y="148" textLength="102" lengthAdjust="spacingAndGlyphs">A</text>
      <text class="footer-letter" x="204" y="148" textLength="102" lengthAdjust="spacingAndGlyphs">V</text>
      <text class="footer-letter" x="306" y="148" textLength="90" lengthAdjust="spacingAndGlyphs">E</text>
      <text class="footer-letter" x="396" y="148" textLength="106" lengthAdjust="spacingAndGlyphs">N</text>
      <text class="footer-letter" x="502" y="148" textLength="104" lengthAdjust="spacingAndGlyphs">C</text>
      <text class="footer-letter" x="606" y="148" textLength="84" lengthAdjust="spacingAndGlyphs">L</text>
      <text class="footer-letter" x="690" y="148" textLength="109" lengthAdjust="spacingAndGlyphs">O</text>
      <text class="footer-letter" x="799" y="148" textLength="104" lengthAdjust="spacingAndGlyphs">U</text>
      <text class="footer-letter" x="903" y="148" textLength="97" lengthAdjust="spacingAndGlyphs">D</text>
    </svg>
  </div>
</footer>`

function initThemeSwitch(): void {
  const radios = qsa<HTMLInputElement>('#theme-switch input[name="theme"]')
  radios.forEach((r) => r.addEventListener('change', () => r.checked && setThemePreference(r.value as ThemePreference)))
  onThemeChange(() => {
    const pref = getThemePreference()
    radios.forEach((r) => (r.checked = r.value === pref))
  })
}

function initWordmark(): void {
  const wordmark = qs<HTMLElement>('.footer-wordmark')
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    wordmark.classList.add('is-visible')
    return
  }
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      wordmark.classList.add('is-visible')
      observer.disconnect()
    },
    { threshold: 0.2 },
  )
  observer.observe(wordmark)
}

export function footer(): Section {
  return {
    html: html(),
    init() {
      qs('#year').textContent = String(new Date().getFullYear())
      initThemeSwitch()
      initWordmark()
    },
  }
}
