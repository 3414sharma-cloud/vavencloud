import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading.tsx'
import { stages } from './stages.data.ts'
import { useStageFill } from './useStageFill.ts'
import { useStageMarquee } from './useStageMarquee.ts'
import { container } from '@/components/ui/classes.ts'

/*
 * Where are you today: the five moments founders come to us, in order from idea to "nobody owns it". Each card
 * is a photo of that moment under a dark wash, with the moment in large type, the worry in their words and what
 * we do about it in a light panel at its foot. The cards run along one row that moves by itself
 * (useStageMarquee.ts) and can be dragged; pointing at a card, or tabbing to one, stops the row and lifts the card
 * a little. Cards near the row's ends fade (--stage-edge-mask, set by the script). The hooks find the row, the
 * cards and their parts by their data-stage* attributes.
 */

/** A card: the photo fills it, its text sits at the foot */
const card = [
  'relative isolate flex flex-[0_0_min(82vw,21rem)] flex-col justify-end overflow-hidden rounded-3xl p-4',
  'min-h-[29rem] max-[640px]:min-h-[28rem] bg-[#142c40] text-(--color-ink-text) [box-shadow:0_14px_32px_-22px_rgb(12_34_54/45%)]',
  '[mask-image:var(--stage-edge-mask,none)] [transition:transform_0.35s_ease,box-shadow_0.35s_ease]',
  // Pointed at or tabbed to: lifted, its photo a little closer; not faded at the row's ends
  '[&:is(:hover,:focus-visible)]:z-2 [&:is(:hover,:focus-visible)]:[transform:translateY(-6px)] [&:is(:hover,:focus-visible)]:[mask-image:none]',
  '[&:is(:hover,:focus-visible)]:[box-shadow:0_22px_40px_-22px_rgb(12_34_54/55%)]',
  '[html:not(.dark)_&:is(:hover,:focus-visible)]:text-neutral-600',
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-500',
  // While the row is being dragged, the cards don't react to the pointer passing over them
  '[[data-stage-marquee].is-dragging_&]:pointer-events-none',
  'motion-reduce:[transition:none]! motion-reduce:[&_*]:[transition:none]!',
].join(' ')

/** The parts whose colours ease as the card changes (each at its own beat, --d, from useStageFill) */
const part =
  '[transition-property:color,fill,stroke,background-color,border-color] duration-[350ms] [transition-timing-function:ease]'

export function Stages() {
  const marquee = useRef<HTMLDivElement>(null)
  useStageFill(marquee)
  useStageMarquee(marquee)
  return (
    <section
      id="stages"
      className="py-20 sm:py-26 border-t border-neutral-200 pt-14! pb-12! dark:border-neutral-800"
      aria-labelledby="stages-title"
    >
      <div className={container}>
        <div className="max-w-5xl">
          <SectionHeading
            id="stages-title"
            title="Wherever you are, <em>one team takes it from here.</em>"
            description="Founders come to us at five different moments. Find yours."
          />
        </div>
        {/*
          The row's frame: room at the sides and above and below for a card's lift and its shadow (pulled back out
          at the sides, so the cards still line up with the page). Grab to drag once the script runs (.is-js).
        */}
        <div
          ref={marquee}
          className="-mx-5 mt-6 mb-0 overflow-hidden px-5 pt-6 pb-8 [&.is-dragging]:cursor-grabbing [&.is-js]:cursor-grab [&.is-js]:touch-pan-y [&.is-js]:select-none"
          data-stage-marquee=""
        >
          <div className="flex w-max [[data-stage-marquee].is-js_&]:will-change-transform" data-stage-track="">
            {/* The gap after the last card too, so both copies of the row are exactly the same width */}
            <ol className="flex flex-none gap-4 pr-4" data-stage-group="">
              {stages.map((s) => (
                <li key={s.id} className={card} tabIndex={0} data-stage="">
                  <div
                    className={`absolute inset-0 -z-2 flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-[inherit] bg-[#f4f6f8] ${part} [transition-delay:var(--d,0.2s)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgb(10_26_40/8%)_12%,rgb(10_26_40/58%)_43%,#10293e_75%)] after:content-['']`}
                    data-stage-part=""
                  >
                    <img
                      src={`/images/stages/${s.id}.webp`}
                      alt=""
                      width="768"
                      height="512"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="block h-full w-full object-cover object-[50%_20%] [transition:transform_0.8s_ease] [[data-stage]:is(:hover,:focus-visible)_&]:[transform:scale(1.045)]"
                    />
                  </div>
                  <div className="mt-36 flex flex-col p-0 max-[640px]:mt-32">
                    <span className="mb-[0.7rem] text-[0.6rem] font-[650] tracking-[0.16em] text-[#a9d7f7] uppercase">
                      Your next chapter
                    </span>
                    <h3
                      className={`m-0 text-[2.05rem] leading-[1.08] font-[650] tracking-[-0.04em] text-balance text-white [text-shadow:0_2px_12px_rgb(5_20_34/30%)] max-[640px]:text-[1.85rem] ${part} [transition-delay:0s]`}
                      data-stage-part=""
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`mt-3 mb-4 text-[0.85rem] leading-[1.6] text-[#d2e0ec] not-italic ${part} [transition-delay:0s]`}
                      data-stage-part=""
                    >
                      {s.worry}
                    </p>
                    <p
                      className={`mt-auto min-h-[6.5rem] rounded-[0.9rem] bg-[#f7fbff] p-4 text-[0.85rem] leading-[1.55] text-[#43586b] dark:bg-[#1c3349] dark:text-[#d2e0ec] ${part} [transition-delay:0s]`}
                      data-stage-part=""
                    >
                      <b
                        className={`mb-[0.6rem] flex items-center justify-between text-[0.62rem] font-bold tracking-[0.12em] text-[#176b9e] uppercase after:text-[1.2rem] after:leading-none after:font-normal after:content-['↗'] dark:text-[#96d1f8] ${part} [transition-delay:0s]`}
                      >
                        How we help
                      </b>
                      {s.answer}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
