import { FossilArt } from "@/components/art/FossilArt";
import { MESSAGES } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Decorative hero visual: an ammonite in its rock matrix under the Dr.Rock scanner HUD.
 * Purely illustrative — it shows no measurement values.
 */
export function HeroSpecimen({ className, lang }: { className?: string; lang: Locale }) {
  const t = MESSAGES[lang].common.heroArt;
  const corner = "absolute h-10 w-10 border-mineral-300/90";
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] bg-carbon-900 ring-1 ring-granite-700/80", className)}>
      <FossilArt
        seed="hero-ammonite"
        form="ammonite"
        matrix={["#a39a8c", "#4b463f"]}
        fossil={["#e0c093", "#7a5634"]}
        className="absolute inset-0 h-full w-full"
        title={t.title}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-fine opacity-40" />
        <div className="absolute inset-x-0 h-20 -translate-y-1/2 animate-scan">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-mineral-400/20 to-transparent" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-mineral-300 shadow-[0_0_18px_4px_rgba(79,227,164,0.6)]" />
        </div>
        <div className="absolute inset-5">
          <span className={cn(corner, "left-0 top-0 rounded-tl-2xl border-l-2 border-t-2")} />
          <span className={cn(corner, "right-0 top-0 rounded-tr-2xl border-r-2 border-t-2")} />
          <span className={cn(corner, "bottom-0 left-0 rounded-bl-2xl border-b-2 border-l-2")} />
          <span className={cn(corner, "bottom-0 right-0 rounded-br-2xl border-b-2 border-r-2")} />
        </div>
        <div className="absolute left-1/2 top-[49%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-mineral-300/60 animate-spin-slow" />
        <div className="label-mono absolute left-7 top-7 rounded bg-carbon-950/70 px-2 py-1 text-mineral-300 backdrop-blur">
          {t.hud}
        </div>
        <div className="label-mono absolute bottom-7 left-7 rounded bg-carbon-950/70 px-2 py-1 text-mineral-300 backdrop-blur">
          <span className="animate-blink">▮</span> {t.label}
        </div>
      </div>
    </div>
  );
}
