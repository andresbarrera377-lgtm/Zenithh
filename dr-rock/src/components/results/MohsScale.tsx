"use client";

import { useLocale, useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/** Mohs hardness scale (1–10) with the specimen's typical range highlighted. */
export function MohsScale({ min, max, className }: { min: number | null; max: number | null; className?: string }) {
  const lo = min ?? max;
  const hi = max ?? min;
  const t = useMessages("report").mohs;
  const locale = useLocale();
  const n = (v: number) => v.toLocaleString(locale === "es" ? "es-ES" : "en");
  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-10 gap-1">
        {t.reference.map((name, i) => {
          const value = i + 1;
          const active = lo != null && hi != null && value >= Math.floor(lo) && value <= Math.ceil(hi);
          return (
            <div key={name} className="space-y-1.5 text-center">
              <div
                className={cn(
                  "h-8 rounded-md font-mono text-xs leading-8 transition-colors",
                  active ? "bg-mineral-400 font-semibold text-carbon-950" : "bg-granite-800 text-granite-400",
                )}
              >
                {value}
              </div>
              <p className="hidden truncate text-[9px] text-granite-500 sm:block">{name}</p>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-granite-300">
        {lo == null ? (
          t.none
        ) : (
          <>
            {t.typical} <span className="font-mono text-mineral-300">{lo === hi ? n(lo) : `${n(lo)} – ${n(hi!)}`}</span> {t.scaleNote}
          </>
        )}
      </p>
    </div>
  );
}
