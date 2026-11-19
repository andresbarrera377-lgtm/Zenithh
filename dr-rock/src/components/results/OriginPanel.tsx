"use client";

import { Factory, Hammer, HelpCircle, Leaf, Landmark } from "lucide-react";
import { Meter } from "@/components/ui/primitives";
import type { Origin, OriginAssessment } from "@/lib/analysis/schema";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export const ORIGIN_STYLE: Record<Origin, { icon: typeof Leaf; ring: string; text: string; dot: string; tone: "mineral" | "ochre" | "jasper" | "azurite" }> = {
  natural: { icon: Leaf, ring: "bg-mineral-500/10 ring-mineral-500/35", text: "text-mineral-200", dot: "bg-mineral-300", tone: "mineral" },
  human_modified: { icon: Hammer, ring: "bg-ochre-500/10 ring-ochre-500/40", text: "text-ochre-300", dot: "bg-ochre-300", tone: "ochre" },
  human_made: { icon: Factory, ring: "bg-jasper-500/10 ring-jasper-500/40", text: "text-jasper-300", dot: "bg-jasper-300", tone: "jasper" },
  uncertain: { icon: HelpCircle, ring: "bg-granite-800/60 ring-granite-600/60", text: "text-granite-100", dot: "bg-granite-300", tone: "azurite" },
};

/** Looks like a stone tool or other archaeological object (the AI mentions it in its own words). */
const ARTIFACT_HINT = /\b(tool|artifact|artefact|arrowhead|knapped|flake|herramienta|artefacto|punta de flecha|tallad[ao]|lasca)\b/i;

/** "Natural or made by people?" — the origin verdict, what it likely is, and the clues behind it. */
export function OriginPanel({ origin, className }: { origin: OriginAssessment; className?: string }) {
  const t = useMessages("report");
  const meta = t.origins[origin.verdict];
  const style = ORIGIN_STYLE[origin.verdict];
  const Icon = style.icon;
  const artifact = origin.verdict === "human_modified" && ARTIFACT_HINT.test(`${origin.likelyObject ?? ""} ${origin.evidence.join(" ")}`);

  return (
    <section className={cn("space-y-3 rounded-2xl p-4 ring-1", style.ring, className)} aria-label={t.origin.title}>
      <div className="flex items-start gap-3">
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-carbon-950/40", style.text)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="label-mono text-granite-400">{t.origin.title}</p>
          <p className={cn("font-display text-lg font-semibold leading-snug", style.text)}>{meta.label}</p>
          <p className="text-xs text-granite-300">{meta.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Meter value={origin.confidence} tone={style.tone} label={t.origin.confidence(origin.confidence)} className="flex-1" />
        <span className="shrink-0 font-mono text-xs text-granite-300">{t.origin.confidence(origin.confidence)}</span>
      </div>

      {(origin.likelyObject || origin.imitates) && (
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          {origin.likelyObject && (
            <div>
              <dt className="text-xs text-granite-400">{t.origin.likely}</dt>
              <dd className="font-medium text-chalk-50">{origin.likelyObject}</dd>
            </div>
          )}
          {origin.imitates && (
            <div>
              <dt className="text-xs text-granite-400">{t.origin.imitates}</dt>
              <dd className="font-medium text-chalk-50">{origin.imitates}</dd>
            </div>
          )}
        </dl>
      )}

      {origin.evidence.length > 0 && (
        <div>
          <p className="mb-1 text-xs text-granite-400">{t.origin.evidence}</p>
          <ul className="space-y-1 text-sm text-granite-200">
            {origin.evidence.map((clue) => (
              <li key={clue} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", style.dot)} aria-hidden />
                {clue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {artifact && (
        <p className="flex gap-2 rounded-xl bg-carbon-950/40 p-3 text-xs leading-relaxed text-ochre-300">
          <Landmark className="mt-0.5 h-4 w-4 shrink-0" /> {t.origin.heritage}
        </p>
      )}
    </section>
  );
}

/** Small badge for the photo overlay and lists. */
export function OriginBadge({ origin, className }: { origin: Origin; className?: string }) {
  const t = useMessages("report").origins[origin];
  const style = ORIGIN_STYLE[origin];
  const Icon = style.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1", style.ring, style.text, className)}>
      <Icon className="h-3.5 w-3.5" /> {t.short}
    </span>
  );
}
