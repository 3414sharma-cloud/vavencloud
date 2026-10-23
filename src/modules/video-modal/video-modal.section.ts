import type { Section } from '@/app/types.ts'
import { site } from '@/app/site.config.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'

/** Global video modal. Rendered once per page by createPage(); opened by any [data-video] button. */
export function videoModal(): Section {
  return {
    html: `
<dialog id="video-dialog" class="m-auto w-[min(56rem,92vw)] overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-0 text-white shadow-2xl backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm" aria-labelledby="video-title">
  <div class="flex items-center justify-between border-b border-white/10 px-5 py-3">
    <p id="video-title" class="font-semibold">VavenCloud overview</p>
    <button type="button" data-close class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close video">${icon('x')}</button>
  </div>
  <div id="video-frame" class="flex aspect-video items-center justify-center bg-ink-950 text-slate-400"></div>
</dialog>`,

    init() {
      const dialog = qs<HTMLDialogElement>('#video-dialog')
      const frame = qs<HTMLDivElement>('#video-frame', dialog)

      qsa<HTMLButtonElement>('[data-video]').forEach((btn) =>
        btn.addEventListener('click', () => {
          frame.innerHTML = site.videoUrl
            ? `<iframe class="h-full w-full" src="${site.videoUrl}?autoplay=1" title="VavenCloud overview video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
            : `<div class="text-center"><span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">${icon('play', 'ml-1 h-6 w-6', true)}</span><p class="mt-4 text-sm">Video coming soon.</p></div>`
          dialog.showModal()
        }),
      )
      qs('[data-close]', dialog).addEventListener('click', () => dialog.close())
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close() // click on backdrop
      })
      dialog.addEventListener('close', () => (frame.innerHTML = '')) // stop playback
    },
  }
}
