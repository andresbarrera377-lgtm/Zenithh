/**
 * Shared helpers for the procedural specimen illustrations.
 * All art is deterministic (seeded) so server and client render identical SVG.
 */

export type Pt = [number, number];
export type Rng = () => number;

export const W = 400;
export const H = 300;

export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function svgId(seed: string, name: string): string {
  return `${seed.replace(/[^a-z0-9-]/gi, "")}-${name}`;
}

export function range(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

/** Irregular "pebble" outline points around a centre. */
export function blobPoints(rng: Rng, cx: number, cy: number, rx: number, ry: number, n = 11, jitter = 0.16): Pt[] {
  const offset = rng() * Math.PI * 2;
  return Array.from({ length: n }, (_, i) => {
    const a = offset + (i / n) * Math.PI * 2;
    const k = 1 - jitter + rng() * jitter * 2;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as Pt;
  });
}

/** Closed Catmull-Rom spline through points, as an SVG path. */
export function smoothClosedPath(points: Pt[]): string {
  const n = points.length;
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return `${d} Z`;
}

/** Small irregular polygon (mineral grain). */
export function grainPath(rng: Rng, cx: number, cy: number, size: number, sides = 5): string {
  const offset = rng() * Math.PI;
  const pts = Array.from({ length: sides }, (_, i) => {
    const a = offset + (i / sides) * Math.PI * 2;
    const k = 0.6 + rng() * 0.6;
    return `${r1(cx + Math.cos(a) * size * k)},${r1(cy + Math.sin(a) * size * k)}`;
  });
  return `M${pts.join(" L")} Z`;
}

/** Horizontal wavy band boundary from x=-10 to x=W+10. */
export function wavyLine(rng: Rng, y: number, amplitude: number, segments = 6): Pt[] {
  const phase = rng() * Math.PI * 2;
  const freq = 0.6 + rng() * 1.2;
  return Array.from({ length: segments + 1 }, (_, i) => {
    const x = -10 + (i / segments) * (W + 20);
    return [x, y + Math.sin(phase + (i / segments) * Math.PI * 2 * freq) * amplitude + (rng() - 0.5) * amplitude * 0.6] as Pt;
  });
}

export function polyline(points: Pt[]): string {
  return points.map((p, i) => `${i ? "L" : "M"}${r1(p[0])} ${r1(p[1])}`).join(" ");
}

/** Band polygon between two wavy lines. */
export function bandPath(top: Pt[], bottom: Pt[]): string {
  return `${polyline(top)} ${bottom
    .slice()
    .reverse()
    .map((p) => `L${r1(p[0])} ${r1(p[1])}`)
    .join(" ")} Z`;
}

/** Dark studio backdrop with a faint measurement grid. */
export function Backdrop({ seed, tint = "#1d2422" }: { seed: string; tint?: string }) {
  const g = svgId(seed, "bg");
  const grid = svgId(seed, "grid");
  return (
    <>
      <defs>
        <radialGradient id={g} cx="50%" cy="42%" r="75%">
          <stop offset="0" stopColor={tint} />
          <stop offset="1" stopColor="#070908" />
        </radialGradient>
        <pattern id={grid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#4fe3a4" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${g})`} />
      <rect width={W} height={H} fill={`url(#${grid})`} />
    </>
  );
}

/** Soft contact shadow under a specimen. */
export function ContactShadow({ seed, cx = 200, cy = 252, rx = 130, ry = 16 }: { seed: string; cx?: number; cy?: number; rx?: number; ry?: number }) {
  const f = svgId(seed, "shadow");
  return (
    <>
      <defs>
        <filter id={f} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" opacity="0.7" filter={`url(#${f})`} />
    </>
  );
}

/** Fractal-noise grain filter used to give surfaces a stony texture. */
export function NoiseFilter({
  id,
  frequency = 0.9,
  octaves = 3,
  opacity = 0.35,
  light = false,
}: {
  id: string;
  frequency?: number;
  octaves?: number;
  opacity?: number;
  light?: boolean;
}) {
  const c = light ? 1 : 0;
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves={octaves} seed="3" result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values={`0 0 0 0 ${c}  0 0 0 0 ${c}  0 0 0 0 ${c}  0 0 0 ${opacity * 2.2} -${opacity * 0.6}`}
      />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
  );
}

/** Highlight + core shadow that make a flat shape read as a rounded 3D object. */
export function VolumeLighting({ seed, clipId }: { seed: string; clipId: string }) {
  const hi = svgId(seed, "hi");
  const lo = svgId(seed, "lo");
  return (
    <>
      <defs>
        <radialGradient id={hi} cx="34%" cy="26%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={lo} cx="50%" cy="45%" r="62%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.62" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width={W} height={H} fill={`url(#${lo})`} />
        <rect width={W} height={H} fill={`url(#${hi})`} />
      </g>
    </>
  );
}
