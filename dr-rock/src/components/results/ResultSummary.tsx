import { Bone, CircleSlash, FileSearch, HelpCircle, Hourglass, Layers } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Badge, Meter, Panel } from "@/components/ui/primitives";
import { CLASSIFICATION_META, VERDICT_META, confidenceLevel } from "@/lib/analysis/presentation";
import type { RockAnalysis, Verdict } from "@/lib/analysis/schema";
import { cn, formatMaRange } from "@/lib/utils";
import { ConfidenceGauge } from "./ConfidenceGauge";

const TONE_TEXT = {
  mineral: "text-mineral-300",
  ochre: "text-ochre-300",
  jasper: "text-jasper-300",
  azurite: "text-azurite-300",
  granite: "text-granite-200",
} as const;

const VERDICT_ICONS: Record<Verdict, typeof Bone> = {
  probable_fossil: Bone,
  inconclusive_fossil_like: HelpCircle,
  no_visible_fossil: CircleSlash,
  insufficient_image: FileSearch,
};

export function VerdictBadge({ verdict, className }: { verdict: Verdict; className?: string }) {
  const meta = VERDICT_META[verdict];
  const Icon = VERDICT_ICONS[verdict];
  return (
    <Badge tone={meta.tone} className={className} icon={<Icon className="h-3.5 w-3.5" />}>
      {meta.label}
    </Badge>
  );
}

/**
 * Hero card of the results screen: photo, identification, fossil indicator,
 * confidence, category and estimated age at a glance.
 */
export function ResultSummary({
  analysis,
  imageSrc,
  imageAlt,
  media,
  actions,
  footer,
}: {
  analysis: RockAnalysis;
  /** Object URL, data URL or static path of the photo. */
  imageSrc?: string | null;
  imageAlt?: string;
  /** Replaces the photo, e.g. with an illustration in previews. */
  media?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
}) {
  const { identification, confidence, verdict, ageAndHistory } = analysis;
  const verdictMeta = VERDICT_META[verdict];
  const classification = CLASSIFICATION_META[identification.classification];
  const rockAge = ageAndHistory.rockAge;
  const ageRange = formatMaRange(rockAge.minMa, rockAge.maxMa);
  const fossilLevel = confidenceLevel(confidence.fossil);

  return (
    <Panel className="@container overflow-hidden p-0">
      <div className="grid @4xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative aspect-[4/3] bg-carbon-900 @4xl:aspect-auto @4xl:min-h-[420px]">
          {media ? (
            <div className="absolute inset-0">{media}</div>
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? `Photo of ${identification.rockName}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-950/80 via-transparent to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-3 rounded-2xl ring-1 ring-chalk-50/10" aria-hidden />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <VerdictBadge verdict={verdict} className="bg-carbon-950/75 backdrop-blur" />
          </div>
        </div>

        <div className="@container/info space-y-6 p-5 @md/info:p-7">
          <div className="space-y-3">
            <p className="label-mono text-mineral-400">Identification report</p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-chalk-50 @md/info:text-4xl">
              {identification.rockName}
            </h2>
            <p className="text-granite-300">{identification.rockType}</p>
            <p className="text-[15px] leading-relaxed text-granite-200">{analysis.verdictSummary}</p>
          </div>

          <div className="grid gap-3 @md/info:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl bg-carbon-900/70 p-4 ring-1 ring-granite-700/70 @md/info:col-span-2 @xl/info:col-span-1 @xl/info:row-span-2 @xl/info:flex-col @xl/info:justify-center @xl/info:text-center">
              <ConfidenceGauge value={confidence.identification} label="Identification confidence" size={118} />
              <div className="space-y-1">
                <p className="text-sm font-medium text-chalk-50">Identification confidence</p>
                <p className="text-xs text-granite-400">Self-assessed by the AI from visible evidence</p>
              </div>
            </div>

            <StatTile icon={<Bone className="h-4 w-4" />} label="Possible fossil">
              <p className={cn("font-medium", TONE_TEXT[verdictMeta.tone])}>{verdictMeta.short}</p>
              <div className="mt-2 flex items-center gap-2">
                <Meter value={confidence.fossil} tone={fossilLevel.tone} label="Fossil verdict confidence" />
                <span className="font-mono text-xs text-granite-300">{confidence.fossil}%</span>
              </div>
              {identification.fossilType && <p className="mt-1.5 text-xs text-granite-300">{identification.fossilType}</p>}
            </StatTile>

            <StatTile icon={<Layers className="h-4 w-4" />} label="Geological category">
              <p className="font-medium text-chalk-50">{classification.label}</p>
              <p className="mt-1 text-xs leading-snug text-granite-400">{classification.description}</p>
            </StatTile>

            <StatTile icon={<Hourglass className="h-4 w-4" />} label="Estimated age" className="@md/info:col-span-2">
              <p className="font-medium text-chalk-50">{rockAge.summary}</p>
              {ageRange && <p className="mt-1 font-mono text-xs text-mineral-300">{ageRange}</p>}
            </StatTile>
          </div>

          {actions && <div className="flex flex-col gap-2 @md/info:flex-row @md/info:flex-wrap">{actions}</div>}
          {footer}
        </div>
      </div>
    </Panel>
  );
}

function StatTile({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-carbon-900/70 p-4 ring-1 ring-granite-700/70", className)}>
      <p className="label-mono mb-2 flex items-center gap-2 text-granite-400">
        <span className="text-mineral-400">{icon}</span>
        {label}
      </p>
      <div className="text-sm">{children}</div>
    </div>
  );
}
