"use client";

import {
  Bone,
  Camera,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  Hourglass,
  Lightbulb,
  Mountain,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useState, type ReactNode } from "react";
import { Badge, KeyValue, Notice } from "@/components/ui/primitives";
import type { AgeEstimate, RockAnalysis } from "@/lib/analysis/schema";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { cn, formatMaRange } from "@/lib/utils";
import { EarthLayers } from "./EarthLayers";
import { GeoTimeBar } from "./GeoTimeBar";
import { MohsScale } from "./MohsScale";
import { VerdictBadge } from "./ResultSummary";

const SECTIONS = [
  { id: "identification", letter: "A", icon: ScanSearch },
  { id: "age", letter: "B", icon: Hourglass },
  { id: "setting", letter: "C", icon: Mountain },
  { id: "composition", letter: "D", icon: FlaskConical },
  { id: "facts", letter: "E", icon: Lightbulb },
  { id: "paleo", letter: "F", icon: Bone },
  { id: "photo", letter: "G", icon: Camera },
] as const satisfies ReadonlyArray<{ id: string; letter: string; icon: LucideIcon }>;

type SectionId = (typeof SECTIONS)[number]["id"];

export interface FullReportHandle {
  expandAll: () => void;
}

/** Complete scientific report with collapsible sections A–G. */
export const FullReport = forwardRef<FullReportHandle, { analysis: RockAnalysis; className?: string }>(function FullReport(
  { analysis, className },
  ref,
) {
  const [open, setOpen] = useState<Set<SectionId>>(() => new Set<SectionId>(["identification"]));
  const t = useMessages("report").full;
  const common = useMessages("common");
  useImperativeHandle(ref, () => ({ expandAll: () => setOpen(new Set(SECTIONS.map((s) => s.id))) }), []);

  const toggle = (id: SectionId, next: boolean) =>
    setOpen((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });

  const content: Record<SectionId, ReactNode> = {
    identification: <IdentificationSection a={analysis} />,
    age: <AgeSection a={analysis} />,
    setting: <SettingSection a={analysis} />,
    composition: <CompositionSection a={analysis} />,
    facts: <FactsSection a={analysis} />,
    paleo: <PaleoSection a={analysis} />,
    photo: <PhotoSection a={analysis} />,
  };

  return (
    <section className={cn("space-y-3", className)} aria-labelledby="full-report-title">
      <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
        <div>
          <p className="label-mono text-mineral-400">{t.eyebrow}</p>
          <h2 id="full-report-title" className="font-display text-2xl font-semibold text-chalk-50">
            {t.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(open.size === SECTIONS.length ? new Set() : new Set(SECTIONS.map((s) => s.id)))}
          className="text-sm text-mineral-300 underline-offset-4 hover:underline"
        >
          {open.size === SECTIONS.length ? t.collapse : t.expand}
        </button>
      </div>

      {SECTIONS.map((s) => {
        const Icon = s.icon;
        const isOpen = open.has(s.id);
        return (
          <details
            key={s.id}
            id={`report-${s.id}`}
            open={isOpen}
            onToggle={(e) => {
              const next = (e.currentTarget as HTMLDetailsElement).open;
              if (next !== isOpen) toggle(s.id, next);
            }}
            className="panel group overflow-hidden"
          >
            <summary className="flex cursor-pointer items-center gap-4 p-4 sm:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-granite-800 text-mineral-400 ring-1 ring-granite-600/60">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="label-mono block text-granite-400">{t.section(s.letter)}</span>
                <span className="font-display text-lg font-semibold text-chalk-50">{t.sections[s.id]}</span>
              </span>
              <ChevronDown className="h-5 w-5 text-granite-400 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t hairline p-4 sm:p-6">{content[s.id]}</div>
          </details>
        );
      })}

      <Notice kind="warning" title={t.notice}>
        {common.disclaimer}
      </Notice>
    </section>
  );
});

// ---------------------------------------------------------------------------------------

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="label-mono mb-3 text-granite-400">{children}</h3>;
}

function Prose({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-granite-200">{children}</p>;
}

function Chips({ items }: { items: string[] }) {
  const t = useMessages("report").full;
  if (items.length === 0) return <p className="text-sm text-granite-400">{t.notDetermined}</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <li key={`${i}-${item}`} className="rounded-full bg-granite-800 px-3 py-1 text-sm text-granite-100 ring-1 ring-granite-600/60">
          {item}
        </li>
      ))}
    </ul>
  );
}

function IdentificationSection({ a }: { a: RockAnalysis }) {
  const { identification: id, observations: o } = a;
  const report = useMessages("report");
  const t = report.full;
  const observationRows = (Object.keys(t.observations) as Array<keyof typeof t.observations>).map(
    (key) => [t.observations[key], o[key]] as [string, string],
  );
  return (
    <div className="space-y-8">
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KeyValue label={t.probableName} value={id.rockName} />
        <KeyValue label={t.rockType} value={id.rockType} />
        <KeyValue label={t.classification} value={report.classifications[id.classification].label} />
        <KeyValue label={t.possibleFossils} value={<VerdictBadge verdict={a.verdict} />} />
        <KeyValue label={t.fossilType} value={id.fossilType ?? t.noneIdentified} />
        <KeyValue
          label={t.confidence}
          value={<span className="font-mono text-sm">{t.confidenceValue(a.confidence.identification, a.confidence.fossil)}</span>}
        />
      </dl>

      <div>
        <SubHeading>{t.whyConfidence}</SubHeading>
        <Prose>{a.confidence.rationale}</Prose>
      </div>

      {id.keyFeatures.length > 0 && (
        <div>
          <SubHeading>{t.featuresTitle}</SubHeading>
          <div className="overflow-hidden rounded-2xl ring-1 ring-granite-700/70">
            <table className="w-full text-left text-sm">
              <thead className="bg-granite-800/70 text-xs text-granite-400">
                <tr>
                  <th className="px-4 py-2.5 font-medium">{t.feature}</th>
                  <th className="px-4 py-2.5 font-medium">{t.observed}</th>
                  <th className="hidden px-4 py-2.5 font-medium md:table-cell">{t.interpretation}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-granite-700/60">
                {id.keyFeatures.map((f, i) => (
                  <tr key={`${i}-${f.feature}`} className="align-top">
                    <td className="px-4 py-3 font-medium text-chalk-50">{f.feature}</td>
                    <td className="px-4 py-3 text-granite-200">
                      {f.observation}
                      <span className="mt-1 block text-granite-400 md:hidden">→ {f.interpretation}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-granite-300 md:table-cell">{f.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <SubHeading>{t.aiObserved}</SubHeading>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {observationRows.map(([label, value]) => (
            <KeyValue key={label} label={label} value={<span className="text-sm text-granite-200">{value}</span>} />
          ))}
        </dl>
      </div>

      {id.alternatives.length > 0 && (
        <div>
          <SubHeading>{t.alternatives}</SubHeading>
          <ul className="space-y-2">
            {id.alternatives.map((alt, i) => (
              <li key={`${i}-${alt.name}`} className="rounded-xl bg-carbon-900/60 p-3 text-sm ring-1 ring-granite-700/60">
                <span className="font-medium text-chalk-50">{alt.name}</span>
                <span className="text-granite-300"> — {alt.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AgeCard({ title, age, tone, note }: { title: string; age: AgeEstimate; tone: "mineral" | "ochre"; note: string }) {
  const t = useMessages("report").full;
  const locale = useLocale();
  const range = formatMaRange(age.minMa, age.maxMa, locale);
  return (
    <div className="space-y-3 rounded-2xl bg-carbon-900/60 p-4 ring-1 ring-granite-700/60">
      <div className="flex items-center justify-between gap-2">
        <p className="label-mono text-granite-400">{title}</p>
        <span className={cn("h-2 w-6 rounded-full", tone === "mineral" ? "bg-mineral-400" : "bg-ochre-400")} aria-hidden />
      </div>
      <p className="font-medium text-chalk-50">{age.summary}</p>
      <dl className="grid grid-cols-2 gap-3">
        <KeyValue label={t.periods} value={<span className="text-sm">{age.periods.join(", ") || t.undetermined}</span>} />
        <KeyValue label={t.era} value={<span className="text-sm">{age.era ?? t.undetermined}</span>} />
        <KeyValue
          label={t.approxAge}
          className="col-span-2"
          value={<span className="font-mono text-sm text-mineral-300">{range ?? t.cannotEstimate}</span>}
        />
      </dl>
      <p className="text-sm leading-relaxed text-granite-300">{age.basis}</p>
      <p className="text-xs text-granite-500">{note}</p>
    </div>
  );
}

function AgeSection({ a }: { a: RockAnalysis }) {
  const { rockAge, fossilAge, formationStory, relatedEvents } = a.ageAndHistory;
  const t = useMessages("report").full;
  return (
    <div className="space-y-8">
      <GeoTimeBar
        ranges={[
          { label: t.rockRange, minMa: rockAge.minMa, maxMa: rockAge.maxMa, tone: "mineral" },
          ...(fossilAge ? [{ label: t.fossilRange, minMa: fossilAge.minMa, maxMa: fossilAge.maxMa, tone: "ochre" as const }] : []),
        ]}
      />
      <div className={cn("grid gap-4", fossilAge && "md:grid-cols-2")}>
        <AgeCard title={t.rockAgeTitle} age={rockAge} tone="mineral" note={t.rockAgeNote} />
        {fossilAge && (
          <AgeCard
            title={t.fossilAgeTitle}
            age={fossilAge}
            tone="ochre"
            note={t.fossilAgeNote}
          />
        )}
      </div>
      <div>
        <SubHeading>{t.formation}</SubHeading>
        <Prose>{formationStory}</Prose>
      </div>
      {relatedEvents.length > 0 && (
        <div>
          <SubHeading>{t.events}</SubHeading>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relatedEvents.map((e, i) => (
              <li key={`${i}-${e}`} className="flex gap-3 rounded-xl bg-carbon-900/60 p-3 text-sm text-granite-200 ring-1 ring-granite-700/60">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mineral-400" aria-hidden />
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SettingSection({ a }: { a: RockAnalysis }) {
  const g = a.geologicalSetting;
  const t = useMessages("report").full;
  return (
    <div className="space-y-8">
      <div>
        <SubHeading>{t.environments}</SubHeading>
        <Chips items={g.environments} />
      </div>
      <dl className="grid gap-6 md:grid-cols-2">
        <KeyValue label={t.strata} value={<Prose>{g.strata}</Prose>} />
        <KeyValue label={t.depth} value={<Prose>{g.depth}</Prose>} />
        <KeyValue label={t.conditions} value={<Prose>{g.favorableConditions}</Prose>} className="md:col-span-2" />
      </dl>
      <div>
        <SubHeading>{t.regions}</SubHeading>
        <Chips items={g.worldRegions} />
      </div>
      <div className="space-y-4 rounded-2xl bg-carbon-900/60 p-4 ring-1 ring-granite-700/60 sm:p-5">
        <SubHeading>{t.layers}</SubHeading>
        <Prose>{g.earthLayers}</Prose>
        <EarthLayers />
      </div>
    </div>
  );
}

function CompositionSection({ a }: { a: RockAnalysis }) {
  const c = a.composition;
  const t = useMessages("report").full;
  return (
    <div className="space-y-8">
      <div>
        <SubHeading>{t.minerals}</SubHeading>
        {c.minerals.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {c.minerals.map((m, i) => (
              <li key={`${i}-${m.name}`} className="flex items-center justify-between gap-3 rounded-xl bg-carbon-900/60 px-4 py-3 text-sm ring-1 ring-granite-700/60">
                <span className="font-medium text-chalk-50">{m.name}</span>
                <span className="text-right text-granite-400">{m.role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-granite-400">{t.noMinerals}</p>
        )}
      </div>
      <dl className="grid gap-6 md:grid-cols-2">
        <KeyValue label={t.chemistry} value={<Prose>{c.chemistry}</Prose>} />
        <KeyValue label={t.porosity} value={<Prose>{c.porosity}</Prose>} />
        <KeyValue
          label={t.density}
          value={
            <span className="space-y-1">
              <span className="block font-mono text-mineral-300">{c.density.value ?? t.noDensity}</span>
              <span className="block text-sm text-granite-300">{c.density.note}</span>
            </span>
          }
        />
        <KeyValue label={t.physical} value={<Prose>{c.physicalProperties}</Prose>} />
      </dl>
      <div>
        <SubHeading>{t.hardness}</SubHeading>
        <MohsScale min={c.mohsHardness.min} max={c.mohsHardness.max} />
        {c.mohsHardness.note && <p className="mt-2 text-sm text-granite-400">{c.mohsHardness.note}</p>}
      </div>
    </div>
  );
}

function FactsSection({ a }: { a: RockAnalysis }) {
  const t = useMessages("report").full;
  if (a.didYouKnow.length === 0) return <p className="text-sm text-granite-400">{t.noFacts}</p>;
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {a.didYouKnow.map((fact, i) => (
        <li key={`${i}-${fact}`} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mineral-500/10 to-transparent p-5 ring-1 ring-mineral-500/20">
          <span className="font-display text-3xl font-semibold text-mineral-400/40">0{i + 1}</span>
          <p className="mt-2 text-[15px] leading-relaxed text-granite-100">{fact}</p>
        </li>
      ))}
    </ol>
  );
}

function PaleoSection({ a }: { a: RockAnalysis }) {
  const p = a.paleontology;
  const report = useMessages("report");
  const t = report.full;
  if (!p.hasFossilIndications) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <VerdictBadge verdict={a.verdict} />
        </div>
        <Prose>
          {p.noFossilExplanation ?? t.noFossilDefault}
        </Prose>
      </div>
    );
  }
  const rows: Array<[string, string | null]> = [
    [t.paleo.organism, p.organism],
    [t.paleo.group, p.biologicalGroup],
    [t.paleo.lived, p.periodLived],
    [t.paleo.habitat, p.habitat],
    [t.paleo.preservation, p.preservation],
    [t.paleo.importance, p.scientificImportance],
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <VerdictBadge verdict={a.verdict} />
        <span className="text-sm text-granite-400">{report.verdicts[a.verdict].description}</span>
      </div>
      <dl className="grid gap-6 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <KeyValue key={label} label={label} value={<Prose>{value ?? t.notFromPhoto}</Prose>} />
        ))}
      </dl>
    </div>
  );
}

function PhotoSection({ a }: { a: RockAnalysis }) {
  const img = a.imageAssessment;
  const qualityTone = { good: "mineral", fair: "azurite", poor: "ochre", unusable: "jasper" } as const;
  const t = useMessages("report").full;
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={qualityTone[img.quality]}>{t.quality(t.qualities[img.quality])}</Badge>
          {!img.showsRockOrFossil && <Badge tone="jasper">{t.noRock}</Badge>}
        </div>
        <Prose>{img.subjectDescription}</Prose>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SubHeading>{t.limitations}</SubHeading>
          {img.issues.length ? (
            <ul className="space-y-2 text-sm text-granite-200">
              {img.issues.map((issue, i) => (
                <li key={`${i}-${issue}`} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ochre-400" aria-hidden />
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-granite-400">{t.noIssues}</p>
          )}
        </div>
        <div>
          <SubHeading>{t.betterPhoto}</SubHeading>
          <ul className="space-y-2 text-sm text-granite-200">
            {img.photoTips.map((tip, i) => (
              <li key={`${i}-${tip}`} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mineral-400" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {a.verificationSteps.length > 0 && (
        <div>
          <SubHeading>{t.verify}</SubHeading>
          <ol className="space-y-2">
            {a.verificationSteps.map((step, i) => (
              <li key={`${i}-${step}`} className="flex gap-3 rounded-xl bg-carbon-900/60 p-3 text-sm text-granite-200 ring-1 ring-granite-700/60">
                <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-mineral-400" aria-hidden />
                <span>
                  <span className="font-mono text-xs text-granite-500">{String(i + 1).padStart(2, "0")} </span>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
