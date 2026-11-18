import { EONS_PRECAMBRIAN, ERAS, PERIODS, unitName, type TimeUnit } from "@/lib/library/timescale";
import { seededRandom } from "@/lib/utils";
import { Backdrop, H, NoiseFilter, W, bandPath, r1, svgId, type Pt } from "./art-utils";

/**
 * Stylised cliff outcrop: one stratum per geological period (oldest at the bottom),
 * with the selected period or era highlighted.
 */
export function TimeArt({
  unitId,
  className,
  title,
  lang = "en",
}: {
  unitId: string;
  className?: string;
  title?: string;
  /** Language of the period/era label drawn on the outcrop. */
  lang?: "es" | "en";
}) {
  const rng = seededRandom(`time-${unitId}`);
  const layers: TimeUnit[] = [EONS_PRECAMBRIAN, ...PERIODS];
  const era = ERAS.find((e) => e.id === unitId);
  const isHighlighted = (u: TimeUnit) => {
    if (u.id === unitId) return true;
    if (era) return u.start <= era.start && u.end >= era.end && u.id !== "precambrian";
    return false;
  };

  // Precambrian gets a thicker basement band.
  const top = 28;
  const bottom = 278;
  const weights = layers.map((u) => (u.id === "precambrian" ? 3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const boundaries: Pt[][] = [];
  const phase = rng() * Math.PI * 2;
  let acc = 0;
  for (let i = 0; i <= layers.length; i++) {
    const y = bottom - ((bottom - top) * acc) / total;
    boundaries.push(
      Array.from({ length: 9 }, (_, k) => {
        const x = 40 + (k / 8) * 320;
        return [x, y + Math.sin(phase + k * 0.9 + i * 0.4) * 2.5 + (rng() - 0.5) * 2] as Pt;
      }),
    );
    if (i < layers.length) acc += weights[i];
  }

  const highlighted = layers.map((u, i) => ({ u, i })).filter(({ u }) => isHighlighted(u));
  const labelIndex = highlighted.length ? highlighted[Math.floor(highlighted.length / 2)].i : -1;
  const labelY = labelIndex >= 0 ? (boundaries[labelIndex][8][1] + boundaries[labelIndex + 1][8][1]) / 2 : 0;
  const labelUnit = era ?? layers[labelIndex];
  const label = labelUnit ? unitName(labelUnit, lang) : "";
  const noise = svgId(`time-${unitId}`, "n");

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={title}>
      <Backdrop seed={`time-${unitId}`} />
      <defs>
        <NoiseFilter id={noise} frequency={0.8} opacity={0.35} />
      </defs>
      {layers.map((u, i) => {
        const on = isHighlighted(u);
        return (
          <path
            key={u.id}
            d={bandPath(boundaries[i + 1], boundaries[i])}
            fill={u.color}
            opacity={on ? 1 : 0.22}
            stroke={on ? "#ffffff" : "#000"}
            strokeOpacity={on ? 0.7 : 0.4}
            strokeWidth={on ? 1.4 : 0.6}
          />
        );
      })}
      <rect x="40" y="20" width="320" height="262" filter={`url(#${noise})`} opacity="0.8" />
      <text x="40" y="16" fill="#8af5c6" fontSize="9" fontFamily="JetBrains Mono Variable, ui-monospace, monospace" letterSpacing="1.5">
        {lang === "es" ? "HOY" : "TODAY"}
      </text>
      <text x="40" y="294" fill="#7d8783" fontSize="9" fontFamily="JetBrains Mono Variable, ui-monospace, monospace" letterSpacing="1.5">
        {lang === "es" ? "4567 MA" : "4,567 MA"}
      </text>
      {labelIndex >= 0 && (
        <g>
          <rect
            x={r1(200 - (label.length * 7.4 + 22) / 2)}
            y={r1(labelY - 9)}
            width={r1(label.length * 7.4 + 22)}
            height="18"
            rx="9"
            fill="#060807"
            fillOpacity="0.82"
            stroke="#4fe3a4"
            strokeOpacity="0.8"
          />
          <text
            x="200"
            y={r1(labelY + 4)}
            fill="#eceee9"
            fontSize="11"
            fontFamily="Space Grotesk Variable, ui-sans-serif, sans-serif"
            fontWeight="600"
            letterSpacing="1.2"
            textAnchor="middle"
          >
            {label.toUpperCase()}
          </text>
        </g>
      )}
    </svg>
  );
}
