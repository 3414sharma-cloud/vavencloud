export const prefersReducedMotion = (): boolean =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export const isMobileViewport = (): boolean => window.matchMedia('(max-width: 768px)').matches
