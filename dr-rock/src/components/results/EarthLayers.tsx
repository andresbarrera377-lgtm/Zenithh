import { cn } from "@/lib/utils";

const LAYERS = [
  {
    name: "Crust",
    depth: "0 – 5 to 70 km",
    detail: "Thin rocky shell: ~5–10 km under oceans, ~30–70 km under continents. All rocks you can collect — and every fossil — come from here.",
    color: "#b08a5a",
  },
  {
    name: "Mantle",
    depth: "to ~2,900 km",
    detail: "Hot silicate rock that flows very slowly. It is the source of most magma, but it never contains fossils.",
    color: "#c2553a",
  },
  {
    name: "Outer core",
    depth: "2,900 – 5,150 km",
    detail: "Liquid iron–nickel. Its motion generates Earth's magnetic field.",
    color: "#e88a2e",
  },
  {
    name: "Inner core",
    depth: "5,150 – 6,371 km",
    detail: "Solid iron–nickel ball, as hot as the Sun's surface (~5,000 °C+).",
    color: "#f6c453",
  },
];

/**
 * Static, scientifically standard cross-section of the Earth.
 * The crust is drawn thicker than scale so it remains visible.
 */
export function EarthLayers({ className }: { className?: string }) {
  return (
    <div className={cn("grid items-center gap-6 sm:grid-cols-[180px_1fr]", className)}>
      <svg viewBox="0 0 200 110" className="mx-auto w-full max-w-[220px]" role="img" aria-label="Cross-section of Earth's layers">
        <defs>
          <clipPath id="earth-half">
            <rect x="0" y="0" width="200" height="100" />
          </clipPath>
        </defs>
        <g clipPath="url(#earth-half)">
          <circle cx="100" cy="100" r="96" fill={LAYERS[0].color} />
          <circle cx="100" cy="100" r="90" fill={LAYERS[1].color} />
          <circle cx="100" cy="100" r="52" fill={LAYERS[2].color} />
          <circle cx="100" cy="100" r="18" fill={LAYERS[3].color} />
          {/* Fossil zone marker on the crust */}
          <path d="M 30 32 A 96 96 0 0 1 64 12" stroke="#4fe3a4" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <line x1="0" y1="100" x2="200" y2="100" stroke="#3b4441" strokeWidth="1" />
        <text x="22" y="8" fill="#8af5c6" fontSize="8" fontFamily="JetBrains Mono Variable, ui-monospace, monospace">
          fossils
        </text>
      </svg>
      <ul className="space-y-3">
        {LAYERS.map((l) => (
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
