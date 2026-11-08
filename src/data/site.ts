import type { Lang } from "@/i18n/lang";

/** The road map: the site root on GitHub Pages. */
export const HOME = import.meta.env.BASE_URL;

/** The Direct Connect deep dive, a second page on the same site. */
export const DX_DEEP = `${HOME}direct-connect/`;

/**
 * A link to one of the site's pages that keeps the reader's language. Both
 * pages read `?lang=` on load, so the link works even with storage blocked.
 */
export function pageUrl(page: string, lang: Lang, hash?: string): string {
  return `${page}${lang === "ja" ? "?lang=ja" : ""}${hash ? `#${hash}` : ""}`;
}
