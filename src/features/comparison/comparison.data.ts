/*
 * The comparison page (/comparison/): what the same servers, and the same cover, cost on AWS, Azure and
 * VavenCloud. Every number is in this file.
 *
 *  - VavenCloud's server prices are read from the price list itself (modules/pricing/pricing.data.ts), so the
 *    page can't drift from it.
 *  - AWS and Azure are list prices, checked on `pricesCheckedOn`. AWS: taken directly from the AWS console
 *    (EC2, US East – Ohio, Linux, on demand). Azure: from Microsoft's public pricing page (Central US, Linux,
 *    pay-as-you-go), since there is no Azure login to check against. The actual price can vary by account.
 *    TODO: confirm the exact Azure prices with Azure login access when available. The support plans are from
 *    AWS's and Azure's own pricing pages. Refresh all of them now and then.
 *  - VavenCloud's plans start from $100 a month (`vavenManaged`), as on the home page; the final fixed fee is
 *    agreed after the free review.
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
    { name: 't2.small', vcpu: 1, ram: 2, hourly: 16.79 / HOURS },
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
  // Monthly list prices (÷ HOURS), as agreed for the comparison table
  steady: [
    { name: 'F1als v7', vcpu: 1, ram: 2, hourly: 44.17 / HOURS },
    { name: 'D2ls v5', vcpu: 2, ram: 4, hourly: 70.15 / HOURS },
    { name: 'D4ls v5', vcpu: 4, ram: 8, hourly: 140.16 / HOURS },
    { name: 'D8ls v5', vcpu: 8, ram: 16, hourly: 280.32 / HOURS },
    { name: 'D8s v5', vcpu: 8, ram: 32, hourly: 316.82 / HOURS },
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

/** The sizes compared: VavenCloud's compute plans, as on the price list (vavencloud.com/cloud-services) */
export const sizes: Size[] = [
  { name: 'VPS Micro', vcpu: 1, ram: 2, disk: '40 GB SSD', monthly: 12 },
  { name: 'VPS Small', vcpu: 2, ram: 4, disk: '50 GB SSD', monthly: 24 },
  { name: 'VPS Medium', vcpu: 4, ram: 8, disk: '80 GB SSD', monthly: 48 },
  { name: 'VPS Large', vcpu: 6, ram: 16, disk: '100 GB SSD', monthly: 90 },
  { name: 'VPS XL', vcpu: 8, ram: 32, disk: '120 GB SSD', monthly: 120 },
]

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

/** Azure's plans are flat monthly fees */
export const azureStandard = 100

/**
 * VavenCloud's "from" price a month, matching "From $100/month" on the plans (home/plans/plans.data.ts), FAQ and
 * home compare table. Partner is no longer shown on the page.
 */
export const vavenManaged = { managed: 100, partner: 1_499 }
