import { cn } from "@/lib/utils";

const REFERENCE = ["Talc", "Gypsum", "Calcite", "Fluorite", "Apatite", "Orthoclase", "Quartz", "Topaz", "Corundum", "Diamond"];

/** Mohs hardness scale (1–10) with the specimen's typical range highlighted. */
export function MohsScale({ min, max, className }: { min: number | null; max: number | null; className?: string }) {
  const lo = min ?? max;
  const hi = max ?? min;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-10 gap-1">
        {REFERENCE.map((name, i) => {
          const value = i + 1;
          const active = lo != null && hi != null && value >= Math.floor(lo) && value <= Math.ceil(hi);
          return (
            <div key={name} className="space-y-1.5 text-center">
              <div
                className={cn(
                  "h-8 rounded-md font-mono text-xs leading-8 transition-colors",
                  active ? "bg-mineral-400 font-semibold text-carbon-950" : "bg-granite-800 text-granite-400",
                )}
              >
                {value}
              </div>
              <p className="hidden truncate text-[9px] text-granite-500 sm:block">{name}</p>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-granite-300">
        {lo == null ? (
          "Hardness can't be estimated for this specimen."
        ) : (
          <>
            Typical hardness: <span className="font-mono text-mineral-300">{lo === hi ? lo : `${lo} – ${hi}`}</span> on the Mohs
            scale. For reference, a fingernail is ~2.5, a copper coin ~3.5, steel ~5.5 and glass ~5.5–6.
          </>
        )}
      </p>
    </div>
  );
}
