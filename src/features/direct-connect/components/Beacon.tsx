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
  // Plain HTML rather than SVG: it is an icon, not a diagram.
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[22%] border-2 border-[var(--paper)] leading-none font-black ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: m.color,
        outline: `2px solid ${m.color}`,
        color: mood === "thinking" ? "var(--on-hub)" : "var(--on-color)",
      }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {m.glyph}
    </span>
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
