import type { Locale } from "./config";

/** Declares one namespace of UI text in both languages; English must have exactly Spanish's shape. */
export function defineMessages<T>(messages: { es: T; en: NoInfer<T> }): Record<Locale, T> {
  return messages;
}
