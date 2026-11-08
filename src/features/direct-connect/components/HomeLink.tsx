import type { ReactNode } from "react";
import { useLang } from "@/i18n/useLang";
import { HOME, pageUrl } from "@/data/site";

/** A link back into the road map that keeps the reader's language. */
export function OnRampLink({
  section,
  children,
}: {
  section?: string;
  children: ReactNode;
}) {
  const { lang } = useLang();
  return (
    <a
      href={pageUrl(HOME, lang, section)}
      className="font-semibold text-[var(--fiber)] underline underline-offset-2 hover:text-[var(--ink)]"
    >
      {children}
    </a>
  );
}
