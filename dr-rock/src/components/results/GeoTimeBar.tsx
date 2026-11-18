"use client";

import { useLocale, useMessages } from "@/lib/i18n/client";
import { EONS_PRECAMBRIAN, PERIODS, timeToPosition, unitName } from "@/lib/library/timescale";
import { cn, formatMaRange } from "@/lib/utils";

export interface TimeRange {
  label: string;
  minMa: number | null;
  maxMa: number | null;
  tone: "mineral" | "ochre";
}

const TICKS = [
  { ma: 4567, label: "4.6 Ga" },
  { ma: 538.8, label: "539 Ma" },
  { ma: 251.9, label: "252 Ma", desktopOnly: true },
  { ma: 66, label: "66 Ma" },
  { ma: 0, label: "today" },
];

const toneClass = {
  mineral: { band: "bg-mineral-400/25 ring-mineral-300", text: "text-mineral-300", dot: "bg-mineral-400" },
  ochre: { band: "bg-ochre-400/25 ring-ochre-300", text: "text-ochre-300", dot: "bg-ochre-400" },
};

/**
 * Horizontal geological time scale with highlighted age ranges.
 * The Precambrian is compressed so the Phanerozoic periods remain legible.
 */
export function GeoTimeBar({
  ranges = [],
  highlightPeriod,
  className,
}: {
  ranges?: TimeRange[];
  highlightPeriod?: string;
  className?: string;
}) {
  const units = [EONS_PRECAMBRIAN, ...PERIODS];
  const locale = useLocale();
  const today = useMessages("report").time.today;
  const valid = ranges.filter((r) => r.minMa != null || r.maxMa != null);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <div className="flex h-9 overflow-hidden rounded-lg ring-1 ring-granite-600/60">
          {units.map((u) => {
            const left = timeToPosition(u.start);
            const right = timeToPosition(u.end);
            const dim = highlightPeriod && highlightPeriod !== u.id;
            return (
              <div
                key={u.id}
                title={`${unitName(u, locale)}: ${u.start}–${u.end} Ma`}
                className={cn("relative h-full border-r border-carbon-950/40 transition-opacity", dim && "opacity-25")}
                style={{ width: `${(right - left) * 100}%`, backgroundColor: u.color }}
              >
                <span className="absolute inset-0 hidden items-center justify-center overflow-hidden text-[9px] font-semibold uppercase tracking-wide text-carbon-950/75 md:flex">
                  {(right - left) * 100 > 5.5 ? unitName(u, locale).slice(0, 4) : unitName(u, locale).slice(0, 1)}
                </span>
              </div>
            );
          })}
        </div>

        {valid.map((r) => {
          const older = r.maxMa ?? r.minMa!;
          const younger = r.minMa ?? r.maxMa!;
          const left = timeToPosition(older);
          const right = timeToPosition(younger);
          const width = Math.max(right - left, 0.012);
          return (
            <div
              key={r.label}
              className={cn("pointer-events-none absolute -inset-y-1.5 rounded-md ring-2", toneClass[r.tone].band)}
              style={{ left: `${left * 100}%`, width: `${width * 100}%` }}
              aria-hidden
            />
          );
        })}
      </div>

      <div className="relative h-4 font-mono text-[10px] text-granite-400" aria-hidden>
        {TICKS.map((t, i) => (
          <span
            key={t.label}
            className={cn(
              "absolute whitespace-nowrap",
              i === 0 ? "translate-x-0" : i === TICKS.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
              t.desktopOnly && "hidden sm:inline",
            )}
            style={{ left: `${timeToPosition(t.ma) * 100}%` }}
          >
            {t.label === "today" ? today : t.label}
          </span>
        ))}
      </div>

      {valid.length > 0 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          {valid.map((r) => (
            <li key={r.label} className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-sm", toneClass[r.tone].dot)} aria-hidden />
              <span className="text-granite-300">{r.label}:</span>
              <span className={cn("font-mono", toneClass[r.tone].text)}>{formatMaRange(r.minMa, r.maxMa, locale)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
