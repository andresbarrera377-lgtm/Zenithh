"use client";

import { FileText } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { AnalysisMeta, FieldContext, RockAnalysis } from "@/lib/analysis/schema";
import { formatDateTime } from "@/lib/utils";
import { FullReport, type FullReportHandle } from "./FullReport";
import { ResultSummary } from "./ResultSummary";

/** Summary card + full report, shared by fresh results and saved discoveries. */
export function ResultsView({
  analysis,
  meta,
  imageSrc,
  context,
  actions,
  footer,
}: {
  analysis: RockAnalysis;
  meta: AnalysisMeta;
  imageSrc: string | null;
  context?: FieldContext;
  actions?: ReactNode;
  footer?: ReactNode;
}) {
  const reportRef = useRef<FullReportHandle>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  function viewFullReport() {
    reportRef.current?.expandAll();
    requestAnimationFrame(() => anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const contextEntries = context
    ? ([
        ["Found at", context.location],
        ["Size", context.size],
        ["Notes", context.notes],
      ].filter(([, v]) => v) as Array<[string, string]>)
    : [];

  return (
    <div className="space-y-10">
      <ResultSummary
        analysis={analysis}
        imageSrc={imageSrc}
        actions={
          <>
            <Button onClick={viewFullReport} icon={<FileText className="h-4 w-4" />}>
              View full report
            </Button>
            {actions}
          </>
        }
        footer={footer}
      />

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
        Analyzed {formatDateTime(meta.analyzedAt)} · model {meta.model} · ref {meta.requestId.slice(0, 8)}
      </p>
    </div>
  );
}
