/** Supported languages. Spanish is the default; English is one tap away (LanguageSwitch). */
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
/** Cookie that remembers the visitor's choice (set by LanguageSwitch, read by proxy.ts). */
export const LOCALE_COOKIE = "dr-rock-lang";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the language for a request: the saved choice first, then the first supported language in
 * the browser's Accept-Language list (the phone's language), then Spanish.
 */
export function pickLocale(cookieValue: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  const preferred = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { lang: tag.trim().slice(0, 2).toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((p) => p.lang && !Number.isNaN(p.q))
    .sort((a, b) => b.q - a.q);
  return preferred.map((p) => p.lang).find(isLocale) ?? DEFAULT_LOCALE;
}

/** BCP 47 tag for Intl formatting. */
export const INTL_LOCALE: Record<Locale, string> = { es: "es-ES", en: "en-GB" };
