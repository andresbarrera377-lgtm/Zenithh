import { Cpu, Database, Lock, Microscope, ShieldCheck, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { EarthLayers } from "@/components/results/EarthLayers";
import { VerdictBadge } from "@/components/results/ResultSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Notice, Panel } from "@/components/ui/primitives";
import { VERDICT_META } from "@/lib/analysis/presentation";
import { VERDICTS } from "@/lib/analysis/schema";
import { SCIENTIFIC_DISCLAIMER, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "How Dr.Rock analyzes rocks, its scientific safeguards and privacy.",
};

const PIPELINE = [
  {
    icon: Smartphone,
    title: "1 · Prepared on your device",
    text: "The photo is rotated, resized to ~1600 px and re-encoded as JPEG in your browser. This removes EXIF metadata, including GPS location.",
  },
  {
    icon: Lock,
    title: "2 · Sent to a secure backend",
    text: "Dr.Rock's server validates the file (real format, size, dimensions) and applies rate limits. The AI provider's API key exists only on the server.",
  },
  {
    icon: Cpu,
    title: "3 · Examined by a multimodal AI",
    text: "A multimodal Claude model studies texture, colour, shape, patterns, structures, possible organism impressions, minerals and sedimentary features, and returns a structured JSON report.",
  },
  {
    icon: ShieldCheck,
    title: "4 · Checked against scientific rules",
    text: "The report is validated against a strict schema and safety rules: fossil claims need sufficient confidence, ages are ranges (never exact), and fossils are never placed outside the crust.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-5">
        <Logo markClassName="h-12 w-12" wordmarkClassName="text-3xl" />
        <div className="max-w-2xl space-y-3">
          <Eyebrow>About</Eyebrow>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-chalk-50 md:text-4xl">
            A geological laboratory anyone can carry in their pocket.
          </h1>
          <p className="text-[15px] leading-relaxed text-granite-300">
            {siteConfig.name} combines artificial intelligence with geology and paleontology to help curious people understand the
            rocks they find: what they are, how they formed, how old they might be and whether they could hold traces of ancient
            life.
          </p>
        </div>
      </header>

      <section className="space-y-5" aria-labelledby="how-title">
        <h2 id="how-title" className="font-display text-2xl font-semibold text-chalk-50">
          How an analysis works
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PIPELINE.map(({ icon: Icon, title, text }) => (
            <Panel key={title} className="space-y-3 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mineral-500/12 text-mineral-300 ring-1 ring-mineral-500/30">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-chalk-50">{title}</h3>
              <p className="text-sm leading-relaxed text-granite-300">{text}</p>
            </Panel>
          ))}
        </div>
        <Notice kind="info" title="No connection, no result">
          If the AI service is unavailable or not configured, Dr.Rock shows an error. It never produces placeholder or invented
          identifications.
        </Notice>
      </section>

      <section className="space-y-5" aria-labelledby="verdicts-title">
        <h2 id="verdicts-title" className="font-display text-2xl font-semibold text-chalk-50">
          The four fossil verdicts
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-granite-300">
          A photo alone cannot prove that a rock contains a fossil — many mineral structures imitate organisms. Every analysis
          therefore ends in one of four carefully worded verdicts, with a confidence level and the reasoning behind it.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {VERDICTS.map((v) => (
            <Panel key={v} className="space-y-2 p-5">
              <VerdictBadge verdict={v} />
              <p className="text-sm leading-relaxed text-granite-300">{VERDICT_META[v].description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="earth-title">
        <h2 id="earth-title" className="font-display text-2xl font-semibold text-chalk-50">
          Where fossils come from
        </h2>
        <Panel className="space-y-5 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-granite-300">
            Fossils form when remains or traces of organisms are buried in sediment that later turns to rock. That happens at
            Earth&apos;s surface, so fossils are found only in the crust — mostly in sedimentary rocks within a few kilometres of the
            surface. The mantle and core are far too hot for anything biological to survive.
          </p>
          <EarthLayers />
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Privacy and data">
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-chalk-50">
            <Lock className="h-5 w-5 text-mineral-400" /> Privacy
          </h2>
          <p className="text-sm leading-relaxed text-granite-300">
            Photos are sent to the AI provider (Anthropic) only to produce your report; Dr.Rock&apos;s server does not store them.
            Location metadata is removed before upload. Field notes are optional.
          </p>
        </Panel>
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-chalk-50">
            <Database className="h-5 w-5 text-mineral-400" /> Your collection
          </h2>
          <p className="text-sm leading-relaxed text-granite-300">
            Saved discoveries stay on this device, in your browser&apos;s storage. Accounts and cloud sync are planned; until then,
            clearing your browser data deletes the collection.
          </p>
        </Panel>
      </section>

      <Notice kind="warning" title="Scientific notice">
        {SCIENTIFIC_DISCLAIMER} Never collect specimens where it is prohibited, and report significant fossil finds to a museum or
        geological survey.
      </Notice>

      <section className="space-y-2 text-sm text-granite-400">
        <p>
          Geological time scale: International Chronostratigraphic Chart (ICS). Library illustrations are generated procedurally
          by Dr.Rock and are artistic representations, not photographs.
        </p>
      </section>

      <ButtonLink href="/app/scan" size="lg" icon={<Microscope className="h-5 w-5" />}>
        Analyze a rock
      </ButtonLink>
    </div>
  );
}
