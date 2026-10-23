import { icon, type IconName } from '@/shared/ui/icons.ts'
import { trustedBy } from './hero.data.ts'

const logoIcons: IconName[] = ['cloud', 'globe', 'zap', 'shield']

/** Auto-scrolling "Trusted by" strip shown at the bottom of the hero. */
export const logoCloud = () => `
<div class="relative mt-16 w-full" role="region" aria-label="Trusted by">
  <p class="text-center text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Trusted by fast-growing teams worldwide</p>
  <div class="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
    <ul class="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
      ${[...trustedBy, ...trustedBy]
        .map(
          (name, i) => `
      <li class="flex items-center gap-2 text-xl font-bold text-white/45 transition hover:text-white" ${i >= trustedBy.length ? 'aria-hidden="true"' : ''}>
        ${icon(logoIcons[i % logoIcons.length], 'h-6 w-6')}${name}
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</div>`
