import { routes } from '@/app/routes.ts'
import { qs, qsa } from '@/shared/lib/dom.ts'
import { icon } from '@/shared/ui/icons.ts'
import { needs, type Need, type NeedId } from './needs.data.ts'
import { onNeedChange, setNeed } from './needs.store.ts'

const option = (n: Need) => `
  <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 has-checked:border-brand-600 has-checked:text-neutral-950 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-600 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:has-checked:border-brand-400 dark:has-checked:text-white">
    <input type="radio" name="need" value="${n.id}" class="h-4 w-4 shrink-0 accent-brand-600" />
    ${icon(n.icon, 'h-4 w-4 shrink-0 text-neutral-500')}
    <span>${n.label}</span>
  </label>`

const emptyResult = `
  <p class="text-sm leading-relaxed text-neutral-500">
    Pick the closest match and we'll show you the right setup and a starting price. The rest of the page adapts to your choice.
  </p>`

const result = (n: Need) => `
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="text-xs font-medium tracking-wide text-neutral-500 uppercase">Recommended for you</p>
      <p class="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">${n.title}</p>
    </div>
    <p class="shrink-0 text-right text-xs text-neutral-500">Starting at<span class="block text-sm font-semibold text-neutral-950 dark:text-white">${n.from}</span></p>
  </div>
  <p class="mt-2 text-sm leading-relaxed">${n.summary}</p>
  <ul class="mt-4 space-y-2 text-sm">
    ${n.points.map((p) => `<li class="flex gap-2">${icon('check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400')}${p}</li>`).join('')}
  </ul>
  <div class="mt-5 flex flex-wrap gap-3">
    ${n.planTab ? `<a href="${routes.plans}" class="btn-primary">See plans</a>` : ''}
    <a href="${routes.contact}" class="${n.planTab ? 'btn-secondary' : 'btn-primary'}">${n.planTab ? 'Ask a question' : 'Get a quote'}</a>
  </div>`

/** "What are you looking for?" card in the hero. The choice is stored and shared via needs.store.ts. */
export function needsPicker(): string {
  return `
<div id="needs-picker" class="card p-6 shadow-sm sm:p-7">
  <fieldset>
    <legend class="text-base font-semibold text-neutral-950 dark:text-white">Where is your product today?</legend>
    <div class="mt-4 grid gap-2">${needs.map(option).join('')}</div>
  </fieldset>
  <div class="mt-5 border-t border-neutral-200 pt-5 dark:border-neutral-800">
    <div id="needs-result" aria-live="polite">${emptyResult}</div>
    <button type="button" id="needs-reset" class="mt-4 hidden text-xs font-medium text-neutral-500 underline-offset-4 hover:text-neutral-950 hover:underline dark:hover:text-white">Clear my choice</button>
  </div>
</div>`
}

export function initNeedsPicker(): void {
  const picker = qs('#needs-picker')
  const radios = qsa<HTMLInputElement>('input[name="need"]', picker)
  const output = qs('#needs-result', picker)
  const reset = qs<HTMLButtonElement>('#needs-reset', picker)

  radios.forEach((r) => r.addEventListener('change', () => r.checked && setNeed(r.value as NeedId)))
  reset.addEventListener('click', () => {
    setNeed(null)
    radios[0]?.focus()
  })

  onNeedChange((need) => {
    radios.forEach((r) => (r.checked = r.value === need?.id))
    output.innerHTML = need ? result(need) : emptyResult
    reset.classList.toggle('hidden', !need)
  })
}
