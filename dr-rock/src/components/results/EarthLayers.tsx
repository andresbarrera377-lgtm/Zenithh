"use client";

import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const LAYER_COLORS = ["#b08a5a", "#c2553a", "#e88a2e", "#f6c453"];

/**
 * Static, scientifically standard cross-section of the Earth.
 * The crust is drawn thicker than scale so it remains visible.
 */
export function EarthLayers({ className }: { className?: string }) {
  const t = useMessages("report").earth;
  const layers = t.layers.map((l, i) => ({ ...l, color: LAYER_COLORS[i] }));
  return (
    <div className={cn("grid items-center gap-6 sm:grid-cols-[180px_1fr]", className)}>
      <svg viewBox="0 0 200 110" className="mx-auto w-full max-w-[220px]" role="img" aria-label={t.aria}>
        <defs>
          <clipPath id="earth-half">
            <rect x="0" y="0" width="200" height="100" />
          </clipPath>
        </defs>
        <g clipPath="url(#earth-half)">
          <circle cx="100" cy="100" r="96" fill={LAYER_COLORS[0]} />
          <circle cx="100" cy="100" r="90" fill={LAYER_COLORS[1]} />
          <circle cx="100" cy="100" r="52" fill={LAYER_COLORS[2]} />
          <circle cx="100" cy="100" r="18" fill={LAYER_COLORS[3]} />
          {/* Fossil zone marker on the crust */}
          <path d="M 30 32 A 96 96 0 0 1 64 12" stroke="#4fe3a4" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <line x1="0" y1="100" x2="200" y2="100" stroke="#3b4441" strokeWidth="1" />
        <text x="22" y="8" fill="#8af5c6" fontSize="8" fontFamily="JetBrains Mono Variable, ui-monospace, monospace">
          {t.fossils}
        </text>
      </svg>
      <ul className="space-y-3">
        {layers.map((l) => (
          <li key={l.name} className="flex gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: l.color }} aria-hidden />
            <div className="text-sm">
              <p className="font-medium text-chalk-50">
                {l.name} <span className="font-mono text-xs text-granite-400">· {l.depth}</span>
              </p>
              <p className="leading-relaxed text-granite-300">{l.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
