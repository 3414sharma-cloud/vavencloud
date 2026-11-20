import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { Icon } from '@/components/ui/Icon.tsx'
import { emergency } from '@/features/home/booking/booking.data.ts'
import { btnPrimary } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/*
 * Phones only (hidden from 640px): a bar at the foot of the screen with the booking button and the emergency line, so the
 * next step is never more than a tap away however far down the story a visitor is. It shows once the hero
 * (#top) has scrolled away and goes again at the booking form (#book, where it would only repeat it). While
 * hidden it is inert and hidden from screen readers. For a page that has both.
 */
/** The bar: frosted, along the foot of the screen, above the safe area on a phone with a home bar */
const bar = [
  'fixed inset-x-0 bottom-0 z-40 flex gap-[0.6rem] border-t border-t-neutral-200 px-4 pt-[0.7rem] pb-[calc(0.7rem+env(safe-area-inset-bottom))]',
  'bg-[color-mix(in_srgb,var(--color-paper)_94%,transparent)] [backdrop-filter:blur(12px)] sm:hidden',
  'dark:border-t-neutral-800 dark:bg-[color-mix(in_srgb,var(--color-neutral-950)_94%,transparent)]',
].join(' ')
/** Slid below the screen and hidden until it's wanted; it slides up when shown (and simply appears with reduced motion) */
const hiddenCls =
  'invisible [transform:translateY(110%)] [transition:transform_0.35s_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_0.35s] motion-reduce:[transition:none]'
const shownCls =
  'visible [transform:none] [transition:transform_0.35s_cubic-bezier(0.22,1,0.36,1),visibility_0s_linear_0s] motion-reduce:[transition:none]'

export function StickyCta() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    const book = document.getElementById('book')
    if (!hero || !book) return
    let frame = 0
    const update = () => {
      frame = 0
      setShown(hero.getBoundingClientRect().bottom < 0 && book.getBoundingClientRect().top > window.innerHeight)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={`${bar} ${shown ? shownCls : hiddenCls}`} data-sticky-cta="" aria-hidden={!shown} inert={!shown}>
      <Link to={routes.book} className={cn(btnPrimary, 'flex-1 !py-3')}>
        Book a free review <Icon name="arrow-right" className="h-4 w-4" />
      </Link>
      <a
        href={emergency.href}
        className="inline-flex w-12 flex-none items-center justify-center rounded-full border border-neutral-300 text-brand-700 dark:border-neutral-700 dark:text-brand-300"
        aria-label={`Site down right now? Call ${emergency.label}`}
      >
        <Icon name="phone" className="h-5 w-5" />
      </a>
    </div>
  )
}
