import type { ReactNode } from "react";
import { spiralPath } from "@/lib/brand/mark-geometry";
import type { FossilForm, RockTexture } from "@/lib/library/types";
import { seededRandom } from "@/lib/utils";
import { Backdrop, ContactShadow, H, NoiseFilter, W, blobPoints, r1, range, smoothClosedPath, svgId, type Pt } from "./art-utils";
import { RockSpecimen } from "./RockArt";

type Colors = { light: string; dark: string; seed: string };

/** Fossil gradient + relief shadow helpers. */
function FossilDefs({ seed, light, dark }: Colors) {
  return (
    <defs>
      <linearGradient id={svgId(seed, "fg")} x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor={light} />
        <stop offset="1" stopColor={dark} />
      </linearGradient>
      <radialGradient id={svgId(seed, "fr")} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor={light} />
        <stop offset="0.7" stopColor={dark} />
        <stop offset="1" stopColor="#000" stopOpacity="0.8" />
      </radialGradient>
      <filter id={svgId(seed, "relief")} x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2.5" dy="3" stdDeviation="2.2" floodColor="#000" floodOpacity="0.55" />
      </filter>
    </defs>
  );
}

// ---- marine ---------------------------------------------------------------------------------

function Ammonite({ seed, light, dark }: Colors) {
  const cx = 200;
  const cy = 146;
  const R = 92;
  const turns = 3.3;
  const thetaMax = turns * Math.PI * 2;
  const b = Math.log(R / 0.9) / thetaMax;
  const a = R / Math.exp(b * thetaMax);
  const whorl = Math.exp(b * Math.PI * 2);
  const ribs: string[] = [];
  for (let t = thetaMax; t > thetaMax - Math.PI * 2 * 2.6; t -= 0.13) {
    const ro = a * Math.exp(b * t);
    const ri = ro / whorl;
    const ang = t + Math.PI;
    const bend = 0.18;
    const x1 = cx + ri * Math.cos(ang);
    const y1 = cy + ri * Math.sin(ang);
    const x2 = cx + ro * Math.cos(ang - bend * 0.3);
    const y2 = cy + ro * Math.sin(ang - bend * 0.3);
    const mx = cx + ((ri + ro) / 2) * Math.cos(ang + bend);
    const my = cy + ((ri + ro) / 2) * Math.sin(ang + bend);
    ribs.push(`M${r1(x1)} ${r1(y1)} Q${r1(mx)} ${r1(my)} ${r1(x2)} ${r1(y2)}`);
  }
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      <circle cx={cx} cy={cy} r={R} fill={`url(#${svgId(seed, "fr")})`} />
      <path d={ribs.join(" ")} stroke={dark} strokeOpacity="0.75" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={ribs.join(" ")} stroke={light} strokeOpacity="0.35" strokeWidth="1" fill="none" transform="translate(-1.2 -1.2)" />
      <path d={spiralPath(cx, cy, R, turns, 220)} stroke="#1b120a" strokeOpacity="0.85" strokeWidth="2.6" fill="none" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#1b120a" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx={cx + 4} cy={cy + 2} r={9} fill="#1b120a" opacity="0.55" />
    </g>
  );
}

function Trilobite({ seed, light, dark }: Colors) {
  const fill = `url(#${svgId(seed, "fg")})`;
  const segments: ReactNode[] = [];
  for (let i = 0; i < 11; i++) {
    const y = 112 + i * 8.6;
    const half = 66 - i * 2.2;
    segments.push(
      <g key={i}>
        <path
          d={`M${200 - half} ${y + 4} Q${200 - half * 0.6} ${y - 2} 200 ${y - 1} Q${200 + half * 0.6} ${y - 2} ${200 + half} ${y + 4} L${200 + half - 3} ${y + 10} Q200 ${y + 6} ${200 - half + 3} ${y + 10} Z`}
          fill={fill}
          stroke="#1a130c"
          strokeOpacity="0.7"
          strokeWidth="1.2"
        />
        <rect x={186 - i * 0.3} y={y - 1} width={28 - i * 0.6} height="8" rx="4" fill={light} opacity="0.9" stroke="#1a130c" strokeOpacity="0.6" />
      </g>,
    );
  }
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      {/* genal spines */}
      <path d="M134 108 Q118 140 112 178 Q126 142 146 112 Z" fill={dark} stroke="#1a130c" strokeOpacity="0.6" />
      <path d="M266 108 Q282 140 288 178 Q274 142 254 112 Z" fill={dark} stroke="#1a130c" strokeOpacity="0.6" />
      {/* cephalon */}
      <path d="M130 112 Q132 56 200 52 Q268 56 270 112 Q200 102 130 112 Z" fill={fill} stroke="#1a130c" strokeOpacity="0.75" strokeWidth="1.5" />
      <ellipse cx="200" cy="80" rx="19" ry="24" fill={light} stroke="#1a130c" strokeOpacity="0.6" />
      <path d="M160 86 q8 -12 18 -2" stroke="#1a130c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M240 86 q-8 -12 -18 -2" stroke="#1a130c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      {segments}
      {/* pygidium */}
      <path d="M156 207 Q200 252 244 207 Q200 214 156 207 Z" fill={fill} stroke="#1a130c" strokeOpacity="0.7" strokeWidth="1.3" />
      <path d="M190 209 Q200 236 210 209 Z" fill={light} opacity="0.85" />
    </g>
  );
}

function Brachiopod({ seed, light, dark }: Colors) {
  const outline = "M200 66 C262 66 296 128 290 176 C284 222 244 242 200 242 C156 242 116 222 110 176 C104 128 138 66 200 66 Z";
  const clip = svgId(seed, "brclip");
  const ribs = Array.from({ length: 26 }, (_, i) => {
    const a = Math.PI * (0.04 + (i / 25) * 0.92);
    return `M200 72 L${r1(200 - Math.cos(a) * 160)} ${r1(72 + Math.sin(a) * 190)}`;
  }).join(" ");
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d={outline} fill={`url(#${svgId(seed, "fr")})`} />
      <g clipPath={`url(#${clip})`}>
        <path d={ribs} stroke={dark} strokeOpacity="0.6" strokeWidth="2.4" />
        <path d={ribs} stroke={light} strokeOpacity="0.35" strokeWidth="1" transform="translate(-1.5 0)" />
        {[0.42, 0.62, 0.8, 0.93].map((k) => (
          <path
            key={k}
            d={outline}
            fill="none"
            stroke="#1a130c"
            strokeOpacity="0.35"
            strokeWidth="1.4"
            transform={`translate(${r1(200 - 200 * k)} ${r1(66 - 66 * k)}) scale(${k})`}
          />
        ))}
        <path d="M200 70 C214 120 222 190 214 242 L186 242 C178 190 186 120 200 70 Z" fill={light} opacity="0.18" />
      </g>
      <path d="M166 76 L234 76" stroke="#1a130c" strokeWidth="2.4" strokeOpacity="0.7" />
      <path d={outline} fill="none" stroke="#1a130c" strokeOpacity="0.7" strokeWidth="1.6" />
    </g>
  );
}

function Crinoid({ seed, light, dark }: Colors) {
  const rng = seededRandom(`${seed}-crinoid`);
  const stem: ReactNode[] = [];
  for (let i = 0; i < 24; i++) {
    const t = i / 23;
    const x = 96 + t * 120 + Math.sin(t * 3) * 10;
    const y = 262 - t * 140;
    stem.push(
      <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(-48)`}>
        <rect x="-11" y="-3.4" width="22" height="6.8" rx="2.5" fill={i % 2 ? light : dark} stroke="#1a130c" strokeOpacity="0.55" strokeWidth="0.8" />
      </g>,
    );
  }
  const arms = Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI * (0.18 + (i / 8) * 0.62);
    const len = 70 + rng() * 26;
    const ex = 226 + Math.cos(a) * len;
    const ey = 104 + Math.sin(a) * len;
    const cx = 226 + Math.cos(a + 0.25) * len * 0.55;
    const cy = 104 + Math.sin(a + 0.25) * len * 0.55;
    const d = `M226 104 Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)}`;
    const pinnules = Array.from({ length: 9 }, (_, k) => {
      const t = (k + 1) / 10;
      const px = (1 - t) * (1 - t) * 226 + 2 * (1 - t) * t * cx + t * t * ex;
      const py = (1 - t) * (1 - t) * 104 + 2 * (1 - t) * t * cy + t * t * ey;
      return `M${r1(px)} ${r1(py)} l${r1(Math.cos(a + 1.1) * 7)} ${r1(Math.sin(a + 1.1) * 7)}`;
    }).join(" ");
    return (
      <g key={i}>
        <path d={d} stroke={light} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d={d} stroke="#1a130c" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        <path d={pinnules} stroke={light} strokeOpacity="0.8" strokeWidth="1.4" />
      </g>
    );
  });
  const loose = Array.from({ length: 9 }, (_, i) => {
    const x = range(rng, 70, 340);
    const y = range(rng, 160, 240);
    if (x > 120 && x < 230 && y > 150) return null;
    return (
      <g key={`c${i}`} transform={`translate(${r1(x)} ${r1(y)})`}>
        <circle r="7" fill={light} stroke="#1a130c" strokeOpacity="0.5" />
        <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill={dark} />
      </g>
    );
  });
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      {loose}
      {stem}
      <path d="M206 120 Q204 96 226 90 Q250 96 246 120 Q226 130 206 120 Z" fill={dark} stroke="#1a130c" strokeOpacity="0.6" />
      {arms}
    </g>
  );
}

function SharkTooth({ seed, light, dark }: Colors) {
  const serr = (from: Pt, to: Pt, n: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = from[0] + (to[0] - from[0]) * t;
      const y = from[1] + (to[1] - from[1]) * t;
      const off = i % 2 ? 2.4 : 0;
      pts.push(`${r1(x + (from[0] < to[0] ? off : -off))} ${r1(y)}`);
    }
    return pts.join(" L");
  };
  const blade = `M200 40 L${serr([200, 40], [276, 200], 40)} L124 200 L${serr([124, 200], [200, 40], 40)} Z`;
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      <path d="M120 194 Q114 232 146 246 Q174 252 190 230 Q200 218 210 230 Q226 252 254 246 Q286 232 280 194 Z" fill="#8a6a46" stroke="#2b1c0e" strokeOpacity="0.7" strokeWidth="1.5" />
      <path d="M126 204 Q200 222 274 204" stroke="#2b1c0e" strokeOpacity="0.4" strokeWidth="1.2" fill="none" />
      <path d={blade} fill={`url(#${svgId(seed, "fg")})`} stroke="#0d1216" strokeOpacity="0.8" strokeWidth="1.2" />
      <path d="M132 196 Q200 210 268 196 L262 186 Q200 198 138 186 Z" fill="#1b1f22" opacity="0.75" />
      <path d="M186 62 Q178 120 168 176" stroke={light} strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M210 70 Q220 130 232 170" stroke={dark} strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}

function Coral({ seed, light, dark }: Colors) {
  const clip = svgId(seed, "coclip");
  const cells: ReactNode[] = [];
  const r = 12;
  const dx = r * Math.sqrt(3);
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const x = 70 + col * dx + (row % 2 ? dx / 2 : 0);
      const y = 52 + row * r * 1.5;
      const hex = Array.from({ length: 6 }, (_, k) => {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        return `${r1(x + Math.cos(a) * r)},${r1(y + Math.sin(a) * r)}`;
      }).join(" ");
      cells.push(
        <g key={`${row}-${col}`}>
          <polygon points={hex} fill={light} stroke="#1a130c" strokeOpacity="0.7" strokeWidth="1.6" />
          <circle cx={r1(x)} cy={r1(y)} r={r * 0.42} fill={dark} opacity="0.85" />
        </g>,
      );
    }
  }
  return (
    <g filter={`url(#${svgId(seed, "relief")})`}>
      <defs>
        <clipPath id={clip}>
          <path d="M92 210 C86 140 130 74 200 72 C270 74 316 140 308 210 C260 236 140 236 92 210 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>{cells}</g>
      <path d="M92 210 C86 140 130 74 200 72 C270 74 316 140 308 210 C260 236 140 236 92 210 Z" fill={`url(#${svgId(seed, "fr")})`} opacity="0.35" />
    </g>
  );
}

function Belemnite({ seed, light, dark }: Colors) {
  return (
    <g filter={`url(#${svgId(seed, "relief")})`} transform="rotate(-12 200 150)">
      <path d="M86 150 Q86 128 110 127 L272 134 Q330 150 272 166 L110 173 Q86 172 86 150 Z" fill={`url(#${svgId(seed, "fg")})`} stroke="#2a1505" strokeOpacity="0.7" strokeWidth="1.4" />
      <path d="M92 150 L118 140 L118 160 Z" fill="#2a1505" opacity="0.7" />
      <path d="M120 150 L316 150" stroke="#2a1505" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="5 4" />
      <path d="M118 135 Q200 134 272 140" stroke={light} strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M118 166 Q200 166 272 160" stroke={dark} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

// ---- terrestrial ---------------------------------------------------------------------------

function Fern({ light, dark }: Colors) {
  const p0: Pt = [110, 262];
  const p1: Pt = [170, 120];
  const p2: Pt = [300, 50];
  const at = (t: number): Pt => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
  ];
  const pinnae: ReactNode[] = [];
  for (let i = 0; i < 18; i++) {
    const t = 0.06 + (i / 17) * 0.88;
    const [x, y] = at(t);
    const [x2, y2] = at(Math.min(1, t + 0.01));
    const ang = Math.atan2(y2 - y, x2 - x);
    const len = 70 * (1 - t * 0.75);
    for (const side of [-1, 1]) {
      const a = ang + side * 1.05;
      const leaflets = Array.from({ length: 8 }, (_, k) => {
        const s = (k + 0.5) / 8;
        const lx = x + Math.cos(a) * len * s;
        const ly = y + Math.sin(a) * len * s;
        const size = (1 - s * 0.6) * len * 0.09 + 1.5;
        return (
          <ellipse
            key={k}
            cx={r1(lx)}
            cy={r1(ly)}
            rx={r1(size)}
            ry={r1(size * 0.6)}
            transform={`rotate(${r1((a * 180) / Math.PI + 90)} ${r1(lx)} ${r1(ly)})`}
            fill={k % 2 ? dark : light}
            opacity="0.9"
          />
        );
      });
      pinnae.push(
        <g key={`${i}${side}`}>
          <path d={`M${r1(x)} ${r1(y)} L${r1(x + Math.cos(a) * len)} ${r1(y + Math.sin(a) * len)}`} stroke={dark} strokeWidth="1.2" />
          {leaflets}
        </g>,
      );
    }
  }
  return (
    <g opacity="0.92">
      <path d={`M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`} stroke={dark} strokeWidth="4" fill="none" strokeLinecap="round" />
      {pinnae}
    </g>
  );
}

function PetrifiedWood({ seed, light, dark }: Colors) {
  const rng = seededRandom(`${seed}-wood`);
  const colors = [light, "#d9a35b", "#b5562f", "#8a3a22", "#e8c27a", "#a8642e"];
  const rings = Array.from({ length: 13 }, (_, i) => {
    const k = 1 - i / 13;
    return (
      <path
        key={i}
        d={smoothClosedPath(blobPoints(rng, 200 + (1 - k) * 8, 146 + (1 - k) * 4, 128 * k, 88 * k, 16, 0.05))}
        fill={colors[i % colors.length]}
        stroke="#3a1a0c"
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
    );
  });
  const cracks = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + rng();
    const l = 60 + rng() * 50;
    return <path key={`k${i}`} d={`M208 150 L${r1(208 + Math.cos(a) * l)} ${r1(150 + Math.sin(a) * l * 0.68)}`} stroke="#2a1006" strokeOpacity="0.55" strokeWidth={r1(1 + rng() * 1.6)} />;
  });
  const clip = svgId(seed, "woodclip");
  const outline = smoothClosedPath(blobPoints(rng, 200, 146, 146, 100, 16, 0.04));
  return (
    <g>
      <ContactShadow seed={seed} cx={200} cy={250} rx={130} />
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
        <NoiseFilter id={svgId(seed, "woodnoise")} frequency={1.2} opacity={0.3} />
      </defs>
      <path d={outline} fill={dark} />
      <g clipPath={`url(#${clip})`}>
        {rings}
        {cracks}
        <circle cx="208" cy="150" r="5" fill="#2a1006" />
        <rect width={W} height={H} filter={`url(#${svgId(seed, "woodnoise")})`} />
        <ellipse cx="150" cy="96" rx="90" ry="30" fill="#fff" opacity="0.16" transform="rotate(-12 150 96)" />
      </g>
      <path d={outline} fill="none" stroke="#2a1006" strokeWidth="9" strokeOpacity="0.85" />
    </g>
  );
}

function DinosaurBone({ seed, light, dark }: Colors) {
  const rng = seededRandom(`${seed}-bone`);
  const outline = "M70 160 C58 128 84 104 112 116 C150 128 230 124 286 104 C316 94 344 116 336 146 C330 172 344 196 316 204 C288 212 258 186 220 182 C176 178 140 196 108 200 C80 204 64 186 70 160 Z";
  const clip = svgId(seed, "boneclip");
  const cells = Array.from({ length: 70 }, (_, i) => {
    const a = rng() * Math.PI * 2;
    const d = Math.sqrt(rng());
    return (
      <circle key={i} cx={r1(310 + Math.cos(a) * d * 24)} cy={r1(152 + Math.sin(a) * d * 40)} r={r1(1.5 + rng() * 3)} fill="#1a0f08" opacity="0.75" />
    );
  });
  return (
    <g>
      <ContactShadow seed={seed} cx={200} cy={236} rx={140} />
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
        <NoiseFilter id={svgId(seed, "bonenoise")} frequency={0.9} opacity={0.4} />
      </defs>
      <path d={outline} fill={`url(#${svgId(seed, "fg")})`} />
      <g clipPath={`url(#${clip})`}>
        <rect width={W} height={H} filter={`url(#${svgId(seed, "bonenoise")})`} />
        <ellipse cx="310" cy="152" rx="28" ry="46" fill={light} opacity="0.85" />
        {cells}
        <path d="M110 132 C160 140 230 136 286 120" stroke="#fff" strokeOpacity="0.25" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M110 190 C160 184 220 176 290 196" stroke="#000" strokeOpacity="0.35" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      <path d={outline} fill="none" stroke={dark} strokeWidth="1.5" strokeOpacity="0.9" />
    </g>
  );
}

function Amber({ seed, light, dark }: Colors) {
  const rng = seededRandom(`${seed}-amber`);
  const outline = smoothClosedPath(blobPoints(rng, 200, 146, 128, 94, 10, 0.1));
  const grad = svgId(seed, "amberg");
  const clip = svgId(seed, "amberclip");
  return (
    <g>
      <ContactShadow seed={seed} cx={200} cy={244} rx={120} />
      <defs>
        <radialGradient id={grad} cx="45%" cy="42%" r="70%">
          <stop offset="0" stopColor="#ffd56a" />
          <stop offset="0.45" stopColor={light} />
          <stop offset="0.85" stopColor={dark} />
          <stop offset="1" stopColor="#3d1704" />
        </radialGradient>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
      </defs>
      <path d={outline} fill={`url(#${grad})`} />
      <g clipPath={`url(#${clip})`}>
        {/* trapped insect */}
        <g transform="translate(200 150) rotate(-18)" opacity="0.8">
          <ellipse cx="-30" cy="-22" rx="34" ry="11" fill="#fff6dc" opacity="0.35" transform="rotate(-30 -30 -22)" />
          <ellipse cx="-24" cy="20" rx="32" ry="10" fill="#fff6dc" opacity="0.3" transform="rotate(28 -24 20)" />
          <ellipse cx="22" cy="0" rx="26" ry="6" fill="#3b1a07" />
          <ellipse cx="-6" cy="0" rx="9" ry="7" fill="#3b1a07" />
          <circle cx="-18" cy="0" r="5.5" fill="#3b1a07" />
          <path
            d="M-4 4 L-14 22 M2 5 L0 26 M8 5 L18 24 M-4 -4 L-14 -22 M2 -5 L0 -26 M8 -5 L18 -24 M-22 -2 L-40 -14 M-22 2 L-40 14"
            stroke="#3b1a07"
            strokeWidth="1.4"
            fill="none"
          />
        </g>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={r1(range(rng, 100, 300))} cy={r1(range(rng, 80, 220))} r={r1(range(rng, 1, 3.5))} fill="#fff" opacity="0.35" />
        ))}
        <ellipse cx="160" cy="92" rx="56" ry="18" fill="#fff" opacity="0.4" transform="rotate(-18 160 92)" />
        <ellipse cx="270" cy="200" rx="30" ry="8" fill="#fff" opacity="0.12" transform="rotate(-25 270 200)" />
      </g>
      <path d={outline} fill="none" stroke="#3d1704" strokeOpacity="0.6" strokeWidth="1.5" />
    </g>
  );
}

function Footprint({ light, dark }: Colors) {
  const toe = (angle: number, length: number) => {
    const rad = (angle * Math.PI) / 180;
    const ox = 200 + Math.sin(rad) * 18;
    const oy = 196 - Math.cos(rad) * 18;
    return (
      <g transform={`translate(${r1(ox)} ${r1(oy)}) rotate(${angle})`}>
        <path d={`M-13 0 C-15 ${-length * 0.5} -8 ${-length} 0 ${-length - 10} C8 ${-length} 15 ${-length * 0.5} 13 0 Z`} fill={dark} opacity="0.85" />
        <path d={`M-9 -4 C-10 ${-length * 0.5} -5 ${-length * 0.9} 0 ${-length - 4}`} stroke="#000" strokeOpacity="0.35" strokeWidth="4" fill="none" />
        <path d={`M13 0 C15 ${-length * 0.5} 8 ${-length} 0 ${-length - 10}`} stroke={light} strokeOpacity="0.6" strokeWidth="2.5" fill="none" />
      </g>
    );
  };
  return (
    <g>
      {toe(-32, 66)}
      {toe(0, 86)}
      {toe(32, 66)}
      <path d="M176 200 C176 228 224 228 224 200 C214 186 186 186 176 200 Z" fill={dark} opacity="0.85" />
      <path d="M224 200 C224 226 190 230 178 212" stroke={light} strokeOpacity="0.5" strokeWidth="2.5" fill="none" />
    </g>
  );
}

// ---------------------------------------------------------------------------------------------

const MATRIX_TEXTURE: Partial<Record<FossilForm, RockTexture>> = {
  fern: "laminated",
  coral: "fine",
  footprint: "fine",
  crinoid: "fine",
};

const STANDALONE: FossilForm[] = ["shark-tooth", "petrified-wood", "dinosaur-bone", "amber"];

const SHAPES: Record<FossilForm, (c: Colors) => ReactNode> = {
  ammonite: Ammonite,
  trilobite: Trilobite,
  brachiopod: Brachiopod,
  crinoid: Crinoid,
  "shark-tooth": SharkTooth,
  coral: Coral,
  belemnite: Belemnite,
  fern: Fern,
  "petrified-wood": PetrifiedWood,
  "dinosaur-bone": DinosaurBone,
  amber: Amber,
  footprint: Footprint,
};

export function FossilScene({
  seed,
  form,
  matrix,
  fossil,
}: {
  seed: string;
  form: FossilForm;
  matrix: [string, string];
  fossil: [string, string];
}) {
  const colors: Colors = { seed, light: fossil[0], dark: fossil[1] };
  const Shape = SHAPES[form];
  if (STANDALONE.includes(form)) {
    return (
      <>
        <FossilDefs {...colors} />
        <Shape {...colors} />
      </>
    );
  }
  const mid = matrix[0];
  return (
    <>
      <FossilDefs {...colors} />
      <RockSpecimen
        seed={`${seed}-matrix`}
        texture={MATRIX_TEXTURE[form] ?? "fine"}
        palette={[matrix[0], mid, matrix[1]]}
        rx={168}
        ry={112}
        cy={146}
      >
        <Shape {...colors} />
      </RockSpecimen>
    </>
  );
}

export function FossilArt({
  seed,
  form,
  matrix,
  fossil,
  className,
  title,
}: {
  seed: string;
  form: FossilForm;
  matrix: [string, string];
  fossil: [string, string];
  className?: string;
  title?: string;
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={title}>
      <Backdrop seed={seed} />
      <FossilScene seed={seed} form={form} matrix={matrix} fossil={fossil} />
    </svg>
  );
}
