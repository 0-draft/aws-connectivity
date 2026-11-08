import { useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { L } from "@/i18n/lang";
import { useLang } from "@/i18n/useLang";
import { TRAPS } from "../content/traps";
import { Callout as BaseCallout } from "@/components/ui";

/** Renders a bilingual string in the current language. */
export function T({ c }: { c: L }) {
  const { t } = useLang();
  return <>{t(c)}</>;
}

export type Layer = "physical" | "link" | "routing" | "aws" | "money" | "ops";

const LAYER: Record<Layer, { label: L; color: string }> = {
  physical: {
    label: { en: "L1 · fiber & optics", ja: "L1 物理 (ファイバー・光)" },
    color: "var(--fiber)",
  },
  link: {
    label: { en: "L2 · VLAN, LACP, MACsec", ja: "L2 (VLAN・LACP・MACsec)" },
    color: "var(--violet)",
  },
  routing: { label: { en: "L3 · BGP", ja: "L3 (BGP)" }, color: "var(--aws)" },
  aws: { label: { en: "AWS resources", ja: "AWS のリソース" }, color: "var(--ok)" },
  money: { label: { en: "Billing", ja: "お金" }, color: "var(--bad)" },
  ops: { label: { en: "Operations", ja: "運用" }, color: "var(--muted)" },
};

export function LayerChip({ layer }: { layer: Layer }) {
  const { t } = useLang();
  const l = LAYER[layer];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-0.5 text-xs font-bold"
      style={{ borderColor: l.color, color: l.color }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: l.color }}
        aria-hidden="true"
      />
      {t(l.label)}
    </span>
  );
}

/**
 * One stop on the Direct Connect deep dive. The heading is the same highway
 * sign as the main road map, with a red DX plate instead of an exit number,
 * because every stop here is on the DX road.
 */
export function Section({
  id,
  index,
  kicker,
  title,
  lead,
  layers = [],
  children,
}: {
  id: string;
  index: string;
  kicker: L;
  title: L;
  lead: L;
  layers?: Layer[];
  children: ReactNode;
}) {
  const { t } = useLang();
  const solves = TRAPS.filter((x) => x.stop === id);
  const no = /^\d+$/.test(index) ? String(Number(index)) : index;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pt-12 pb-4 sm:pt-16">
      <p className="mb-2 text-sm font-bold text-[var(--muted)]">{t(kicker)}</p>
      <div className="sign inline-flex max-w-full items-stretch overflow-hidden">
        <span className="m-[5px] mr-0 flex shrink-0 items-center whitespace-nowrap bg-[var(--sign-ink)] px-3 py-2 text-sm font-black text-[var(--r-dx)] [border-radius:7px_0_0_7px] sm:px-4 sm:text-base">
          <span className="sr-only">{t({ en: "Stop", ja: "ステップ" })} </span>
          <span aria-hidden="true">DX&nbsp;</span>
          {no}
        </span>
        <h2
          id={`${id}-title`}
          className="px-4 py-3 text-xl font-extrabold tracking-tight sm:px-5 sm:text-3xl"
        >
          {t(title)}
        </h2>
      </div>
      <p className="mt-5 max-w-3xl text-lg text-[var(--muted)]">{t(lead)}</p>
      {solves.length > 0 && (
        <div className="mt-4 max-w-3xl rounded-xl bg-[var(--paper-2)] px-4 py-3">
          <p className="mb-1.5 text-xs font-bold text-[var(--muted)]">
            {t({
              en: "Untangles these traps",
              ja: "このステップでほどける、つまずきポイント",
            })}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {solves.map((x) => (
              <li key={x.title.en}>
                <a
                  href="#traps"
                  className="inline-block rounded-md border border-[var(--line)] bg-[var(--paper)] px-2.5 py-0.5 text-xs font-bold hover:border-[var(--ink)]"
                >
                  {t(x.title)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {layers.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-2">
          {layers.map((l) => (
            <LayerChip key={l} layer={l} />
          ))}
        </p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`panel p-4 sm:p-6 ${className}`}>{children}</div>;
}

/** A roadside notice, in the main site's callout style. */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn";
  title: L;
  children: ReactNode;
}) {
  return (
    <BaseCallout tone={tone} title={title}>
      <div className="leading-relaxed">{children}</div>
    </BaseCallout>
  );
}

export function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-block rounded-md border-2 px-2 py-0.5 text-xs leading-tight font-bold"
      style={{ borderColor: color ?? "var(--line)", color: color ?? "var(--muted)" }}
    >
      {children}
    </span>
  );
}

/** Horizontally scrollable wrapper for wide diagrams and tables. */
export function Scroll({ children }: { children: ReactNode }) {
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Only promise a swipe when there is actually something off-screen.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    // Content can widen without the container resizing (language switch,
    // late web fonts, a lab changing state).
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [lang]);

  return (
    <div>
      <div ref={ref} className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {children}
      </div>
      {overflows && (
        <p className="mt-1 text-center text-xs text-[var(--muted)]" aria-hidden="true">
          {t({ en: "← swipe to see more →", ja: "← 横にスワイプできます →" })}
        </p>
      )}
    </div>
  );
}

/**
 * A single-choice toggle with the WAI-ARIA radio group keyboard model: one
 * Tab stop (the checked option), arrow keys move and select.
 */
export function Segmented<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const i = options.findIndex((o) => o.value === value);
    const next = (i + step + options.length) % options.length;
    onChange(options[next].value);
    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]");
    buttons[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="flex w-full gap-1 rounded-xl border border-[var(--line)] bg-[var(--paper-2)] p-1 sm:inline-flex sm:w-auto sm:flex-wrap"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          tabIndex={value === o.value ? 0 : -1}
          onClick={() => onChange(o.value)}
          className={`min-h-9 flex-1 rounded-lg px-2 py-1.5 text-sm leading-tight font-bold transition-colors sm:flex-none sm:px-3 ${
            value === o.value
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
