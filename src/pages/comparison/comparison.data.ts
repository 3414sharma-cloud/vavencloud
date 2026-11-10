import { planGroups } from '@/modules/pricing/pricing.data.ts'

/*
 * The comparison page (/comparison/): what the same servers, and the same cover, cost on AWS, Azure and
 * VavenCloud. Every number is in this file.
 *
 *  - VavenCloud's server prices are read from the price list itself (modules/pricing/pricing.data.ts), so the
 *    page can't drift from it.
 *  - AWS and Azure are public list prices, checked on `pricesCheckedOn`: Azure from its retail price API
 *    (prices.azure.com, East US, Linux, pay-as-you-go), AWS from its EC2 price list (US East N. Virginia, Linux,
 *    on-demand), and the support plans from AWS's and Azure's own pricing pages. Refresh them now and then.
 *  - TODO before launch: the VavenCloud managed-service fees below are PLACEHOLDERS. Plans are "a fixed monthly
 *    fee, agreed after your free review" (docs/messaging.md says no prices on the page), so there is no public
 *    number yet. Put the real "from" prices in `vavenManaged`, or decide not to show any.
 */

export const pricesCheckedOn = '10 Nov 2026'

/** Hours in a month, as cloud price calculators count them (365 × 24 ÷ 12) */
export const HOURS = 730

/* ---------- Cloud servers ---------- */

export type Kind = 'steady' | 'burst'

export interface Machine {
  name: string
  vcpu: number
  /** GB */
  ram: number
  /** USD an hour, on demand, Linux */
  hourly: number
}

/**
 * `steady` is what you'd run production on (compute-optimised and general purpose, full performance all the
 * time). `burst` is the cheapest family on each cloud (T3 and B-series): fine for light, spiky workloads, and
 * the fairest test of VavenCloud's price, so the page lets you switch between the two.
 */
export const aws: Record<Kind, Machine[]> = {
  steady: [
    { name: 'c6i.large', vcpu: 2, ram: 4, hourly: 0.085 },
    { name: 'c6i.xlarge', vcpu: 4, ram: 8, hourly: 0.17 },
    { name: 'c6i.2xlarge', vcpu: 8, ram: 16, hourly: 0.34 },
    { name: 'm6i.large', vcpu: 2, ram: 8, hourly: 0.096 },
    { name: 'm6i.xlarge', vcpu: 4, ram: 16, hourly: 0.192 },
    { name: 'm6i.2xlarge', vcpu: 8, ram: 32, hourly: 0.384 },
    { name: 'm6i.4xlarge', vcpu: 16, ram: 64, hourly: 0.768 },
  ],
  burst: [
    { name: 't3.small', vcpu: 2, ram: 2, hourly: 0.0208 },
    { name: 't3.medium', vcpu: 2, ram: 4, hourly: 0.0416 },
    { name: 't3.large', vcpu: 2, ram: 8, hourly: 0.0832 },
    { name: 't3.xlarge', vcpu: 4, ram: 16, hourly: 0.1664 },
    { name: 't3.2xlarge', vcpu: 8, ram: 32, hourly: 0.3328 },
  ],
}

export const azure: Record<Kind, Machine[]> = {
  steady: [
    { name: 'F2s v2', vcpu: 2, ram: 4, hourly: 0.0846 },
    { name: 'F4s v2', vcpu: 4, ram: 8, hourly: 0.169 },
    { name: 'F8s v2', vcpu: 8, ram: 16, hourly: 0.338 },
    { name: 'D2s v5', vcpu: 2, ram: 8, hourly: 0.096 },
    { name: 'D4s v5', vcpu: 4, ram: 16, hourly: 0.192 },
    { name: 'D8s v5', vcpu: 8, ram: 32, hourly: 0.384 },
    { name: 'D16s v5', vcpu: 16, ram: 64, hourly: 0.768 },
  ],
  burst: [
    { name: 'B1ms', vcpu: 1, ram: 2, hourly: 0.0207 },
    { name: 'B2s', vcpu: 2, ram: 4, hourly: 0.0416 },
    { name: 'B2ms', vcpu: 2, ram: 8, hourly: 0.0832 },
    { name: 'B4ms', vcpu: 4, ram: 16, hourly: 0.166 },
    { name: 'B8ms', vcpu: 8, ram: 32, hourly: 0.333 },
  ],
}

export interface Size {
  /** VavenCloud's own plan name, e.g. "VPS Small" */
  name: string
  vcpu: number
  ram: number
  /** e.g. "50 GB SSD" */
  disk: string
  /** USD a month, as on the price list */
  monthly: number
}

/** The sizes you can choose from: VavenCloud's compute plans, from the price list */
export const sizes: Size[] = planGroups
  .find((g) => g.id === 'cloud-services')!
  .categories.find((c) => c.id === 'compute')!
  .plans.map((p) => ({
    name: p.name,
    vcpu: parseInt(p.features[0], 10),
    ram: parseInt(p.features[1], 10),
    disk: p.features[2],
    monthly: Number(p.price.replace(/[^0-9.]/g, '')),
  }))

export const monthly = (m: Machine) => m.hourly * HOURS

/** The cheapest machine with at least that many vCPUs and that much RAM */
export function match(list: Machine[], size: Size): Machine {
  const fits = list.filter((m) => m.vcpu >= size.vcpu && m.ram >= size.ram)
  return fits.reduce((best, m) => (m.hourly < best.hourly ? m : best))
}

/* ---------- Managed service ---------- */

/** What you pay to have the cloud's own people on call, at a monthly cloud bill of `spend` */
const tiered = (spend: number, tiers: [upTo: number, rate: number][]) => {
  let fee = 0
  let from = 0
  for (const [upTo, rate] of tiers) {
    fee += Math.max(Math.min(spend, upTo) - from, 0) * rate
    from = upTo
  }
  return fee
}

/** AWS Business Support+: the greater of $29 and 9% of the first $10K, 7% to $80K, 5% to $250K, 3% above */
export const awsBusiness = (spend: number) =>
  Math.max(
    29,
    tiered(spend, [
      [10_000, 0.09],
      [80_000, 0.07],
      [250_000, 0.05],
      [Infinity, 0.03],
    ]),
  )

/** AWS Enterprise Support: the greater of $5,000 and 10% of the first $150K, 7% to $500K, 5% to $1M, 3% above */
export const awsEnterprise = (spend: number) =>
  Math.max(
    5_000,
    tiered(spend, [
      [150_000, 0.1],
      [500_000, 0.07],
      [1_000_000, 0.05],
      [Infinity, 0.03],
    ]),
  )

/** Azure's plans are flat monthly fees */
export const azureStandard = 100
export const azureProfessionalDirect = 1_000

/** PLACEHOLDER fixed monthly fees: see the TODO at the top of this file */
export const vavenManaged = { managed: 499, partner: 1_499 }

/** The monthly cloud bills you can choose from */
export const spendOptions = [500, 1_000, 2_500, 5_000, 10_000, 25_000]

/** From the content doc: what hiring one senior DevOps engineer in the US costs, a year */
export const hireAnnual = 140_000

export interface Facts {
  label: string
  aws: string
  azure: string
  vaven: string
}

/** The rows that don't change with your bill */
export const managedFacts: Facts[] = [
  {
    label: 'Answer to a critical outage',
    aws: 'Within 30 minutes on Business Support+, 15 on Enterprise',
    azure: 'Within 1 hour on both Standard and Professional Direct',
    vaven: 'Within 1 hour on Managed, 30 minutes on Partner',
  },
  {
    label: 'Who fixes it',
    aws: 'Guidance and troubleshooting on AWS services. Running your product stays with your team.',
    azure: 'Technical help with Azure issues. Running your product stays with your team.',
    vaven: 'Our engineers: servers, deployments and monitoring, on call 24/7',
  },
  {
    label: 'Fixes in your own code',
    aws: 'No',
    azure: 'No',
    vaven: 'Yes, within your plan’s monthly hours',
  },
  {
    label: 'Hands-on managed operations',
    aws: 'Not in the support plans. AWS Managed Services is a separate product, quote-only, with no public price.',
    azure: 'Not in the support plans',
    vaven: 'Included',
  },
  {
    label: 'How the price works',
    aws: 'The greater of a minimum or a percentage of your monthly AWS bill',
    azure: 'A flat monthly fee per plan',
    vaven: 'One fixed monthly fee, agreed after a free review',
  },
]
