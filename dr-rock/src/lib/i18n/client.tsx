"use client";

import { createContext, use, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { MESSAGES, type Messages } from "./messages";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Provides the page's language to Client Components (set once in app/[lang]/layout.tsx). */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return use(LocaleContext);
}

/** UI text for the current language, e.g. `const t = useMessages("scan")`. */
export function useMessages<K extends keyof Messages>(namespace: K): Messages[K] {
  return MESSAGES[useLocale()][namespace];
}
