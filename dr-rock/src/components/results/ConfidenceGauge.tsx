import { confidenceLevel } from "@/lib/analysis/presentation";
import { cn } from "@/lib/utils";

const strokeByTone = {
  mineral: "stroke-mineral-400",
  ochre: "stroke-ochre-400",
  jasper: "stroke-jasper-400",
  azurite: "stroke-azurite-400",
  granite: "stroke-granite-400",
} as const;

/** Radial gauge for the model's self-assessed confidence (0–100). */
export function ConfidenceGauge({
  value,
  label = "Confidence",
  size = 132,
  className,
}: {
  value: number;
  label?: string;
  size?: number;
  className?: string;
}) {
  const level = confidenceLevel(value);
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const arc = 0.75; // 270° gauge
  const dash = circumference * arc;
  const filled = dash * (Math.max(0, Math.min(100, value)) / 100);

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-[225deg]" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-granite-800" strokeDasharray={`${dash} ${circumference}`} />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className={cn(strokeByTone[level.tone], "transition-[stroke-dasharray] duration-1000 ease-out")}
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
        <span className="font-display text-3xl font-semibold tabular-nums text-chalk-50">
          {value}
          <span className="text-base text-granite-400">%</span>
        </span>
        <span className="label-mono mt-0.5 text-granite-400">{level.label}</span>
      </div>
    </div>
  );
}
