import { BookOpenText, Gem, House, Info, ScanLine, Search } from "lucide-react";
import type { ReactNode } from "react";
import { FossilArt } from "@/components/art/FossilArt";
import { LogoMark } from "@/components/brand/Logo";
import { ResultSummary } from "@/components/results/ResultSummary";
import { EXAMPLE_ANALYSIS } from "@/lib/analysis/example";
import { getEntry } from "@/lib/library";
import { CATEGORY_META } from "@/lib/library/types";
import { cn } from "@/lib/utils";

function PhoneFrame({ children, caption, className }: { children: ReactNode; caption: string; className?: string }) {
  return (
    <figure className={cn("w-[300px] shrink-0 snap-center space-y-4", className)}>
      <div className="relative h-[620px] overflow-hidden rounded-[2.6rem] border-[10px] border-granite-800 bg-carbon-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-carbon-950" aria-hidden />
        <div className="h-full overflow-hidden pt-8">{children}</div>
        <MiniTabBar />
        <div className="pointer-events-none absolute inset-x-0 bottom-14 h-20 bg-gradient-to-t from-carbon-950 to-transparent" aria-hidden />
      </div>
      <figcaption className="text-center text-sm text-granite-400">{caption}</figcaption>
    </figure>
  );
}

function MiniTabBar() {
  const items = [House, BookOpenText, ScanLine, Gem, Info];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 grid h-14 grid-cols-5 items-center border-t hairline bg-carbon-950/95 px-2" aria-hidden>
      {items.map((Icon, i) => (
        <span key={i} className="flex justify-center">
          {i === 2 ? (
            <span className="-mt-6 grid h-11 w-11 place-items-center rounded-xl bg-mineral-400 text-carbon-950 ring-4 ring-carbon-950">
              <Icon className="h-5 w-5" />
            </span>
          ) : (
            <Icon className="h-4 w-4 text-granite-500" />
          )}
        </span>
      ))}
    </div>
  );
}

function ScreenHeader({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="space-y-1 px-4 pb-3">
      <div className="mb-3 flex items-center gap-2">
        <LogoMark className="h-5 w-5" />
        <span className="font-display text-sm font-semibold text-chalk-50">
          Dr<span className="text-mineral-400">.</span>Rock
        </span>
      </div>
      <p className="label-mono text-[9px] text-mineral-400">{eyebrow}</p>
      <p className="font-display text-xl font-semibold text-chalk-50">{title}</p>
    </div>
  );
}

function ScanScreen() {
  const corner = "absolute h-7 w-7 border-mineral-300";
  return (
    <div>
      <ScreenHeader eyebrow="Step 2 · Analysis" title="Analyzing specimen" />
      <div className="relative mx-4 aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-granite-700">
        <FossilArt
          seed="preview-trilobite"
          form="trilobite"
          matrix={["#84878a", "#3a3c3e"]}
          fossil={["#6e655c", "#2a2520"]}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="absolute inset-x-0 h-16 -translate-y-1/2 animate-scan" aria-hidden>
          <div className="h-full w-full bg-gradient-to-b from-transparent via-mineral-400/25 to-transparent" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-mineral-300 shadow-[0_0_14px_3px_rgba(79,227,164,0.7)]" />
        </div>
        <div className="absolute inset-3" aria-hidden>
          <span className={cn(corner, "left-0 top-0 rounded-tl-xl border-l-2 border-t-2")} />
          <span className={cn(corner, "right-0 top-0 rounded-tr-xl border-r-2 border-t-2")} />
          <span className={cn(corner, "bottom-0 left-0 rounded-bl-xl border-b-2 border-l-2")} />
          <span className={cn(corner, "bottom-0 right-0 rounded-br-xl border-b-2 border-r-2")} />
        </div>
      </div>
      <div className="space-y-3 px-4 pt-5 text-center">
        <p className="font-display text-lg font-semibold text-chalk-50">Searching for fossil patterns…</p>
        <div className="mx-auto h-1 w-40 overflow-hidden rounded-full bg-granite-800">
          <div className="h-full w-1/3 animate-indeterminate rounded-full bg-mineral-400" />
        </div>
      </div>
    </div>
  );
}

function ResultsScreen() {
  return (
    <div className="px-3">
      <ResultSummary
        analysis={EXAMPLE_ANALYSIS}
        media={
          <FossilArt
            seed="preview-brachiopod"
            form="brachiopod"
            matrix={["#cbc1aa", "#7d735f"]}
            fossil={["#f0e5d0", "#a08a66"]}
            className="h-full w-full"
          />
        }
      />
    </div>
  );
}

function LibraryScreen() {
  const ids = ["ammonite", "granite", "quartz", "trilobite", "amber", "jurassic"];
  return (
    <div>
      <ScreenHeader eyebrow="Encyclopedia" title="Rock Library" />
      <div className="mx-4 mb-3 flex h-10 items-center gap-2 rounded-xl bg-granite-900 px-3 text-xs text-granite-500 ring-1 ring-granite-700">
        <Search className="h-3.5 w-3.5" /> Search rocks, fossils…
      </div>
      <div className="grid grid-cols-2 gap-2.5 px-4">
        {ids.map((id) => {
          const e = getEntry(id)!;
          return (
            <div key={id} className="overflow-hidden rounded-xl bg-granite-900 ring-1 ring-granite-700/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/library/${id}.svg`} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-2">
                <p className="text-[9px] uppercase tracking-wider text-mineral-400">{CATEGORY_META[e.category].label}</p>
                <p className="font-display text-xs font-semibold text-chalk-50">{e.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AppPreview() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-6 pt-8 sm:mx-0 sm:px-0">
      <div className="mx-auto flex w-max snap-x snap-mandatory gap-8 lg:w-full lg:justify-center">
        <PhoneFrame caption="Scanning animation while the AI works">
          <ScanScreen />
        </PhoneFrame>
        <PhoneFrame caption="Results at a glance — illustrative example" className="lg:-translate-y-6">
          <ResultsScreen />
        </PhoneFrame>
        <PhoneFrame caption="55 illustrated library entries">
          <LibraryScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
