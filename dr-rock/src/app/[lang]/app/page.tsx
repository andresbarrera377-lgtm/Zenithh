import { ArrowRight, BookOpenText, Camera, ImageUp, Microscope } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { AiStatusIndicator } from "@/components/app-shell/AiStatus";
import { HeroSpecimen } from "@/components/brand/HeroSpecimen";
import { InstallHint } from "@/components/pwa/InstallHint";
import { RecentDiscoveries } from "@/components/collection/RecentDiscoveries";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Panel } from "@/components/ui/primitives";
import type { Locale } from "@/lib/i18n/config";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { getEntry, libraryImage, specimenOfTheDay } from "@/lib/library";
import { CATEGORY_META, type LibraryCategory } from "@/lib/library/types";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await getLocale()).app.meta.home };
}

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

async function SpecimenOfTheDay({ lang }: { lang: Locale }) {
  "use cache";
  cacheLife("hours");
  const entry = specimenOfTheDay(new Date(), lang);
  const t = getMessages(lang).app.home;
  return (
    <Link href={`/app/library/${entry.id}`} className="group panel flex flex-col overflow-hidden sm:flex-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={libraryImage(entry, lang)} alt="" className="aspect-[4/3] w-full object-cover sm:w-56" loading="lazy" />
      <div className="flex flex-1 flex-col justify-center gap-2 p-5">
        <p className="label-mono text-ochre-400">{t.specimenOfDay}</p>
        <h3 className="font-display text-xl font-semibold text-chalk-50 group-hover:text-mineral-200">{entry.name}</h3>
        <p className="text-sm leading-relaxed text-granite-300">{entry.summary}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-mineral-300">
          {t.readEntry} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const lang = await getLocale();
  const t = getMessages(lang).app.home;
  const meta = CATEGORY_META[lang];
  return (
    <div className="space-y-12">
      <section className="relative grid items-center gap-8 overflow-hidden lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6 animate-fade-up">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-chalk-50 sm:text-5xl">
            {t.titleA}
            <br />
            <span className="text-gradient-mineral">{t.titleB}</span>
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-granite-300 sm:text-base">
            {t.lead}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/app/scan" size="lg" icon={<Microscope className="h-5 w-5" />}>
              {t.scan}
            </ButtonLink>
            <ButtonLink href="/app/library" size="lg" variant="secondary" icon={<BookOpenText className="h-5 w-5" />}>
              {t.explore}
            </ButtonLink>
          </div>
          <AiStatusIndicator />
        </div>
        <HeroSpecimen className="aspect-[4/3] w-full" lang={lang} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <QuickAction href="/app/scan" icon={<Camera className="h-6 w-6" />} title={t.photo.title} text={t.photo.text} />
        <QuickAction href="/app/scan" icon={<ImageUp className="h-6 w-6" />} title={t.upload.title} text={t.upload.text} />
      </section>

      <InstallHint />

      <section className="space-y-4" aria-labelledby="recent-title">
        <div className="flex items-end justify-between">
          <h2 id="recent-title" className="font-display text-2xl font-semibold text-chalk-50">
            {t.recent}
          </h2>
          <span className="flex gap-4">
            <Link href="/app/history" className="text-sm text-mineral-300 hover:underline">
              {t.history}
            </Link>
            <Link href="/app/collection" className="text-sm text-mineral-300 hover:underline">
              {t.myCollection}
            </Link>
          </span>
        </div>
        <RecentDiscoveries />
      </section>

      <section className="space-y-4">
        <SpecimenOfTheDay lang={lang} />
      </section>

      <section className="space-y-4" aria-labelledby="explore-title">
        <div className="flex items-end justify-between">
          <h2 id="explore-title" className="font-display text-2xl font-semibold text-chalk-50">
            {t.exploreLibrary}
          </h2>
          <Link href="/app/library" className="text-sm text-mineral-300 hover:underline">
            {t.viewAll}
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
              <img src={libraryImage(getEntry(image)!, lang)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/95 via-carbon-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="label-mono text-[10px] text-granite-400">{meta[category].group}</p>
                <p className="font-display font-semibold text-chalk-50">{meta[category].plural}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Panel className="p-5 text-sm leading-relaxed text-granite-400">
        <strong className="text-granite-200">{siteConfig.name}</strong> {t.disclaimer}{" "}
        <Link href="/app/about" className="text-mineral-300 hover:underline">
          {t.howItWorks}
        </Link>
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
