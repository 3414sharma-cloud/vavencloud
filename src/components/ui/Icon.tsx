import { iconPaths, type IconName } from './icons.ts'

interface IconProps {
  name: IconName
  className?: string
  filled?: boolean
}

/** React version of icon() in icons.ts: the same <svg>, from the same path data. */
export function Icon({ name, className = 'h-5 w-5', filled = false }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      // Path data is a fixed string from iconPaths, never user input
      dangerouslySetInnerHTML={{ __html: iconPaths[name] }}
    />
  )
}
