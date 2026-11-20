/**
 * YouTube's player (youtube-nocookie), already playing, focused as it appears. Shown in place of a video's
 * thumbnail once it's pressed (the landing page's "behind" and client stories, the team page). It fills its box.
 */
export function YouTubeFrame({ id, title }: { id: string; title: string }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="h-full w-full border-0"
      ref={(el) => el?.focus()}
    />
  )
}
