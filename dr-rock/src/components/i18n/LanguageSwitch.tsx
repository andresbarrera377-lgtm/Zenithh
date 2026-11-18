"use client";

import { Languages } from "lucide-react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

async function switchTo(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  // Pages cached by the service worker are in the old language; drop them before reloading.
  try {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.endsWith("-runtime")).map((k) => caches.delete(k)));
  } catch {
    // Cache Storage unavailable: nothing to clear.
  }
  window.location.reload();
}

/** ES | EN toggle. The choice is remembered in a cookie and applied by proxy.ts on every page. */
export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useMessages("common");
  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={cn("inline-flex items-center gap-0.5 rounded-full bg-granite-900 p-0.5 ring-1 ring-granite-700", className)}
    >
      <Languages className="ml-1.5 mr-0.5 h-3.5 w-3.5 text-granite-400" aria-hidden />
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          aria-label={l === "es" ? "Español" : "English"}
          title={locale === l ? t.language.current : t.language.switchTo}
          onClick={() => locale !== l && switchTo(l)}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors",
            locale === l ? "bg-mineral-400 text-carbon-950" : "text-granite-300 hover:text-chalk-50",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
