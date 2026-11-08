# aws-connectivity

[![ci](https://github.com/0-draft/aws-connectivity/actions/workflows/ci.yml/badge.svg)](https://github.com/0-draft/aws-connectivity/actions/workflows/ci.yml)

Every way from a corporate network into AWS, drawn as a road map. A bilingual (English / 日本語) interactive explainer that puts the internet, Site-to-Site VPN, Direct Connect, SD-WAN, the AWS-side hubs (virtual private gateway, Direct Connect gateway, Transit Gateway, Cloud WAN), PrivateLink, hybrid DNS, user access and Outposts on one map, then lets you drive each road: predict what AWS will do, then step through why.

**Site:** <https://0-draft.github.io/aws-connectivity/> ([日本語](https://0-draft.github.io/aws-connectivity/?lang=ja))

Formerly `0-draft/on-ramp` (renamed 2026-11-08; the old site URL no longer serves).

[日本語の README](README.ja.md)

## What is in it

| Exit | Section | Interactive part |
| --- | --- | --- |
| — | Map | Every route on one interchange map; step a packet hop by hop along any of them |
| 1 | Why hard? | The "we have Direct Connect, so we're private" gap lab; ranked confusion points linked to the exit that untangles each |
| 2 | Rules of the road | CIDR slider, longest-prefix gantry signs, BGP, the three layers, where each kind of encryption applies |
| 3 | Internet | Hop-by-hop walk to a public endpoint; S3 bucket-policy lab (`aws:SourceIp` vs `aws:SourceVpce`) |
| 4 | VPN | Tunnel failover stepper; throughput lab for VGW, Transit Gateway and Cloud WAN (ECMP, large tunnels) |
| 5 | Direct Connect | Who owns which stretch, VIF types, 閉域 ≠ 暗号化 — then deep links into the [Direct Connect deep dive](https://0-draft.github.io/aws-connectivity/direct-connect/) |
| 6 | Hubs | Scale lab (VPCs × Regions × sites across four designs, with quotas); appliance-mode stepper |
| 7 | SD-WAN | Encapsulation cutaway (GRE inside an attachment); Connect capacity lab |
| 8 | Path selection | Same routes, three hubs, three answers: VGW vs Transit Gateway vs Cloud WAN decision ladder |
| 9 | PrivateLink | Which endpoint types are reachable from on-prem, and why |
| 10 | DNS | Step-through of hybrid lookups through Route 53 VPC Resolver endpoints, including the broken one |
| 11 | People | Client VPN vs Verified Access vs Session Manager vs EC2 Instance Connect Endpoint vs WorkSpaces |
| 12 | Edge & data | Outposts routing modes, Local Zone hairpin, bulk-transfer calculator |
| 13 | MTU | Header inspector and a low-clearance packet-size lab |
| 14 | Cost | Tokyo monthly cost per road, as toll-booth bars |
| 15 | Plan yours | Questionnaire → recommended topology and anti-patterns |
| 16–18 | Quiz, timeline, glossary | Myth-or-fact cards, launches 2009–2026, EN/JA glossary |

The research behind every number lives in [`docs/`](docs/README.md), with sources. Facts were verified against AWS documentation, What's New posts and the AWS Price List API on 2026-10-10.

## Direct Connect deep dive

The map is every road; the second page, **[Direct Connect, up close](https://0-draft.github.io/aws-connectivity/direct-connect/)** ([日本語](https://0-draft.github.io/aws-connectivity/direct-connect/?lang=ja)), drives one of them part by part. The Direct Connect exit on the map summarizes and links there instead of repeating it. It was the separate [0-draft/cross-connect](https://github.com/0-draft/cross-connect) site until 2026-11-08; its research notes are in [`docs/direct-connect/`](docs/direct-connect/README.md), and its Direct Connect price list is now the only one on the site (`src/data/dxPricing.ts`, documented in [`docs/direct-connect/10-pricing.md`](docs/direct-connect/10-pricing.md)).

| Section | Interactive part |
| --- | --- |
| Why is it hard? | The four root causes, a layer map with tap-to-define terms, who owns what, and the common traps linked to where each is untangled |
| Overview | Clickable end-to-end path: router, carrier, cage, cross connect, DX router, VIFs, gateways |
| Connections | Speed ladder, dedicated vs hosted, step-by-step LOA-CFA ordering |
| LAG and MACsec | Cut LAG members and watch minimum links; `should_encrypt` vs `must_encrypt` |
| Virtual interfaces | Switch private / public / transit and see what each reaches |
| Direct Connect gateway | VGW / TGW / Cloud WAN modes, allowed-prefix lab, SiteLink toggle |
| BGP | Path selection lab: prefix length, `7224:7x00` communities, AS_PATH prepend, home Region, VPN backup, and an asymmetric-routing warning when your outbound choice disagrees with AWS |
| Resiliency | Failure lab for the Maximum / High / Dev-Test / Classic models |
| Security | Which segment MACsec, IPsec and TLS protect |
| Operations | Yes/no troubleshooting tree, metrics worth an alarm |
| Pricing | Monthly estimate from list prices, flat-rate break-even |
| Patterns | Seven questions to a topology, anti-patterns |
| Quiz | Eleven myth-or-fact cards on the most common misconceptions |
| Timeline | 2011–2026 launches |
| Glossary | Every term with its official English and Japanese console name and what it is often confused with |

Facts on the deep dive were verified against AWS documentation on 2026-10-12.

## Development

Requires Node.js 24.

```bash
npm ci
npm run dev        # http://localhost:5173/aws-connectivity/ (deep dive: /aws-connectivity/direct-connect/)
npm run check      # typecheck, lint, format, markdownlint, tests, build
npm run test:e2e   # real-browser checks (needs: npx playwright install chromium)
```

The source is organized by feature: `src/features/<section>/` holds a section, its labs and the pure logic behind them (with Vitest tests next to it). The deep dive is a second Vite entry (`direct-connect/index.html` → `src/direct-connect.tsx` → `src/app/DirectConnectApp.tsx`) whose sections live in `src/features/direct-connect/`. Shared UI lives in `src/components/`, route data and navigation in `src/data/`, and the language switch in `src/i18n/`.

## CI

| Workflow | What it does |
| --- | --- |
| `ci.yml` | typecheck, ESLint, Prettier, markdownlint, build, tests with coverage, Playwright E2E and axe WCAG 2.2 AA checks (desktop and phone, EN and JA, light and dark), actionlint, `npm audit`, dependency review on PRs; then deploys to GitHub Pages when every check on `main` passes (`npm audit` is advisory) |
| `codeql.yml` | CodeQL for JavaScript/TypeScript and GitHub Actions |
| `freshness.yml` | Opens a monthly issue to re-verify prices, quotas and launches |
| Dependabot | Weekly grouped updates for npm and GitHub Actions |

## Disclaimer

An independent explainer, not affiliated with or endorsed by Amazon Web Services. Prices and quotas change; check the AWS documentation before you design or buy.
