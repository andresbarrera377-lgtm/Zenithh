import { useId } from "react";
import { FACET_LINES, MARK_RIBS, MARK_SPIRAL, STONE_POINTS } from "@/lib/brand/mark-geometry";
import { cn } from "@/lib/utils";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const uid = useId().replace(/:/g, "");
  const g = `mark-g-${uid}`;
  const s = `mark-s-${uid}`;
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8af5c6" />
          <stop offset="1" stopColor="#13a874" />
        </linearGradient>
        <linearGradient id={s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3431" />
          <stop offset="1" stopColor="#141918" />
        </linearGradient>
      </defs>
      <polygon
        points={STONE_POINTS}
        fill={`url(#${s})`}
        stroke={`url(#${g})`}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <g stroke="#4fe3a4" strokeOpacity={0.28} strokeWidth={0.9}>
        {FACET_LINES.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <path d={MARK_RIBS} stroke="#4fe3a4" strokeOpacity={0.45} strokeWidth={0.8} fill="none" strokeLinecap="round" />
      <path d={MARK_SPIRAL} stroke={`url(#${g})`} strokeWidth={2.3} fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-semibold tracking-tight text-chalk-50", className)}>
      Dr<span className="text-mineral-400">.</span>Rock
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8", markClassName)} />
      <Wordmark className={cn("text-xl", wordmarkClassName)} />
    </span>
  );
}
