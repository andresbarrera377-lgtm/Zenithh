import { Cpu, Database, Lock, Microscope, ShieldCheck, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { EarthLayers } from "@/components/results/EarthLayers";
import { VerdictBadge } from "@/components/results/ResultSummary";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Notice, Panel } from "@/components/ui/primitives";
import { VERDICTS } from "@/lib/analysis/schema";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale()).app.meta.about;
  return { title: t.title, description: t.description };
}

const PIPELINE_ICONS = [Smartphone, Lock, Cpu, ShieldCheck];

export default async function AboutPage() {
  const m = getMessages(await getLocale());
  const t = m.app.about;
  return (
    <div className="space-y-12">
      <header className="space-y-5">
        <Logo markClassName="h-12 w-12" wordmarkClassName="text-3xl" />
        <div className="max-w-2xl space-y-3">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-chalk-50 md:text-4xl">
            {t.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-granite-300">
            {t.lead(siteConfig.name)}
          </p>
        </div>
      </header>

      <section className="space-y-5" aria-labelledby="how-title">
        <h2 id="how-title" className="font-display text-2xl font-semibold text-chalk-50">
          {t.howTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {t.pipeline.map(({ title, text }, i) => {
            const Icon = PIPELINE_ICONS[i];
            return (
            <Panel key={title} className="space-y-3 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mineral-500/12 text-mineral-300 ring-1 ring-mineral-500/30">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-chalk-50">{title}</h3>
              <p className="text-sm leading-relaxed text-granite-300">{text}</p>
            </Panel>
            );
          })}
        </div>
        <Notice kind="info" title={t.noResultTitle}>
          {t.noResultText}
        </Notice>
      </section>

      <section className="space-y-5" aria-labelledby="verdicts-title">
        <h2 id="verdicts-title" className="font-display text-2xl font-semibold text-chalk-50">
          {t.verdictsTitle}
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-granite-300">
          {t.verdictsLead}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {VERDICTS.map((v) => (
            <Panel key={v} className="space-y-2 p-5">
              <VerdictBadge verdict={v} />
              <p className="text-sm leading-relaxed text-granite-300">{m.report.verdicts[v].description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="earth-title">
        <h2 id="earth-title" className="font-display text-2xl font-semibold text-chalk-50">
          {t.fossilsTitle}
        </h2>
        <Panel className="space-y-5 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-granite-300">
            {t.fossilsText}
          </p>
          <EarthLayers />
        </Panel>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label={t.dataLabel}>
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-chalk-50">
            <Lock className="h-5 w-5 text-mineral-400" /> {t.privacyTitle}
          </h2>
          <p className="text-sm leading-relaxed text-granite-300">
            {t.privacyText}
          </p>
        </Panel>
        <Panel className="space-y-3 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-chalk-50">
            <Database className="h-5 w-5 text-mineral-400" /> {t.collectionTitle}
          </h2>
          <p className="text-sm leading-relaxed text-granite-300">
            {t.collectionText}
          </p>
        </Panel>
      </section>

      <Notice kind="warning" title={t.noticeTitle}>
        {m.common.disclaimer} {t.noticeExtra}
      </Notice>

      <section className="space-y-2 text-sm text-granite-400">
        <p>
          {t.sources}
        </p>
      </section>

      <ButtonLink href="/app/scan" size="lg" icon={<Microscope className="h-5 w-5" />}>
        {t.cta}
      </ButtonLink>
    </div>
  );
}
