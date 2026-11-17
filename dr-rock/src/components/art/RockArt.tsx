import type { ReactNode } from "react";
import type { RockTexture } from "@/lib/library/types";
import { seededRandom } from "@/lib/utils";
import {
  Backdrop,
  ContactShadow,
  H,
  NoiseFilter,
  VolumeLighting,
  W,
  bandPath,
  blobPoints,
  grainPath,
  pick,
  polyline,
  r1,
  range,
  smoothClosedPath,
  svgId,
  wavyLine,
  type Pt,
  type Rng,
} from "./art-utils";

type Palette = [string, string, string, string?];

function speckles(rng: Rng, count: number, colors: string[], size: [number, number] = [0.6, 1.6]) {
  return Array.from({ length: count }, (_, i) => (
    <circle
      key={`s${i}`}
      cx={r1(range(rng, 30, 370))}
      cy={r1(range(rng, 30, 270))}
      r={r1(range(rng, size[0], size[1]))}
      fill={pick(rng, colors)}
      opacity={r1(range(rng, 0.35, 0.9))}
    />
  ));
}

function mosaic(rng: Rng, colors: string[], cols = 18, rows = 13, opacity: [number, number] = [0.25, 0.7]) {
  const cells: ReactNode[] = [];
  const cw = W / cols;
  const ch = H / rows;
  for (let y = 0; y <= rows; y++) {
    for (let x = 0; x <= cols; x++) {
      const cx = x * cw + (y % 2 ? cw / 2 : 0) + range(rng, -cw * 0.25, cw * 0.25);
      const cy = y * ch + range(rng, -ch * 0.25, ch * 0.25);
      cells.push(
        <path
          key={`m${x}-${y}`}
          d={grainPath(rng, cx, cy, Math.max(cw, ch) * 0.62, 6)}
          fill={pick(rng, colors)}
          opacity={r1(range(rng, opacity[0], opacity[1]))}
          stroke="#000"
          strokeOpacity="0.12"
          strokeWidth="0.6"
        />,
      );
    }
  }
  return cells;
}

function bands(rng: Rng, colors: string[], minH: number, maxH: number, amplitude: number, opacity = 1) {
  // Shared wave so boundaries stay roughly parallel, like real bedding.
  const phase = rng() * Math.PI * 2;
  const freq = 0.6 + rng() * 1.2;
  const line = (yy: number): Pt[] =>
    Array.from({ length: 9 }, (_, k) => {
      const x = -10 + (k / 8) * (W + 20);
      return [x, yy + Math.sin(phase + (k / 8) * Math.PI * 2 * freq) * amplitude + (rng() - 0.5) * amplitude * 0.5] as Pt;
    });
  const out: ReactNode[] = [];
  let y = -20 - amplitude;
  let top = line(y);
  let i = 0;
  while (y < H + 20 + amplitude) {
    y += range(rng, minH, maxH);
    const bottom = line(y);
    out.push(<path key={`b${i}`} d={bandPath(top, bottom)} fill={colors[i % colors.length]} opacity={opacity} />);
    top = bottom;
    i++;
  }
  return out;
}

function textureLayer(texture: RockTexture, rng: Rng, palette: Palette, seed: string): ReactNode {
  const [light, mid, dark, accent = mid] = palette;
  switch (texture) {
    case "granular":
      return Array.from({ length: 380 }, (_, i) => (
        <path
          key={i}
          d={grainPath(rng, range(rng, 40, 360), range(rng, 40, 262), range(rng, 2.5, 8.5), pick(rng, [4, 5, 6]))}
          fill={pick(rng, [light, light, mid, accent, dark, dark, "#f4f1ea"])}
          opacity={r1(range(rng, 0.7, 1))}
        />
      ));

    case "porphyritic":
      return (
        <>
          {speckles(rng, 260, [dark, mid])}
          {Array.from({ length: 46 }, (_, i) => {
            const x = range(rng, 50, 350);
            const y = range(rng, 50, 250);
            const w = range(rng, 5, 14);
            return (
              <rect
                key={i}
                x={r1(x)}
                y={r1(y)}
                width={r1(w)}
                height={r1(w * range(rng, 0.35, 0.7))}
                fill={pick(rng, [light, "#ece6da", accent])}
                opacity="0.92"
                transform={`rotate(${r1(range(rng, 0, 180))} ${r1(x)} ${r1(y)})`}
              />
            );
          })}
        </>
      );

    case "glassy":
      return (
        <>
          {Array.from({ length: 7 }, (_, i) => {
            const cx = 150 + i * 6;
            const cy = 120 + i * 4;
            const r = 30 + i * 22;
            return (
              <path
                key={i}
                d={`M${cx - r} ${cy + r * 0.2} Q${cx} ${cy - r * 0.9} ${cx + r} ${cy + r * 0.3}`}
                fill="none"
                stroke={light}
                strokeOpacity={0.16 - i * 0.015}
                strokeWidth="2"
              />
            );
          })}
          <path d="M120 92 L190 78 L170 96 Z" fill="#fff" opacity="0.5" />
          <path d="M215 76 L262 84 L238 92 Z" fill="#fff" opacity="0.22" />
        </>
      );

    case "vesicular":
      return (
        <>
          {speckles(rng, 200, [mid, dark])}
          {Array.from({ length: 150 }, (_, i) => {
            const rx = range(rng, 1.5, 6.5);
            return (
              <ellipse
                key={i}
                cx={r1(range(rng, 40, 360))}
                cy={r1(range(rng, 40, 262))}
                rx={r1(rx)}
                ry={r1(rx * range(rng, 0.5, 0.9))}
                fill={dark}
                opacity="0.7"
                stroke={light}
                strokeOpacity="0.35"
                strokeWidth="0.8"
              />
            );
          })}
        </>
      );

    case "fine":
      return (
        <>
          {speckles(rng, 320, [light, dark, mid], [0.4, 1.1])}
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={`v${i}`} cx={r1(range(rng, 60, 340))} cy={r1(range(rng, 60, 240))} r={r1(range(rng, 1, 3))} fill={dark} opacity="0.75" />
          ))}
        </>
      );

    case "flow-banded":
      return (
        <>
          {bands(rng, [light, mid, accent, mid], 8, 22, 14, 0.55)}
          {speckles(rng, 160, [dark, light], [0.4, 1])}
        </>
      );

    case "layered":
      return (
        <>
          {bands(rng, [light, mid, accent, light, dark], 12, 34, 5, 0.85)}
          {speckles(rng, 520, [dark, light, "#fff8e8"], [0.4, 1.1])}
        </>
      );

    case "laminated":
      return (
        <>
          {bands(rng, [mid, dark, mid, accent], 4, 9, 2, 0.6)}
          {Array.from({ length: 50 }, (_, i) => (
            <path key={`l${i}`} d={polyline(wavyLine(rng, 10 + i * 6, 1.5))} fill="none" stroke={light} strokeOpacity="0.12" strokeWidth="0.8" />
          ))}
        </>
      );

    case "clastic": {
      const grads = [light, mid, accent, dark].map((c, i) => ({ id: svgId(seed, `peb${i}`), c }));
      return (
        <>
          <defs>
            {grads.map((g) => (
              <radialGradient key={g.id} id={g.id} cx="35%" cy="30%" r="75%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="0.25" stopColor={g.c} />
                <stop offset="1" stopColor="#000" stopOpacity="0.55" />
              </radialGradient>
            ))}
          </defs>
          {speckles(rng, 700, [light, dark, mid, "#fff6e0"], [0.4, 1.2])}
          {Array.from({ length: 30 }, (_, i) => {
            const rx = range(rng, 7, 22);
            const cx = range(rng, 50, 350);
            const cy = range(rng, 50, 255);
            const g = pick(rng, grads);
            return (
              <g key={i}>
                <ellipse cx={r1(cx)} cy={r1(cy)} rx={r1(rx)} ry={r1(rx * range(rng, 0.55, 0.9))} fill={g.c} transform={`rotate(${r1(range(rng, 0, 180))} ${r1(cx)} ${r1(cy)})`} />
                <ellipse cx={r1(cx)} cy={r1(cy)} rx={r1(rx)} ry={r1(rx * 0.75)} fill={`url(#${g.id})`} opacity="0.85" />
              </g>
            );
          })}
        </>
      );
    }

    case "fossiliferous":
      return (
        <>
          {speckles(rng, 420, [dark, mid, light], [0.4, 1.2])}
          {Array.from({ length: 38 }, (_, i) => {
            const x = range(rng, 50, 350);
            const y = range(rng, 50, 250);
            const s = range(rng, 5, 13);
            const rot = range(rng, 0, 360);
            if (rng() < 0.65) {
              // shell fragment: little fan with ribs
              const ribs = Array.from({ length: 5 }, (_, k) => {
                const a = Math.PI * (0.15 + (k / 4) * 0.7);
                return `M0 0 L${r1(Math.cos(a) * s)} ${r1(-Math.sin(a) * s)}`;
              }).join(" ");
              return (
                <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(rot)})`}>
                  <path d={`M${-s} 0 A${s} ${s} 0 0 1 ${s} 0 Z`} fill={light} opacity="0.85" />
                  <path d={ribs} stroke={mid} strokeWidth="0.7" opacity="0.8" />
                </g>
              );
            }
            // crinoid columnal / cross-section
            return (
              <g key={i} transform={`translate(${r1(x)} ${r1(y)})`}>
                <circle r={r1(s * 0.5)} fill={light} opacity="0.85" />
                <circle r={r1(s * 0.14)} fill={mid} />
              </g>
            );
          })}
        </>
      );

    case "chalky":
      return (
        <>
          {speckles(rng, 260, [mid, "#ffffff"], [0.4, 1])}
          <path d={smoothClosedPath(blobPoints(rng, 268, 188, 34, 22, 9, 0.3))} fill={accent} opacity="0.9" />
          <path d={smoothClosedPath(blobPoints(rng, 262, 182, 20, 10, 8, 0.3))} fill="#5c6670" opacity="0.6" />
        </>
      );

    case "coal":
      return (
        <>
          {bands(rng, [mid, dark, mid, light], 6, 16, 3, 0.7)}
          {Array.from({ length: 16 }, (_, i) => {
            const y = range(rng, 60, 240);
            return (
              <path key={`g${i}`} d={`M${r1(range(rng, 40, 200))} ${r1(y)} l${r1(range(rng, 40, 140))} ${r1(range(rng, -6, 6))}`} stroke="#e8f0ff" strokeOpacity={r1(range(rng, 0.08, 0.3))} strokeWidth={r1(range(rng, 0.8, 2.4))} />
            );
          })}
          <path d="M120 100 L200 92 L176 104 Z" fill="#fff" opacity="0.35" />
        </>
      );

    case "crystalline":
      return (
        <>
          {mosaic(rng, [light, mid, accent, "#ffffff"])}
          {speckles(rng, 120, ["#ffffff"], [0.5, 1.4])}
        </>
      );

    case "veined":
      return (
        <>
          {mosaic(rng, [light, "#ffffff", mid], 22, 16, [0.12, 0.35])}
          {Array.from({ length: 6 }, (_, i) => {
            const pts: Pt[] = [];
            let x = range(rng, 20, 380);
            let y = -10;
            while (y < H + 20) {
              pts.push([x, y]);
              x += range(rng, -26, 26);
              y += range(rng, 16, 34);
            }
            return (
              <path
                key={`v${i}`}
                d={polyline(pts)}
                fill="none"
                stroke={i % 2 ? dark : accent}
                strokeOpacity={r1(range(rng, 0.25, 0.6))}
                strokeWidth={r1(range(rng, 0.8, 3.2))}
                strokeLinejoin="round"
              />
            );
          })}
        </>
      );

    case "foliated":
      return (
        <g transform="rotate(-16 200 150)">
          {bands(rng, [mid, dark, mid, accent], 10, 28, 1, 0.5)}
          {Array.from({ length: 70 }, (_, i) => (
            <line key={i} x1="-60" y1={-40 + i * 6} x2="460" y2={-40 + i * 6} stroke={light} strokeOpacity={r1(range(rng, 0.04, 0.16))} strokeWidth="0.8" />
          ))}
        </g>
      );

    case "schistose":
      return (
        <g transform="rotate(-10 200 150)">
          {Array.from({ length: 42 }, (_, i) => (
            <path key={i} d={polyline(wavyLine(rng, -30 + i * 9, 6, 10))} fill="none" stroke={pick(rng, [mid, dark, accent])} strokeOpacity="0.55" strokeWidth={r1(range(rng, 1.5, 4))} />
          ))}
          {speckles(rng, 300, ["#ffffff", "#f6f1e0", light], [0.4, 1.3])}
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={`gt${i}`} cx={r1(range(rng, 60, 340))} cy={r1(range(rng, 60, 240))} r={r1(range(rng, 3, 6))} fill="#8b2c2c" stroke="#3a0e0e" strokeWidth="0.6" opacity="0.9" />
          ))}
        </g>
      );

    case "banded":
      return (
        <g transform="rotate(-8 200 150)">
          {bands(rng, [light, dark, light, mid, dark], 9, 26, 12, 0.92)}
          {speckles(rng, 520, [dark, light, "#ffffff", accent], [0.5, 1.6])}
        </g>
      );
  }
}

/**
 * A rock specimen (outline + texture + lighting) as an SVG group.
 * `children` are drawn on the rock surface, under the lighting — used for fossils.
 */
export function RockSpecimen({
  seed,
  texture,
  palette,
  cx = 200,
  cy = 148,
  rx = 150,
  ry = 104,
  children,
}: {
  seed: string;
  texture: RockTexture;
  palette: Palette;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  children?: ReactNode;
}) {
  const rng = seededRandom(seed);
  const clip = svgId(seed, "clip");
  const base = svgId(seed, "base");
  const noise = svgId(seed, "noise");
  const noiseLight = svgId(seed, "noiseL");
  const angular = texture === "glassy" || texture === "coal";
  const pts = blobPoints(rng, cx, cy, rx, ry, angular ? 8 : 12, angular ? 0.22 : 0.13);
  const outline = angular ? `${polyline(pts)} Z` : smoothClosedPath(pts);
  const [light, mid, dark] = palette;

  return (
    <g>
      <ContactShadow seed={seed} cx={cx} cy={cy + ry * 0.98} rx={rx * 0.92} />
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
        <linearGradient id={base} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <NoiseFilter id={noise} frequency={texture === "glassy" ? 0.4 : 0.85} opacity={texture === "glassy" ? 0.12 : 0.32} />
        <NoiseFilter id={noiseLight} frequency={1.6} octaves={2} opacity={0.18} light />
      </defs>
      <path d={outline} fill={`url(#${base})`} />
      <g clipPath={`url(#${clip})`}>
        {textureLayer(texture, rng, palette, seed)}
        <rect width={W} height={H} filter={`url(#${noise})`} />
        {texture !== "glassy" && <rect width={W} height={H} filter={`url(#${noiseLight})`} />}
        {children}
      </g>
      <VolumeLighting seed={seed} clipId={clip} />
      <path d={outline} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" />
    </g>
  );
}

export function RockArt({
  seed,
  texture,
  palette,
  className,
  title,
}: {
  seed: string;
  texture: RockTexture;
  palette: Palette;
  className?: string;
  title?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={title}>
      <Backdrop seed={seed} />
      <RockSpecimen seed={seed} texture={texture} palette={palette} />
    </svg>
  );
}
