import {
  ArrowRight,
  BookOpenText,
  Bone,
  Camera,
  ChevronDown,
  Download,
  FlaskConical,
  Gem,
  Hourglass,
  Microscope,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroSpecimen } from "@/components/brand/HeroSpecimen";
import { Logo } from "@/components/brand/Logo";
import { AppPreview } from "@/components/landing/AppPreview";
import { DownloadSection } from "@/components/landing/DownloadSection";
import { LandingNav } from "@/components/landing/LandingNav";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Panel } from "@/components/ui/primitives";
import { LIBRARY } from "@/lib/library";
import { SCIENTIFIC_DISCLAIMER, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.slogan}` },
  description: siteConfig.description,
};

const STEPS: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Camera,
    title: "Capture a photo",
    text: "Photograph a rock with your phone or upload an image from your computer. Field notes are optional.",
  },
  {
    icon: Microscope,
    title: "Let AI analyze it",
    text: "A multimodal AI examines texture, colour, structures, minerals and possible organism impressions.",
  },
  {
    icon: Hourglass,
    title: "Discover its geological history",
    text: "Get a scientific report: identification, fossil verdict, age range, setting, composition and curiosities.",
  },
];

const FEATURES: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Bone,
    title: "AI Fossil Detection",
    text: "Four honest verdicts — from probable fossil to insufficient image — with confidence levels and the reasoning behind them.",
  },
  {
    icon: ScanSearch,
    title: "Rock Identification",
    text: "Probable name, rock type and family (igneous, sedimentary, metamorphic) backed by the visible features that justify it.",
  },
  {
    icon: Hourglass,
    title: "Geological Age Estimation",
    text: "Period, era and age ranges on an interactive time scale — keeping the age of the rock separate from the age of the fossil.",
  },
  {
    icon: FlaskConical,
    title: "Mineral Composition",
    text: "Probable minerals, chemistry, Mohs hardness, porosity and density, drawn from typical published values.",
  },
  {
    icon: BookOpenText,
    title: "Geological Encyclopedia",
    text: `The Rock Library: ${LIBRARY.length} illustrated entries on rocks, fossils, minerals, periods and eras, with search and filters.`,
  },
  {
    icon: Gem,
    title: "Personal Rock Collection",
    text: "Save analyses with their photos, add notes and tags, mark favourites and organise your discoveries — privately on your device.",
  },
];

const FAQ = [
  {
    q: "How accurate is it?",
    a: "Identification from a photo is an educated estimate. Dr.Rock shows how confident the AI is, explains why, and says so plainly when a photo isn't enough. Confirm important finds with a geologist, museum or geological survey.",
  },
  {
    q: "Can it really tell if my rock has a fossil?",
    a: "It looks for features that are diagnostic of fossils and weighs look-alikes such as mineral dendrites and concretions. It never claims a fossil from appearance alone with certainty: the verdict is probable, inconclusive, not visible, or insufficient image.",
  },
  {
    q: "What happens to my photos?",
    a: "Photos are resized and stripped of metadata (including GPS) on your device, sent to the AI only to generate your report, and not kept on Dr.Rock's servers. Your collection is saved locally in your browser.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Dr.Rock runs in your browser on Android, iPhone, Windows and Mac. You can optionally install it as an app from your browser for quick, full-screen access.",
  },
];

function SectionHeading({ eyebrow, title, children, id }: { eyebrow: string; title: ReactNode; children?: ReactNode; id: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4 text-center">
      <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
      <h2 id={id} className="font-display text-3xl font-semibold tracking-tight text-chalk-50 sm:text-4xl">
        {title}
      </h2>
      {children && <p className="text-[15px] leading-relaxed text-granite-300 sm:text-base">{children}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative overflow-x-clip">
      <LandingNav />

      {/* HERO */}
      <section className="relative isolate pt-28 sm:pt-32" aria-labelledby="hero-title">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 mask-fade" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-mineral-500/15 blur-[120px]" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:pb-28">
          <div className="space-y-7 animate-fade-up">
            <Logo markClassName="h-12 w-12" wordmarkClassName="text-3xl" />
            <h1 id="hero-title" className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-chalk-50 sm:text-6xl lg:text-7xl">
              Every rock has a story.
              <br />
              <span className="text-gradient-mineral">Discover yours.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-granite-300">
              Dr.Rock is an AI-powered geology lab in your pocket. Photograph a rock to identify it, look for signs of ancient life
              and uncover its journey through deep time.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app" size="xl" icon={<Sparkles className="h-5 w-5" />}>
                Explore Dr.Rock
              </ButtonLink>
              <ButtonLink href="#download" size="xl" variant="secondary" icon={<Download className="h-5 w-5" />}>
                Download app
              </ButtonLink>
            </div>
            <p className="text-sm text-granite-500">Works in your browser on Android, iPhone, Windows and Mac.</p>
          </div>
          <div className="relative animate-fade-in">
            <HeroSpecimen className="aspect-square w-full animate-float lg:aspect-[4/4.2]" />
          </div>
        </div>
        <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-granite-500 hover:text-chalk-50 lg:block" aria-label="Scroll to About">
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 border-t hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="about-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="about-title" eyebrow="About" title="Where artificial intelligence meets the science of rocks">
            Dr.Rock combines a multimodal AI model with the reasoning of geologists and paleontologists. It reads the clues that
            rocks keep — crystals, grains, layers, shells and imprints — and turns them into a clear, responsible explanation of
            what you&apos;re holding.
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ScanSearch,
                title: "Evidence first",
                text: "Every identification lists the visible features that support it, and the alternatives considered.",
              },
              {
                icon: ShieldCheck,
                title: "Honest by design",
                text: "Confidence levels, careful fossil verdicts and age ranges — never an invented exact age or a fake result.",
              },
              {
                icon: BookOpenText,
                title: "Built to teach",
                text: "Each report explains how the rock formed, where it occurs and what it tells us about Earth's history.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Panel key={title} className="space-y-3 p-6">
                <Icon className="h-6 w-6 text-mineral-400" />
                <h3 className="font-display text-lg font-semibold text-chalk-50">{title}</h3>
                <p className="text-sm leading-relaxed text-granite-300">{text}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="how-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="how-title" eyebrow="How it works" title="Three steps from pebble to prehistory" />
          <ol className="relative grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-mineral-500/50 to-transparent md:block" aria-hidden />
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative flex flex-col items-center gap-4 text-center">
                <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-carbon-900 text-mineral-300 ring-1 ring-mineral-500/40">
                  <Icon className="h-8 w-8" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-mineral-400 font-display text-sm font-bold text-carbon-950">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-display text-xl font-semibold text-chalk-50">{title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-granite-300">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 border-y hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="features-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="features-title" eyebrow="Features" title="A complete field laboratory">
            Everything a curious explorer needs to understand a specimen — and to keep a record of every discovery.
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Panel key={title} className="group space-y-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-mineral-500/40">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mineral-500/12 text-mineral-300 ring-1 ring-mineral-500/30 transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-semibold text-chalk-50">{title}</h3>
                <p className="text-sm leading-relaxed text-granite-300">{text}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="preview-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="preview-title" eyebrow="Preview" title="Designed like a scientific instrument">
            A clean, focused interface that works as well on a muddy riverbank as on a desktop. The report shown is an illustrative
            example, not a live analysis.
          </SectionHeading>
          <AppPreview />
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="scroll-mt-20 border-t hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="download-title">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="download-title" eyebrow="Download" title="Get Dr.Rock on any device">
            Start exploring right now in your browser, and install it as an app on your phone or computer.
          </SectionHeading>
          <DownloadSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions explorers ask" />
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="panel group p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-semibold text-chalk-50">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-granite-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="pt-3 text-sm leading-relaxed text-granite-300">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center">
            <ButtonLink href="/app" size="lg" trailingIcon={<ArrowRight className="h-5 w-5" />}>
              Start exploring
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t hairline bg-carbon-900/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-granite-400">
              {siteConfig.description} {siteConfig.slogan}
            </p>
          </div>
          <nav aria-label="Footer" className="space-y-3 text-sm">
            <p className="label-mono text-granite-500">Explore</p>
            <ul className="space-y-2">
              <li>
                <Link href="/app" className="text-granite-300 hover:text-chalk-50">Web app</Link>
              </li>
              <li>
                <Link href="/app/scan" className="text-granite-300 hover:text-chalk-50">Scan a rock</Link>
              </li>
              <li>
                <Link href="/app/library" className="text-granite-300 hover:text-chalk-50">Rock Library</Link>
              </li>
              <li>
                <Link href="/app/about" className="text-granite-300 hover:text-chalk-50">About Dr.Rock</Link>
              </li>
            </ul>
          </nav>
          <div className="space-y-3 text-sm">
            <p className="label-mono text-granite-500">Contact</p>
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-granite-300 hover:text-chalk-50">
                {siteConfig.contactEmail}
              </a>
            ) : (
              <p className="text-granite-400">Contact details coming soon.</p>
            )}
          </div>
        </div>
        <div className="border-t hairline">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-6 text-xs leading-relaxed text-granite-500 sm:px-6 lg:px-8">
            <p>
              <strong className="text-granite-400">Scientific notice:</strong> {SCIENTIFIC_DISCLAIMER}
            </p>
            <p>© 2026 {siteConfig.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
