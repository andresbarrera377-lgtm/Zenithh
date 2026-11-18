import { lang } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { MESSAGES, type Messages } from "./messages";

/** Current language in Server Components (from the app/[lang] root segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}
