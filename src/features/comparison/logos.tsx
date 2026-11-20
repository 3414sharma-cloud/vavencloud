import { LogoMark } from '@/components/ui/Logo.tsx'
import { brandLogos } from '@/features/shared/brand-logos.ts'
import type { Who } from './comparison.model.ts'

/** A cloud's logo (as in the logo strip under the hero), with its name for screen readers */
export function ProviderLogo({ name, svgClassName }: { name: 'AWS' | 'Azure'; svgClassName?: string }) {
  const l = brandLogos[name]
  if (!l) return name
  const [, , w, h] = l.viewBox.split(' ').map(Number)
  const height = l.wordmark ? 24 : 20
  return (
    <>
      <svg
        width={Math.round((height * w) / h)}
        height={height}
        viewBox={l.viewBox}
        fill="currentColor"
        className={svgClassName}
        aria-hidden="true"
        // Fixed SVG paths from brand-logos.ts
        dangerouslySetInnerHTML={{ __html: l.body }}
      />
      <span className={l.wordmark ? 'sr-only' : undefined}>{name}</span>
    </>
  )
}

/** "VavenCloud", in our colour unless the place it's in says otherwise */
export const VavenName = ({ className = 'font-bold text-brand-700 dark:text-brand-300' }: { className?: string }) => (
  <span className={className}>VavenCloud</span>
)

interface PlatformLogoProps {
  who: Who
  /** Classes for a cloud's logo, for our mark, and for our name, where they need sizing */
  svgClassName?: string
  markClassName?: string
  nameClassName?: string
}

/** A platform's logo: AWS's or Azure's, or our mark and name */
export const PlatformLogo = ({ who, svgClassName, markClassName = '', nameClassName }: PlatformLogoProps) =>
  who === 'vaven' ? (
    <>
      <LogoMark size={24} className={markClassName} />
      <VavenName className={nameClassName} />
    </>
  ) : (
    <ProviderLogo name={who === 'aws' ? 'AWS' : 'Azure'} svgClassName={svgClassName} />
  )
