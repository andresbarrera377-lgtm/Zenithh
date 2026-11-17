import type { ReactNode } from "react";
import type { CrystalHabit } from "@/lib/library/types";
import { seededRandom } from "@/lib/utils";
import { Backdrop, ContactShadow, W, H, blobPoints, grainPath, r1, range, smoothClosedPath, svgId, type Rng } from "./art-utils";

type Pal = [string, string, string];

function face(points: Array<[number, number]>, fill: string, opacity = 1, stroke = "#ffffff", strokeOpacity = 0.25) {
  return (
    <polygon
      points={points.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ")}
      fill={fill}
      fillOpacity={opacity}
      stroke={stroke}
      strokeOpacity={strokeOpacity}
      strokeWidth="1"
      strokeLinejoin="round"
    />
  );
}

/** Hexagonal prism with pyramidal termination (quartz habit), drawn upright then rotated. */
function HexPrism({ x, y, w, h, angle, pal }: { x: number; y: number; w: number; h: number; angle: number; pal: Pal }) {
  const [light, mid, dark] = pal;
  const a = w / 2;
  const s = w / 6;
  const tip = h + w * 0.95;
  return (
    <g transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})`}>
      {face([[-a, 0], [-s, 4], [-s, -h + 4], [-a, -h]], mid, 0.82)}
      {face([[-s, 4], [s, 4], [s, -h + 4], [-s, -h + 4]], light, 0.78)}
      {face([[s, 4], [a, 0], [a, -h], [s, -h + 4]], dark, 0.85)}
      {face([[-a, -h], [-s, -h + 4], [0, -tip]], light, 0.9)}
      {face([[-s, -h + 4], [s, -h + 4], [0, -tip]], mid, 0.7)}
      {face([[s, -h + 4], [a, -h], [0, -tip]], dark, 0.9)}
      <line x1={-s * 0.3} y1={-h * 0.15} x2={-s * 0.3} y2={-h * 0.85} stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
    </g>
  );
}

/** Isometric box with optional striations. */
function IsoBox({
  x,
  y,
  sx,
  sy,
  sz,
  pal,
  striations = 0,
  opacity = 1,
}: {
  x: number;
  y: number;
  sx: number;
  sy: number;
  sz: number;
  pal: Pal;
  striations?: number;
  opacity?: number;
}) {
  const [light, mid, dark] = pal;
  const c = Math.cos(Math.PI / 6);
  const top: Array<[number, number]> = [
    [x, y - sz],
    [x + sx * c, y - sz + sx / 2],
    [x + sx * c - sy * c, y - sz + sx / 2 + sy / 2],
    [x - sy * c, y - sz + sy / 2],
  ];
  const left: Array<[number, number]> = [top[3], top[2], [top[2][0], top[2][1] + sz], [top[3][0], top[3][1] + sz]];
  const right: Array<[number, number]> = [top[2], top[1], [top[1][0], top[1][1] + sz], [top[2][0], top[2][1] + sz]];
  const lines: ReactNode[] = [];
  for (let i = 1; i <= striations; i++) {
    const t = i / (striations + 1);
    lines.push(
      <line
        key={`l${i}`}
        x1={r1(left[0][0] + (left[1][0] - left[0][0]) * t)}
        y1={r1(left[0][1] + (left[1][1] - left[0][1]) * t)}
        x2={r1(left[3][0] + (left[2][0] - left[3][0]) * t)}
        y2={r1(left[3][1] + (left[2][1] - left[3][1]) * t)}
        stroke="#000"
        strokeOpacity="0.18"
      />,
      <line
        key={`r${i}`}
        x1={r1(right[0][0])}
        y1={r1(right[0][1] + (right[3][1] - right[0][1]) * t)}
        x2={r1(right[1][0])}
        y2={r1(right[1][1] + (right[2][1] - right[1][1]) * t)}
        stroke="#000"
        strokeOpacity="0.18"
      />,
      <line
        key={`t${i}`}
        x1={r1(top[0][0] + (top[1][0] - top[0][0]) * t)}
        y1={r1(top[0][1] + (top[1][1] - top[0][1]) * t)}
        x2={r1(top[3][0] + (top[2][0] - top[3][0]) * t)}
        y2={r1(top[3][1] + (top[2][1] - top[3][1]) * t)}
        stroke="#000"
        strokeOpacity="0.14"
      />,
    );
  }
  return (
    <g>
      {face(left, mid, opacity)}
      {face(right, dark, opacity)}
      {face(top, light, opacity)}
      {lines}
    </g>
  );
}

function Druse({ rng, seed, color }: { rng: Rng; seed: string; color: string }) {
  return (
    <g>
      <ContactShadow seed={seed} cx={200} cy={250} rx={140} />
      <path d={smoothClosedPath(blobPoints(rng, 200, 236, 150, 26, 10, 0.12))} fill={color} />
      {Array.from({ length: 90 }, (_, i) => (
        <path key={i} d={grainPath(rng, range(rng, 70, 330), range(rng, 222, 250), range(rng, 2, 5), 4)} fill="#fff" opacity={r1(range(rng, 0.08, 0.3))} />
      ))}
    </g>
  );
}

function habit(h: CrystalHabit, pal: Pal, seed: string): ReactNode {
  const rng = seededRandom(seed);
  const [light, mid, dark] = pal;
  switch (h) {
    case "hex-prism":
      return (
        <>
          <Druse rng={rng} seed={seed} color="#3a3f44" />
          <HexPrism x={150} y={236} w={34} h={70} angle={-28} pal={pal} />
          <HexPrism x={262} y={236} w={30} h={64} angle={30} pal={pal} />
          <HexPrism x={232} y={240} w={40} h={96} angle={12} pal={pal} />
          <HexPrism x={184} y={240} w={48} h={120} angle={-6} pal={pal} />
          <HexPrism x={120} y={244} w={22} h={36} angle={-52} pal={pal} />
          <HexPrism x={298} y={244} w={22} h={34} angle={54} pal={pal} />
        </>
      );
    case "cube":
      return (
        <>
          <ContactShadow seed={seed} cx={200} cy={248} rx={130} />
          <IsoBox x={150} y={150} sx={80} sy={80} sz={80} pal={pal} striations={9} />
          <IsoBox x={250} y={176} sx={64} sy={64} sz={64} pal={pal} striations={7} />
          <IsoBox x={204} y={110} sx={46} sy={46} sz={46} pal={pal} striations={5} />
        </>
      );
    case "rhombohedron": {
      const pts = (k: number, ox: number, oy: number) => ({
        top: [[ox, oy - 70 * k], [ox + 90 * k, oy - 40 * k], [ox + 40 * k, oy + 0 * k], [ox - 50 * k, oy - 30 * k]] as Array<[number, number]>,
        left: [[ox - 50 * k, oy - 30 * k], [ox + 40 * k, oy], [ox + 20 * k, oy + 90 * k], [ox - 70 * k, oy + 60 * k]] as Array<[number, number]>,
        right: [[ox + 40 * k, oy], [ox + 90 * k, oy - 40 * k], [ox + 70 * k, oy + 50 * k], [ox + 20 * k, oy + 90 * k]] as Array<[number, number]>,
      });
      const p = pts(1, 190, 150);
      return (
        <>
          <ContactShadow seed={seed} cx={200} cy={252} rx={110} />
          {face(p.left, mid, 0.72)}
          {face(p.right, dark, 0.72)}
          {face(p.top, light, 0.7)}
          {/* faint back edges suggest transparency */}
          <path d="M140 210 L120 120 M140 210 L230 190" stroke="#fff" strokeOpacity="0.25" strokeDasharray="4 4" />
          <text x="166" y="188" fontSize="16" fontFamily="Space Grotesk Variable, ui-sans-serif, sans-serif" fill="#3a2a10" opacity="0.5">ROCK</text>
          <text x="169" y="192" fontSize="16" fontFamily="Space Grotesk Variable, ui-sans-serif, sans-serif" fill="#3a2a10" opacity="0.28">ROCK</text>
        </>
      );
    }
    case "sheets":
      return (
        <>
          <ContactShadow seed={seed} cx={200} cy={246} rx={130} />
          {Array.from({ length: 9 }, (_, i) => {
            const y = 210 - i * 7;
            const dx = (i % 3) * 3 - 3;
            const pts: Array<[number, number]> = [
              [110 + dx, y],
              [150 + dx, y - 38],
              [260 + dx, y - 38],
              [300 + dx, y],
              [260 + dx, y + 16],
              [150 + dx, y + 16],
            ];
            return <g key={i}>{face(pts, i === 8 ? light : i % 2 ? mid : dark, 0.95, "#fff", 0.35)}</g>;
          })}
          <path d="M170 140 L250 140" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "blocky":
      return (
        <>
          <ContactShadow seed={seed} cx={200} cy={250} rx={130} />
          <IsoBox x={170} y={150} sx={120} sy={60} sz={90} pal={pal} striations={4} />
          <IsoBox x={250} y={196} sx={60} sy={40} sz={50} pal={pal} striations={2} />
        </>
      );
    case "botryoidal": {
      const grad = svgId(seed, "bot");
      const balls = Array.from({ length: 22 }, () => ({
        x: range(rng, 110, 290),
        y: range(rng, 110, 220),
        r: range(rng, 18, 38),
      })).sort((a, b) => a.y - b.y);
      return (
        <>
          <defs>
            <radialGradient id={grad} cx="35%" cy="30%" r="70%">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.18" stopColor={light} />
              <stop offset="0.6" stopColor={mid} />
              <stop offset="1" stopColor={dark} />
            </radialGradient>
          </defs>
          <ContactShadow seed={seed} cx={200} cy={250} rx={130} />
          {balls.map((b, i) => (
            <circle key={i} cx={r1(b.x)} cy={r1(b.y)} r={r1(b.r)} fill={`url(#${grad})`} stroke="#000" strokeOpacity="0.35" />
          ))}
        </>
      );
    }
    case "granular": {
      const grad = svgId(seed, "gran");
      return (
        <>
          <defs>
            <radialGradient id={grad} cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="0.25" stopColor={light} />
              <stop offset="1" stopColor={dark} />
            </radialGradient>
          </defs>
          <ContactShadow seed={seed} cx={200} cy={250} rx={140} />
          {Array.from({ length: 110 }, (_, i) => {
            const t = rng();
            const x = 200 + (rng() - 0.5) * 280 * (1 - t * 0.5);
            const y = 238 - t * 120 + rng() * 10;
            return <path key={i} d={grainPath(rng, x, y, range(rng, 8, 16), 6)} fill={i % 3 ? `url(#${grad})` : mid} stroke="#0d2b10" strokeOpacity="0.5" />;
          })}
        </>
      );
    }
    case "bladed":
      return (
        <>
          <ContactShadow seed={seed} cx={200} cy={250} rx={120} />
          {[-34, -16, 0, 16, 34].map((ang, i) => (
            <g key={ang} transform={`translate(200 244) rotate(${ang})`}>
              {face([[-14, 0], [14, 0], [16, -170 + Math.abs(ang) * 1.6], [0, -196 + Math.abs(ang) * 1.6], [-16, -170 + Math.abs(ang) * 1.6]], i % 2 ? mid : light, 0.55, "#fff", 0.5)}
              {Array.from({ length: 5 }, (_, k) => (
                <line key={k} x1={-10 + k * 5} y1={-8} x2={-10 + k * 5} y2={-160 + Math.abs(ang) * 1.6} stroke="#fff" strokeOpacity="0.22" />
              ))}
            </g>
          ))}
        </>
      );
  }
}

export function CrystalArt({
  seed,
  habit: h,
  palette,
  className,
  title,
}: {
  seed: string;
  habit: CrystalHabit;
  palette: Pal;
  className?: string;
  title?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={title}>
      <Backdrop seed={seed} />
      {habit(h, palette, seed)}
    </svg>
  );
}
