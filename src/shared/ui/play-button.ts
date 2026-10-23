import { icon } from './icons.ts'

/** Round play button. Any element with [data-video] opens the global video modal. */
export function playButton(label: string, size = 'h-16 w-16'): string {
  return `
<button type="button" data-video class="group/play relative flex ${size} items-center justify-center rounded-full bg-white text-brand-600 shadow-2xl shadow-brand-500/40 transition hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label="${label}">
  <span class="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" aria-hidden="true"></span>
  ${icon('play', 'relative ml-1 h-1/3 w-1/3', true)}
</button>`
}
