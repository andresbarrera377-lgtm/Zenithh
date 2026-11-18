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
import { getLocale, getMessages } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return { title: { absolute: t.landing.metaTitle }, description: t.common.description };
}

const STEP_ICONS: LucideIcon[] = [Camera, Microscope, Hourglass];
const FEATURE_ICONS: LucideIcon[] = [Bone, ScanSearch, Hourglass, FlaskConical, BookOpenText, Gem];
const ABOUT_ICONS: LucideIcon[] = [ScanSearch, ShieldCheck, BookOpenText];

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

export default async function LandingPage() {
  const locale = await getLocale();
  const { landing: t, common } = getMessages(locale);
  const features = t.features.items.map((item, i) => ({
    ...item,
    icon: FEATURE_ICONS[i],
    text: i === 4 ? t.features.libraryText(LIBRARY.length) : item.text,
  }));
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
              {t.hero.title1}
              <br />
              <span className="text-gradient-mineral">{t.hero.title2}</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-granite-300">{t.hero.lead}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app" size="xl" icon={<Sparkles className="h-5 w-5" />}>
                {t.hero.explore}
              </ButtonLink>
              <ButtonLink href="#download" size="xl" variant="secondary" icon={<Download className="h-5 w-5" />}>
                {t.hero.download}
              </ButtonLink>
            </div>
            <p className="text-sm text-granite-500">{t.hero.worksIn}</p>
          </div>
          <div className="relative animate-fade-in">
            <HeroSpecimen className="aspect-square w-full animate-float lg:aspect-[4/4.2]" lang={locale} />
          </div>
        </div>
        <a href="#about" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-granite-500 hover:text-chalk-50 lg:block" aria-label={t.hero.scroll}>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 border-t hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="about-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="about-title" eyebrow={t.about.eyebrow} title={t.about.title}>
            {t.about.lead}
          </SectionHeading>
          <div className="grid gap-4 md:grid-cols-3">
            {t.about.items.map(({ title, text }, i) => ({ title, text, icon: ABOUT_ICONS[i] })).map(({ icon: Icon, title, text }) => (
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
          <SectionHeading id="how-title" eyebrow={t.how.eyebrow} title={t.how.title} />
          <ol className="relative grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-mineral-500/50 to-transparent md:block" aria-hidden />
            {t.how.steps.map(({ title, text }, i) => {
              const Icon = STEP_ICONS[i];
              return (
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
              );
            })}
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 border-y hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="features-title">
        <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="features-title" eyebrow={t.features.eyebrow} title={t.features.title}>
            {t.features.lead}
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
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
          <SectionHeading id="preview-title" eyebrow={t.preview.eyebrow} title={t.preview.title}>
            {t.preview.lead}
          </SectionHeading>
          <AppPreview />
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="scroll-mt-20 border-t hairline bg-carbon-900/40 py-20 sm:py-28" aria-labelledby="download-title">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
          <SectionHeading id="download-title" eyebrow={t.download.eyebrow} title={t.download.title}>
            {t.download.lead}
          </SectionHeading>
          <DownloadSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <SectionHeading id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
          <div className="space-y-3">
            {t.faq.items.map(({ q, a }) => (
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
              {t.faq.cta}
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
              {common.description} {common.slogan}
            </p>
          </div>
          <nav aria-label={t.footer.footerNav} className="space-y-3 text-sm">
            <p className="label-mono text-granite-500">{t.footer.explore}</p>
            <ul className="space-y-2">
              <li>
                <Link href="/app" className="text-granite-300 hover:text-chalk-50">{t.footer.webApp}</Link>
              </li>
              <li>
                <Link href="/app/scan" className="text-granite-300 hover:text-chalk-50">{t.footer.scan}</Link>
              </li>
              <li>
                <Link href="/app/library" className="text-granite-300 hover:text-chalk-50">{t.footer.library}</Link>
              </li>
              <li>
                <Link href="/app/about" className="text-granite-300 hover:text-chalk-50">{t.footer.about}</Link>
              </li>
            </ul>
          </nav>
          <div className="space-y-3 text-sm">
            <p className="label-mono text-granite-500">{t.footer.contact}</p>
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-granite-300 hover:text-chalk-50">
                {siteConfig.contactEmail}
              </a>
            ) : (
              <p className="text-granite-400">{t.footer.contactSoon}</p>
            )}
          </div>
        </div>
        <div className="border-t hairline">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-6 text-xs leading-relaxed text-granite-500 sm:px-6 lg:px-8">
            <p>
              <strong className="text-granite-400">{t.footer.notice}</strong> {common.disclaimer}
            </p>
            <p>© 2026 {siteConfig.name}. {t.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
