import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { type Lang, readStoredLang, resolveInitialLang, storeLang } from "./lang";
import { LangContext, type LangValue } from "./context";

const TITLE: Record<Lang, string> = {
  en: "AWS Connectivity — every way from your network into AWS",
  ja: "AWS Connectivity — 社内ネットワークから AWS への全経路",
};

export function LangProvider({
  children,
  initial,
  title = TITLE,
}: {
  children: ReactNode;
  initial?: Lang;
  /** Document title per language; each page of the site has its own. */
  title?: Record<Lang, string>;
}) {
  const [lang, setLangState] = useState<Lang>(
    () => initial ?? resolveInitialLang(window.location.search, readStoredLang()),
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title[lang];
  }, [lang, title]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storeLang(next);
    const url = new URL(window.location.href);
    if (next === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    window.history.replaceState(null, "", url);
  }, []);

  const value = useMemo<LangValue>(
    () => ({ lang, setLang, t: (copy) => copy[lang] }),
    [lang, setLang],
  );

  return <LangContext value={value}>{children}</LangContext>;
}
