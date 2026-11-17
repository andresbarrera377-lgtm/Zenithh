import { ArrowRight, BookOpenText, Camera, ImageUp, Microscope } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { AiStatusIndicator } from "@/components/app-shell/AiStatus";
import { HeroSpecimen } from "@/components/brand/HeroSpecimen";
import { RecentDiscoveries } from "@/components/collection/RecentDiscoveries";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Panel } from "@/components/ui/primitives";
import { specimenOfTheDay } from "@/lib/library";
import { CATEGORY_META, type LibraryCategory } from "@/lib/library/types";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Home" };

const EXPLORE: Array<{ category: LibraryCategory; image: string }> = [
  { category: "igneous", image: "granite" },
  { category: "sedimentary", image: "sandstone" },
  { category: "metamorphic", image: "gneiss" },
  { category: "marine-fossil", image: "ammonite" },
  { category: "terrestrial-fossil", image: "amber" },
  { category: "mineral", image: "quartz" },
  { category: "period", image: "jurassic" },
  { category: "era", image: "mesozoic" },
];

async function SpecimenOfTheDay() {
  "use cache";
  cacheLife("hours");
  const entry = specimenOfTheDay(new Date());
  return (
    <Link href={`/app/library/${entry.id}`} className="group panel flex flex-col overflow-hidden sm:flex-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/library/${entry.id}.svg`} alt="" className="aspect-[4/3] w-full object-cover sm:w-56" loading="lazy" />
      <div className="flex flex-1 flex-col justify-center gap-2 p-5">
        <p className="label-mono text-ochre-400">Specimen of the day</p>
        <h3 className="font-display text-xl font-semibold text-chalk-50 group-hover:text-mineral-200">{entry.name}</h3>
        <p className="text-sm leading-relaxed text-granite-300">{entry.summary}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-mineral-300">
          Read entry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="relative grid items-center gap-8 overflow-hidden lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6 animate-fade-up">
          <Eyebrow>Geology lab in your pocket</Eyebrow>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-chalk-50 sm:text-5xl">
            Every rock has a story.
            <br />
            <span className="text-gradient-mineral">Discover yours.</span>
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-granite-300 sm:text-base">
            Photograph a rock and Dr.Rock&apos;s AI examines its texture, minerals and structures to identify it, look for
            possible fossils and reconstruct its geological history — with honest confidence levels.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/app/scan" size="lg" icon={<Microscope className="h-5 w-5" />}>
              Scan a rock
            </ButtonLink>
            <ButtonLink href="/app/library" size="lg" variant="secondary" icon={<BookOpenText className="h-5 w-5" />}>
              Explore the library
            </ButtonLink>
          </div>
          <AiStatusIndicator />
        </div>
        <HeroSpecimen className="aspect-[4/3] w-full" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <QuickAction href="/app/scan" icon={<Camera className="h-6 w-6" />} title="Take a photo" text="Use your camera to capture a specimen." />
        <QuickAction href="/app/scan" icon={<ImageUp className="h-6 w-6" />} title="Upload image" text="Analyze a photo from your gallery or computer." />
      </section>

      <section className="space-y-4" aria-labelledby="recent-title">
        <div className="flex items-end justify-between">
          <h2 id="recent-title" className="font-display text-2xl font-semibold text-chalk-50">
            Recent discoveries
          </h2>
          <Link href="/app/collection" className="text-sm text-mineral-300 hover:underline">
            My Collection
          </Link>
        </div>
        <RecentDiscoveries />
      </section>

      <section className="space-y-4">
        <SpecimenOfTheDay />
      </section>

      <section className="space-y-4" aria-labelledby="explore-title">
        <div className="flex items-end justify-between">
          <h2 id="explore-title" className="font-display text-2xl font-semibold text-chalk-50">
            Explore the Rock Library
          </h2>
          <Link href="/app/library" className="text-sm text-mineral-300 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {EXPLORE.map(({ category, image }) => (
            <Link
              key={category}
              href={`/app/library?category=${category}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-granite-700/70 transition-all hover:ring-mineral-500/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/library/${image}.svg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/95 via-carbon-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="label-mono text-[10px] text-granite-400">{CATEGORY_META[category].group}</p>
                <p className="font-display font-semibold text-chalk-50">{CATEGORY_META[category].plural}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Panel className="p-5 text-sm leading-relaxed text-granite-400">
        <strong className="text-granite-200">{siteConfig.name}</strong> provides educational estimates based on photographs. Results
        are not a substitute for examination by a professional geologist or paleontologist.
      </Panel>
    </div>
  );
}

function QuickAction({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="group panel flex items-center gap-4 p-5 transition-all hover:ring-1 hover:ring-mineral-500/40">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-mineral-500/15 text-mineral-300 ring-1 ring-mineral-500/30 transition-transform group-hover:scale-105">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-display text-lg font-semibold uppercase tracking-wide text-chalk-50">{title}</span>
        <span className="block text-sm text-granite-400">{text}</span>
      </span>
      <ArrowRight className="h-5 w-5 text-granite-500 transition-transform group-hover:translate-x-1 group-hover:text-mineral-300" />
    </Link>
  );
}
