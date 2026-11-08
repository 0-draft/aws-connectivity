import { DX_AS_OF } from "./asOf";

/**
 * The one Direct Connect price list on the site. Both the road map's cost lab
 * (@/features/cost/cost) and the deep dive's pricing section read DX prices
 * from here, and docs/direct-connect/10-pricing.md is the matching research
 * note. Monthly figures use 730 hours, as AWS's own examples do.
 *
 * Sources, all read on DX_AS_OF (2026-10-12):
 * - Pay-as-you-go port-hours, the DTO matrix and SiteLink:
 *   https://aws.amazon.com/directconnect/pricing/
 * - The Japan columns, cross-checked against the AWS Price List API
 *   (Direct Connect offer for ap-northeast-1 / ap-northeast-3).
 * - Flat-rate tiers and AWS's worked example:
 *   https://aws.amazon.com/directconnect/pricing/flat-rate/ and
 *   https://docs.aws.amazon.com/directconnect/latest/PricingGuide/pricing-flat-rate.html
 *
 * The road map's own AS_OF (2026-10-10) is older: its non-DX prices were read
 * then. The Japan DX values here were unchanged between the two reads.
 */

export const HOURS_PER_MONTH = 730;
export const PRICES_AS_OF = DX_AS_OF;

export type ConnType = "dedicated" | "hosted";

/** Port-hour price by capacity in Mbps: [non-Japan, Japan]. */
export const PORT_HOURLY: Record<ConnType, Record<number, [number, number]>> = {
  dedicated: {
    1000: [0.3, 0.285],
    10000: [2.25, 2.142],
    100000: [22.5, 22.5],
    400000: [85, 85],
  },
  hosted: {
    50: [0.03, 0.029],
    100: [0.06, 0.057],
    200: [0.08, 0.076],
    300: [0.12, 0.114],
    400: [0.16, 0.152],
    500: [0.2, 0.19],
    1000: [0.33, 0.314],
    2000: [0.66, 0.627],
    5000: [1.65, 1.568],
    10000: [2.48, 2.361],
    25000: [6.2, 6.2],
  },
};

export const SOURCE_REGIONS = [
  "us",
  "europe",
  "tokyo-osaka",
  "apac-other",
  "india",
  "australia",
  "south-america",
] as const;
export type SourceRegion = (typeof SOURCE_REGIONS)[number];

export const DX_GEOS = ["us", "europe", "japan", "apac", "australia"] as const;
export type DxGeo = (typeof DX_GEOS)[number];

/** Data transfer out, USD/GB: source Region group → DX location geography. */
export const DTO_PER_GB: Record<SourceRegion, Record<DxGeo, number>> = {
  us: { us: 0.02, europe: 0.02, japan: 0.0491, apac: 0.0491, australia: 0.06 },
  europe: { us: 0.0282, europe: 0.02, japan: 0.06, apac: 0.06, australia: 0.06 },
  "tokyo-osaka": { us: 0.09, europe: 0.06, japan: 0.041, apac: 0.041, australia: 0.1132 },
  "apac-other": { us: 0.09, europe: 0.09, japan: 0.042, apac: 0.041, australia: 0.1107 },
  india: { us: 0.085, europe: 0.085, japan: 0.1132, apac: 0.1, australia: 0.11 },
  australia: { us: 0.13, europe: 0.13, japan: 0.1132, apac: 0.1107, australia: 0.042 },
  "south-america": { us: 0.15, europe: 0.1107, japan: 0.17, apac: 0.17, australia: 0.18 },
};

/**
 * Flat-rate (launched 2026-09-15, per
 * https://aws.amazon.com/about-aws/whats-new/2026/09/aws-direct-connect-announces-flat-rate-pricing/),
 * dedicated 10G and 100G only, USD per hour for a
 * single port or a whole port-pair (a pair costs the same as one port).
 * Tiers 1-3 as listed for the Japan locations; AWS's own Ashburn example
 * (10G Tier 1 port-pair at Equinix DC2) is the same $10.96/hour.
 */
export const FLAT_RATE_HOURLY: Record<10000 | 100000, [number, number, number]> = {
  10000: [10.96, 17.12, 23.29],
  100000: [102.74, 160.96, 219.18],
};

/**
 * AWS's published flat-rate example (10G Tier 1 port-pair at Equinix DC2,
 * $10.96/hour), compared with two pay-as-you-go 10G ports at the US → US
 * data-transfer rate.
 */
export const FLAT_RATE_EXAMPLE = {
  hourly: FLAT_RATE_HOURLY[10000][0],
  paygPortHourly: PORT_HOURLY.dedicated[10000][0],
  paygPorts: 2,
  dtoPerGb: DTO_PER_GB.us.us,
} as const;

export interface Estimate {
  type: ConnType;
  mbps: number;
  count: number;
  dxGeo: DxGeo;
  source: SourceRegion;
  gbOut: number;
}

export interface Breakdown {
  portHourly: number;
  port: number;
  dto: number;
  total: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function portHourly(type: ConnType, mbps: number, dxGeo: DxGeo): number {
  const row = PORT_HOURLY[type][mbps];
  if (!row) throw new Error(`no ${type} port at ${mbps} Mbps`);
  return dxGeo === "japan" ? row[1] : row[0];
}

export function estimate(e: Estimate): Breakdown {
  const hourly = portHourly(e.type, e.mbps, e.dxGeo);
  const port = round2(hourly * HOURS_PER_MONTH * e.count);
  const dto = round2(e.gbOut * DTO_PER_GB[e.source][e.dxGeo]);
  return { portHourly: hourly, port, dto, total: round2(port + dto) };
}

/**
 * Monthly egress (GB) above which a flat-rate price beats pay-as-you-go ports
 * plus DTO. Returns 0 if flat-rate is already cheaper with no traffic.
 */
export function breakEvenGb(
  flatHourly: number,
  paygPortHourly: number,
  paygPorts: number,
  dtoPerGb: number,
): number {
  const gap = (flatHourly - paygPortHourly * paygPorts) * HOURS_PER_MONTH;
  return gap <= 0 ? 0 : gap / dtoPerGb;
}
