import type { ReactNode } from "react";
import type { L } from "@/i18n/lang";
import { useLang } from "@/i18n/useLang";
import { Shield } from "@/components/ui";

export type Mood = "happy" | "worried" | "thinking" | "sleepy";

const MOOD: Record<Mood, { color: string; glyph: string }> = {
  happy: { color: "var(--ok)", glyph: "✓" },
  worried: { color: "var(--bad)", glyph: "!" },
  thinking: { color: "var(--hub)", glyph: "?" },
  sleepy: { color: "var(--asphalt-2)", glyph: "–" },
};

/**
 * A status sign for the labs: green when traffic flows, red when the path
 * breaks, dark while the answer is still open. Drawn as a road sign so it
 * reads like the rest of the site.
 */
export function Beacon({
  mood = "happy",
  size = 56,
  className = "",
  title,
}: {
  mood?: Mood;
  size?: number;
  className?: string;
  title?: string;
}) {
  const m = MOOD[mood];
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="6" y="6" width="52" height="52" rx="10" fill={m.color} />
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        rx="7"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="2.5"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="30"
        fontWeight="900"
        fill={mood === "thinking" ? "var(--on-hub)" : "var(--on-color)"}
      >
        {m.glyph}
      </text>
    </svg>
  );
}

/** A plain-language aside: an analogy or the one thing to remember. */
export function PlainWords({
  title,
  children,
}: {
  mood?: Mood;
  title?: L;
  children: ReactNode;
}) {
  const { t } = useLang();
  return (
    <aside
      className="panel flex items-start gap-3 px-4 py-3"
      style={{ borderLeftWidth: 6, borderLeftColor: "var(--r-dx)" }}
    >
      <span className="mt-0.5">
        <Shield label="DX" color="var(--r-dx)" size="sm" />
      </span>
      <div className="text-[0.95rem]">
        <p className="mb-1 font-bold">
          {title ? t(title) : t({ en: "In plain words", ja: "ひとことで言うと" })}
        </p>
        {children}
      </div>
    </aside>
  );
}
