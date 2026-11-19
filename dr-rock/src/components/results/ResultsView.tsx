"use client";

import { Camera, FileText, FlaskConical, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { AnalysisMeta, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { countTests } from "@/lib/scan/precision";
import { formatDateTime } from "@/lib/utils";
import { FullReport, type FullReportHandle } from "./FullReport";
import { ResultSummary } from "./ResultSummary";

/** Summary card + full report, shared by fresh results and saved discoveries. */
export function ResultsView({
  analysis,
  meta,
  imageSrc,
  photoUrls,
  context,
  actions,
  footer,
  onImprove,
}: {
  analysis: RockAnalysis;
  meta: AnalysisMeta;
  imageSrc: string | null;
  /** Every photo the analysis used (shown as a strip when there is more than one). */
  photoUrls?: string[];
  context?: FieldContext;
  actions?: ReactNode;
  footer?: ReactNode;
  /** Shown as "Add photos or tests" when the result is not yet confident enough. */
  onImprove?: () => void;
}) {
  const p = useMessages("report").precision;
  const reportRef = useRef<FullReportHandle>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const t = useMessages("report").view;
  const locale = useLocale();

  function viewFullReport() {
    reportRef.current?.expandAll();
    requestAnimationFrame(() => anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const contextEntries = context
    ? ([
        [t.foundAt, context.location],
        [t.size, context.size],
        [t.notes, context.notes],
      ].filter(([, v]) => v) as Array<[string, string]>)
    : [];

  const tests = context ? countTests(context) : 0;
  const needsMore =
    analysis.verdict === "insufficient_image" || analysis.confidence.identification < 75 || analysis.origin?.verdict === "uncertain";

  return (
    <div className="space-y-10">
      <ResultSummary
        analysis={analysis}
        imageSrc={imageSrc}
        actions={
          <>
            <Button onClick={viewFullReport} icon={<FileText className="h-4 w-4" />}>
              {t.fullReport}
            </Button>
            {actions}
          </>
        }
        footer={footer}
      />

      {(meta.reviewed || (meta.photoCount ?? 1) > 1 || tests > 0) && (
        <ul className="-mt-6 flex flex-wrap gap-2 text-xs">
          {meta.reviewed && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-mineral-500/10 px-3 py-1 text-mineral-200 ring-1 ring-mineral-500/30" title={p.reviewedText}>
              <ShieldCheck className="h-3.5 w-3.5" /> {p.reviewed}
            </li>
          )}
          {meta.photoCount && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-granite-800/70 px-3 py-1 text-granite-200 ring-1 ring-granite-600/60">
              <Camera className="h-3.5 w-3.5" /> {p.photos(meta.photoCount)}
            </li>
          )}
          {tests > 0 && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-granite-800/70 px-3 py-1 text-granite-200 ring-1 ring-granite-600/60">
              <FlaskConical className="h-3.5 w-3.5" /> {p.tests(tests)}
            </li>
          )}
        </ul>
      )}

      {photoUrls && photoUrls.length > 1 && (
        <div className="-mt-4 flex gap-3 overflow-x-auto pb-1">
          {photoUrls.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-granite-700 transition hover:ring-mineral-400"
            >
              <Image src={url} alt={`${i + 1}`} fill unoptimized className="object-cover" sizes="128px" />
              <span className="absolute left-1.5 top-1.5 rounded bg-carbon-950/75 px-1.5 font-mono text-[10px] text-chalk-50">{i + 1}</span>
            </a>
          ))}
        </div>
      )}

      {onImprove && needsMore && (
        <section className="space-y-3 rounded-2xl bg-azurite-500/10 p-5 ring-1 ring-azurite-500/30">
          <p className="flex items-center gap-2 font-display font-semibold text-chalk-50">
            <Sparkles className="h-4 w-4 text-azurite-300" /> {p.improveTitle}
          </p>
          <p className="text-sm text-granite-200">{p.improveText}</p>
          {analysis.imageAssessment.photoTips.length > 0 && (
            <ul className="space-y-1 text-sm text-granite-300">
              {[...analysis.imageAssessment.photoTips.slice(0, 2), ...analysis.verificationSteps.slice(0, 1)].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-azurite-300" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" size="sm" onClick={onImprove} icon={<Camera className="h-4 w-4" />}>
            {p.improveButton}
          </Button>
        </section>
      )}

      {contextEntries.length > 0 && (
        <dl className="flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border hairline px-5 py-4 text-sm">
          {contextEntries.map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="text-granite-400">{label}:</dt>
              <dd className="text-granite-100">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div ref={anchorRef} className="scroll-mt-24">
        <FullReport ref={reportRef} analysis={analysis} />
      </div>

      <p className="text-center font-mono text-[11px] text-granite-500">
        {t.footer(formatDateTime(meta.analyzedAt, locale), meta.model, meta.requestId.slice(0, 8))}
      </p>
    </div>
  );
}
