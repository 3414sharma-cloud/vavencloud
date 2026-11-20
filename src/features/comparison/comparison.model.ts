import type { IconName } from '@/components/ui/icons.ts'
import {
  aws,
  awsBusiness,
  azure,
  azureStandard,
  match,
  monthly,
  sizes,
  vavenManaged,
  type Kind,
} from './comparison.data.ts'

/*
 * What the comparison page works out (Comparison.tsx, WiresBoard.tsx): prices per row, the tasks and who does
 * them on each platform, and the fees.
 */

export const usd = (n: number, decimals = 2) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
export const usd0 = (n: number) => usd(n, 0)

/* ---------- Part 1: cloud servers ---------- */

export interface Row {
  size: number
  qty: number
}

/** Where it starts: one of each size */
export const startRows = (): Row[] => sizes.map((_, i) => ({ size: i, qty: 1 }))
/** Always compared against each cloud's steady-performance servers */
export const KIND: Kind = 'steady'

/** One row's prices (monthly, for its quantity) on each cloud */
export function priced(row: Row, kind: Kind) {
  const size = sizes[row.size]
  const a = match(aws[kind], size)
  const z = match(azure[kind], size)
  return {
    size,
    a,
    z,
    aws: monthly(a) * row.qty,
    azure: monthly(z) * row.qty,
    vaven: size.monthly * row.qty,
  }
}

/** The saving is measured against Azure */
export const cheaperOf = (_a: number, z: number) => ({ value: z, name: 'Azure' })

/** " (no 6 vCPU size on AWS)" when the nearest machine is bigger than the size asked for */
export const noSize = (m: { vcpu: number }, wanted: number, cloud: string) =>
  m.vcpu > wanted ? ` (no ${wanted} vCPU size on ${cloud})` : ''

/* ---------- Part 2: someone to run them ---------- */

/* Part 2: explore who owns each task on each provider. */
export type Cover = 'yes' | 'half' | 'you'
export type Who = 'aws' | 'azure' | 'vaven'
interface Layer {
  icon: IconName
  name: string
  cover: Record<Who, [Cover, string]>
}

/** Bottom (what everything sits on) to top (your own code) */
export const layers: Layer[] = [
  {
    icon: 'server',
    name: 'Servers',
    cover: {
      aws: ['yes', 'AWS keeps the hardware on'],
      azure: ['yes', 'Azure keeps the hardware on'],
      vaven: ['yes', 'On your cloud or ours'],
    },
  },
  {
    icon: 'activity',
    name: 'Watching for problems',
    cover: {
      aws: ['you', 'You set it up and watch it'],
      azure: ['you', 'You set it up and watch it'],
      vaven: ['yes', 'Watched by us, 24/7'],
    },
  },
  {
    icon: 'zap',
    name: 'Help when something breaks',
    cover: {
      aws: ['half', 'Advice within 30 min, you fix it'],
      azure: ['half', 'Advice within 1 hour, you fix it'],
      vaven: ['yes', 'Our engineer fixes it'],
    },
  },
  {
    icon: 'rocket',
    name: 'Putting updates live',
    cover: {
      aws: ['you', 'Managed on your side'],
      azure: ['you', 'Managed on your side'],
      vaven: ['yes', 'We handle your updates'],
    },
  },
  {
    icon: 'code',
    name: 'Fixes in your code',
    cover: {
      aws: ['you', 'Not covered'],
      azure: ['you', 'Not covered'],
      vaven: ['yes', 'Within your plan’s hours'],
    },
  },
]

export const studioProviders: { who: Who; name: string; plan: string }[] = [
  { who: 'aws', name: 'AWS', plan: 'Business Support+' },
  { who: 'azure', name: 'Azure', plan: 'Standard support' },
  { who: 'vaven', name: 'VavenCloud', plan: 'Plans / starting price' },
]

/** The monthly support or management fee, for one server (AWS's share of a one-server bill is its $29 minimum) */
export const studioPrices = () => {
  const largest = priced({ size: sizes.length - 1, qty: 1 }, KIND)
  return { aws: awsBusiness(largest.aws), azure: azureStandard, vaven: vavenManaged.managed }
}

export const kindLabel: Record<Cover, string> = {
  yes: 'Handled for you',
  half: 'Advice only, you fix it',
  you: 'You do it',
}
