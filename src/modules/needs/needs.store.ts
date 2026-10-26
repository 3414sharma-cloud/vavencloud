import { needs, type Need, type NeedId } from './needs.data.ts'

/** The visitor's chosen need, remembered between visits. Sections subscribe with `onNeedChange`. */
const STORAGE_KEY = 'vc-need'
const EVENT = 'vc:needchange'

const findNeed = (id: string | null) => needs.find((n) => n.id === id)

export function getNeed(): Need | undefined {
  try {
    return findNeed(localStorage.getItem(STORAGE_KEY))
  } catch {
    return undefined
  }
}

/** `null` clears the choice. */
export function setNeed(id: NeedId | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* not persisted, still applied for this visit */
  }
  window.dispatchEvent(new CustomEvent<Need | undefined>(EVENT, { detail: findNeed(id) }))
}

/** Runs `callback` with the current need now, then on every change. */
export function onNeedChange(callback: (need: Need | undefined) => void): void {
  window.addEventListener(EVENT, (e) => callback((e as CustomEvent<Need | undefined>).detail))
  callback(getNeed())
}
