import { useState, type ButtonHTMLAttributes } from 'react'
import { Icon } from './Icon.tsx'
import { YouTubeFrame } from './YouTubeFrame.tsx'

type PlaySize = 'large' | 'small'

/**
 * The round play button over a video's thumbnail, with a ring pulsing out of it. It grows a little when the
 * thumbnail under it is pointed at (a [data-video-poster] parent). With reduced motion nothing moves.
 */
export function PlayButton({
  size = 'large',
  at = { x: '50%', y: '50%' },
}: {
  size?: PlaySize
  at?: { x: string; y: string }
}) {
  return (
    <span
      className={`absolute z-1 inline-flex ${size === 'large' ? 'size-15' : 'size-12'} items-center justify-center rounded-full bg-white text-brand-600 [box-shadow:0_12px_30px_-8px_rgb(0_0_0/0.6)] [transform:translate(-50%,-50%)] transition-[transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:absolute before:inset-0 before:animate-tm-ring before:rounded-[inherit] before:[box-shadow:0_0_0_0_rgb(255_255_255/0.5)] before:content-[''] motion-reduce:[transition:none] motion-reduce:before:[animation:none] [[data-video-poster]:hover_&]:[transform:translate(-50%,-50%)_scale(1.08)]`}
      style={{ left: at.x, top: at.y }}
      aria-hidden="true"
    >
      <Icon name="play" className="h-5 w-5 translate-x-0.5" filled />
    </span>
  )
}

interface VideoPosterProps {
  /** The YouTube video */
  id: string
  title: string
  /** What the play button says to a screen reader, e.g. "Play the video: Jerry Bopara" */
  label: string
  /** YouTube's thumbnail to show: its largest, or the smaller one that every video has */
  thumbnail?: 'maxresdefault' | 'hqdefault'
  /** Where the play button sits on the thumbnail (default: the middle) */
  play?: { x: string; y: string }
  /** Extra classes for the box, e.g. its corners */
  className?: string
  /** The play button's size: 3.75rem, or 3rem in a small card */
  playSize?: PlaySize
  /** Extra attributes for the play button (data-* hooks) */
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement> & Record<`data-${string}`, string | number>
}

/**
 * A YouTube video as its thumbnail until it's played, then the player (youtube-nocookie, focused as it appears).
 * The thumbnail darkens a little toward its foot and grows slightly under the pointer; the round play button
 * has a ring pulsing out of it. With reduced motion nothing moves.
 */
export function VideoPoster({
  id,
  title,
  label,
  thumbnail = 'maxresdefault',
  play = { x: '50%', y: '50%' },
  className = '',
  playSize = 'large',
  buttonProps,
}: VideoPosterProps) {
  const [playing, setPlaying] = useState(false)
  const size = thumbnail === 'maxresdefault' ? { width: '1280', height: '720' } : { width: '480', height: '360' }
  return (
    <div
      className={`relative aspect-video overflow-hidden bg-neutral-900 [box-shadow:0_16px_34px_-22px_rgb(0_0_0/0.55)] ${className}`}
    >
      {playing ? (
        <YouTubeFrame id={id} title={title} />
      ) : (
        <button
          type="button"
          className="block h-full w-full cursor-pointer after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_40%,rgb(0_0_0/0.45))] after:content-[''] focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-brand-300"
          aria-label={label}
          data-video-poster=""
          {...buttonProps}
          onClick={() => setPlaying(true)}
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/${thumbnail}.jpg`}
            alt=""
            {...size}
            loading="lazy"
            draggable="false"
            className="h-full w-full object-cover transition-[transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] [[data-video-poster]:hover_&]:[transform:scale(1.04)]"
          />
          <PlayButton size={playSize} at={play} />
        </button>
      )}
    </div>
  )
}
