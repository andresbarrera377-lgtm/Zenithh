import { ArrowLeft, Hourglass, Lightbulb, Pickaxe, ScanLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SpecimenArt } from "@/components/art/SpecimenArt";
import { LibraryCard } from "@/components/library/LibraryCard";
import { GeoTimeBar } from "@/components/results/GeoTimeBar";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, KeyValue, Panel } from "@/components/ui/primitives";
import { LIBRARY, getEntry, getRelated } from "@/lib/library";
import { ERAS, EONS_PRECAMBRIAN, PERIODS } from "@/lib/library/timescale";
import { CATEGORY_META } from "@/lib/library/types";

export function generateStaticParams() {
  return LIBRARY.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) return { title: "Not found" };
  return { title: `${entry.name} · Rock Library`, description: entry.summary };
}

export default function LibraryEntryPage({ params }: { params: Promise<{ id: string }> }) {
  // Reading `params` inside Suspense lets client navigations show the skeleton instantly.
  return (
    <Suspense fallback={<EntrySkeleton />}>
      <LibraryEntry params={params} />
    </Suspense>
  );
}

function EntrySkeleton() {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="shimmer h-5 w-32 rounded" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="shimmer aspect-[4/3] rounded-[1.25rem]" />
        <div className="space-y-4">
          <div className="shimmer h-6 w-28 rounded-full" />
          <div className="shimmer h-12 w-2/3 rounded" />
          <div className="shimmer h-20 rounded" />
          <div className="shimmer h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

async function LibraryEntry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();

  const meta = CATEGORY_META[entry.category];
  const related = getRelated(entry);
  const timeUnit =
    entry.art.kind === "time"
      ? [...PERIODS, ...ERAS, EONS_PRECAMBRIAN].find((u) => u.id === (entry.art as { unitId: string }).unitId)
      : undefined;

  return (
    <article className="space-y-10">
      <Link href="/app/library" className="inline-flex items-center gap-2 text-sm text-granite-400 transition-colors hover:text-chalk-50">
        <ArrowLeft className="h-4 w-4" /> Rock Library
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Panel className="overflow-hidden p-0">
          <SpecimenArt seed={entry.id} art={entry.art} title={`Illustration of ${entry.name}`} className="aspect-[4/3] w-full" />
        </Panel>
        <div className="space-y-5">
          <Badge tone="mineral">{meta.label}</Badge>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-chalk-50 md:text-5xl">{entry.name}</h1>
            {entry.aka && <p className="font-mono text-sm text-granite-400">{entry.aka}</p>}
          </div>
          <p className="text-lg leading-relaxed text-granite-200">{entry.summary}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border hairline p-5">
            {entry.properties.map((p) => (
              <KeyValue key={p.label} label={p.label} value={<span className="text-sm">{p.value}</span>} />
            ))}
          </dl>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="space-y-3 p-6 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-chalk-50">Description</h2>
          <p className="leading-relaxed text-granite-200">{entry.description}</p>
        </Panel>
        <Panel className="space-y-3 p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-chalk-50">
            <Hourglass className="h-5 w-5 text-mineral-400" /> Age
          </h2>
          <p className="leading-relaxed text-granite-200">{entry.age}</p>
        </Panel>
        <Panel className="space-y-3 p-6 lg:col-span-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-chalk-50">
            <Pickaxe className="h-5 w-5 text-mineral-400" /> {entry.category === "period" || entry.category === "era" ? "The world at the time" : "How it forms"}
          </h2>
          <p className="leading-relaxed text-granite-200">{entry.formation}</p>
          {timeUnit && (
            <div className="pt-4">
              <GeoTimeBar
                highlightPeriod={entry.category === "period" ? timeUnit.id : undefined}
                ranges={[{ label: entry.name, minMa: timeUnit.end, maxMa: timeUnit.start, tone: "mineral" }]}
              />
            </div>
          )}
        </Panel>
      </div>

      <section className="space-y-4" aria-labelledby="facts-title">
        <h2 id="facts-title" className="flex items-center gap-2 font-display text-2xl font-semibold text-chalk-50">
          <Lightbulb className="h-6 w-6 text-ochre-400" /> Did you know?
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {entry.facts.map((fact, i) => (
            <li key={fact} className="rounded-2xl bg-gradient-to-br from-mineral-500/10 to-transparent p-5 ring-1 ring-mineral-500/20">
              <span className="font-display text-3xl font-semibold text-mineral-400/40">0{i + 1}</span>
              <p className="mt-2 leading-relaxed text-granite-100">{fact}</p>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="space-y-4" aria-labelledby="related-title">
          <h2 id="related-title" className="font-display text-2xl font-semibold text-chalk-50">
            Related entries
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <LibraryCard key={r.id} entry={r} />
            ))}
          </div>
        </section>
      )}

      <Panel className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg font-semibold text-chalk-50">Found something similar?</p>
          <p className="text-sm text-granite-400">Photograph it and let Dr.Rock analyze its features.</p>
        </div>
        <ButtonLink href="/app/scan" icon={<ScanLine className="h-4 w-4" />}>
          Scan a rock
        </ButtonLink>
      </Panel>
    </article>
  );
}
