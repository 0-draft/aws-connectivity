import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HOME } from "@/data/site";
import { DX_AS_OF } from "@/data/asOf";
import { useLang } from "@/i18n/useLang";
import { NAV } from "@/features/direct-connect/content/nav";
import { Hero } from "@/features/direct-connect/sections/Hero";
import { Overview } from "@/features/direct-connect/sections/Overview";
import { Connections } from "@/features/direct-connect/sections/Connections";
import { LagMacsec } from "@/features/direct-connect/sections/LagMacsec";
import { Vifs } from "@/features/direct-connect/sections/Vifs";
import { Gateway } from "@/features/direct-connect/sections/Gateway";
import { Routing } from "@/features/direct-connect/sections/Routing";
import { Resiliency } from "@/features/direct-connect/sections/Resiliency";
import { Security } from "@/features/direct-connect/sections/Security";
import { Operations } from "@/features/direct-connect/sections/Operations";
import { Pricing } from "@/features/direct-connect/sections/Pricing";
import { Patterns } from "@/features/direct-connect/sections/Patterns";
import { Timeline } from "@/features/direct-connect/sections/Timeline";
import { WhyHard } from "@/features/direct-connect/sections/WhyHard";
import { Myths } from "@/features/direct-connect/sections/Myths";
import { Glossary } from "@/features/direct-connect/sections/Glossary";

/**
 * The Direct Connect deep dive: every part of the DX road, with its own labs.
 * The road map's DX exit is the summary; this page is the long version.
 */
export default function DirectConnectApp() {
  const { t } = useLang();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[var(--lane)] focus:px-4 focus:py-2 focus:text-black"
      >
        {t({ en: "Skip to content", ja: "本文へスキップ" })}
      </a>
      <Header
        nav={NAV}
        stopLabel={{ en: "Stop", ja: "ステップ" }}
        // "Why hard?" is the prologue (?); the stops count from the overview.
        numberOf={(i) => (i === 0 ? "?" : String(i))}
        back={{ href: HOME, label: { en: "back to the road map", ja: "道路地図に戻る" } }}
      />
      <main id="main" className="dx-deep mx-auto max-w-6xl px-4 sm:px-6">
        <span id="top" />
        <Hero />
        <WhyHard />
        <Overview />
        <Connections />
        <LagMacsec />
        <Vifs />
        <Gateway />
        <Routing />
        <Resiliency />
        <Security />
        <Operations />
        <Pricing />
        <Patterns />
        <Myths />
        <Timeline />
        <Glossary />
      </main>
      <Footer home={HOME} asOf={DX_AS_OF} />
    </>
  );
}
