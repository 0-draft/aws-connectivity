import { useLang } from "@/i18n/useLang";
import { HOME, pageUrl } from "@/data/site";
import { Shield } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { UI } from "../content/ui";

const C = {
  title: { en: "Direct Connect, up close", ja: "Direct Connect を深掘り" },
  sub: {
    en: "One road on the map, drawn part by part",
    ja: "地図の 1 本の道を、部品ごとに図解",
  },
  lead: {
    en: "Direct Connect is hard because it is four worlds at once: a fiber in someone else's building, VLANs, BGP, and AWS gateways — each with its own vocabulary. This page follows the DX road from your router into AWS, one stop at a time. Tap things, break things, and watch where the traffic goes.",
    ja: "Direct Connect が難しいのは、他社の建物にあるファイバー、VLAN、BGP、AWS のゲートウェイという 4 つの世界が一度に出てくるからです。しかも、それぞれに専門用語があります。このページでは自社ルーターから AWS までの DX の道を、ひとつずつ順にたどります。触って、壊して、通信がどこを通るのかを確かめてみましょう。",
  },
  start: { en: "Why is DX so confusing?", ja: "DX はなぜわかりにくい?" },
  lab: { en: "Skip to the BGP lab", ja: "BGP ラボへ" },
  map: { en: "The DX exit on the road map", ja: "道路地図の DX の出口" },
  you: { en: "your office", ja: "自社" },
  aws: { en: "AWS", ja: "AWS" },
  fig: {
    en: "A fiber from your office to AWS, with traffic flowing along it",
    ja: "自社から AWS へ伸びるファイバーと、その上を流れる通信",
  },
};

export function Hero() {
  const { lang, t } = useLang();
  const reduced = useReducedMotion();
  return (
    <header className="pt-8 pb-6 sm:pt-12">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,34rem)_1fr]">
        <div>
          {/* Same overhead sign as the road map, wearing the DX shield. */}
          <div className="sign relative px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <Shield label="DX" color="var(--r-dx)" size="lg" />
              <div className="min-w-0">
                <h1 className="text-4xl leading-none font-black tracking-tight sm:text-5xl">
                  {t(C.title)}
                </h1>
                <p className="phrase mt-2 text-lg font-semibold [text-wrap:balance]">
                  {t(C.sub)}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-lg">{t(C.lead)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#why"
              className="rounded-lg bg-[var(--ink)] px-5 py-3 font-bold text-[var(--paper)]"
            >
              {t(C.start)}
            </a>
            <a
              href="#routing"
              className="panel px-5 py-3 font-bold hover:border-[var(--ink)]"
            >
              {t(C.lab)}
            </a>
            <a
              href={pageUrl(HOME, lang, "dx")}
              className="px-2 py-3 font-bold underline underline-offset-2"
            >
              {t(C.map)}
            </a>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)]">{t(UI.asOf)}</p>
        </div>

        <div className="panel p-3 sm:p-4">
          <svg
            viewBox="0 0 460 300"
            className="diagram w-full"
            role="img"
            aria-label={t(C.fig)}
          >
            <path
              d="M70 220 C160 220 150 90 240 90 S360 150 395 110"
              stroke="var(--asphalt)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M70 220 C160 220 150 90 240 90 S360 150 395 110"
              stroke="var(--r-dx)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className={reduced ? undefined : "flow"}
            />
            <g>
              <rect
                x="22"
                y="190"
                width="96"
                height="74"
                rx="8"
                fill="var(--paper-2)"
                stroke="var(--line)"
                strokeWidth="3"
              />
              <path
                d="M18 196 L70 158 L122 196"
                fill="var(--paper-2)"
                stroke="var(--hub)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <rect x="42" y="222" width="18" height="18" rx="3" fill="var(--hub)" />
              <rect x="80" y="222" width="18" height="18" rx="3" fill="var(--hub)" />
              <text
                x="70"
                y="286"
                textAnchor="middle"
                fontSize="15"
                fontWeight="700"
                fill="var(--muted)"
              >
                {t(C.you)}
              </text>
            </g>
            <g>
              <rect x="352" y="70" width="96" height="70" rx="10" fill="var(--hub)" />
              <text
                x="400"
                y="111"
                textAnchor="middle"
                fontSize="20"
                fontWeight="800"
                fill="var(--on-hub)"
              >
                {t(C.aws)}
              </text>
            </g>
            <g transform="translate(220 30)">
              <rect width="48" height="30" rx="6" fill="var(--r-dx)" />
              <text
                x="24"
                y="21"
                textAnchor="middle"
                fontSize="16"
                fontWeight="900"
                fill="var(--on-color)"
              >
                DX
              </text>
            </g>
          </svg>
        </div>
      </div>
    </header>
  );
}
