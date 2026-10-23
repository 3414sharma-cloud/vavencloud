/** querySelector that fails loudly when the element is missing (catches template typos early). */
export function qs<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector)
  if (!el) throw new Error(`Element not found: ${selector}`)
  return el
}

/** querySelectorAll as a real array. */
export function qsa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return [...root.querySelectorAll<T>(selector)]
}
