/**
 * Geometry of the Dr.Rock mark: a faceted stone with an ammonite spiral inside.
 * Kept framework-free so `scripts/generate-icons.ts` can reuse it to render the PWA icons.
 */

/** Outline of the cut stone (viewBox 0 0 48 48). */
export const STONE_POINTS = "24,3.2 40.6,10.6 45,27.6 34.6,43.6 13.6,44.4 3.6,29.6 7.8,11.8";

/** Facet lines from an off-centre apex to the outline vertices. */
export const FACET_LINES: Array<[number, number, number, number]> = [
  [24, 3.2, 21, 14],
  [40.6, 10.6, 33, 15],
  [45, 27.6, 38.5, 28],
  [7.8, 11.8, 13.5, 16],
  [3.6, 29.6, 10, 29.5],
  [34.6, 43.6, 31, 38],
  [13.6, 44.4, 17, 38.5],
];

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Logarithmic spiral path (r = a·e^(bθ)) — the growth curve of an ammonite shell.
 */
export function spiralPath(cx: number, cy: number, rMax: number, turns = 3.1, steps = 140): string {
  const thetaMax = turns * Math.PI * 2;
  const b = Math.log(rMax / 0.9) / thetaMax;
  const a = rMax / Math.exp(b * thetaMax);
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * thetaMax;
    const r = a * Math.exp(b * t);
    const x = cx + r * Math.cos(t + Math.PI);
    const y = cy + r * Math.sin(t + Math.PI);
    parts.push(`${i === 0 ? "M" : "L"}${round(x)} ${round(y)}`);
  }
  return parts.join(" ");
}

/** Short radial ribs along the outer whorl. */
export function spiralRibs(cx: number, cy: number, rMax: number, count = 16, turns = 3.1): string {
  const thetaMax = turns * Math.PI * 2;
  const b = Math.log(rMax / 0.9) / thetaMax;
  const a = rMax / Math.exp(b * thetaMax);
  const whorlRatio = Math.exp(b * Math.PI * 2);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = thetaMax - (i / count) * Math.PI * 2 * 1.6;
    const rOuter = a * Math.exp(b * t);
    const rInner = rOuter / whorlRatio;
    const ang = t + Math.PI;
    const x1 = cx + rInner * Math.cos(ang);
    const y1 = cy + rInner * Math.sin(ang);
    const x2 = cx + rOuter * Math.cos(ang);
    const y2 = cy + rOuter * Math.sin(ang);
    parts.push(`M${round(x1)} ${round(y1)} L${round(x2)} ${round(y2)}`);
  }
  return parts.join(" ");
}

export const MARK_SPIRAL = spiralPath(24, 25.5, 13.2);
export const MARK_RIBS = spiralRibs(24, 25.5, 13.2, 14);

/** Standalone SVG string of the mark, used for favicons and PWA icons. */
export function markSvg(options: { size?: number; padding?: number; background?: string | null } = {}): string {
  const { size = 512, padding = 0, background = "#0b0e0d" } = options;
  const vb = 48 + padding * 2;
  const bg = background
    ? `<rect x="${-padding}" y="${-padding}" width="${vb}" height="${vb}" rx="${padding ? 0 : 10}" fill="${background}"/>`
    : "";
  const facets = FACET_LINES.map(
    ([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-padding} ${-padding} ${vb} ${vb}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8af5c6"/><stop offset="1" stop-color="#13a874"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3431"/><stop offset="1" stop-color="#141918"/></linearGradient>
</defs>
${bg}
<polygon points="${STONE_POINTS}" fill="url(#s)" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/>
<g stroke="#4fe3a4" stroke-opacity="0.28" stroke-width="0.9">${facets}</g>
<path d="${MARK_RIBS}" stroke="#4fe3a4" stroke-opacity="0.45" stroke-width="0.8" fill="none" stroke-linecap="round"/>
<path d="${MARK_SPIRAL}" stroke="url(#g)" stroke-width="2.3" fill="none" stroke-linecap="round"/>
</svg>`;
}
