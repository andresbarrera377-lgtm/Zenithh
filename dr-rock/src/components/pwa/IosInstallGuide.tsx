"use client";

import { Check, Compass, Plus, Share, SquarePlus, X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const STEP_ICONS: ReactNode[] = [<Compass key="1" className="h-5 w-5" />, <Share key="2" className="h-5 w-5" />, <SquarePlus key="3" className="h-5 w-5" />, <Plus key="4" className="h-5 w-5" />];

/**
 * "Install on iPhone": iOS has no install prompt for web apps and Apple only allows App Store
 * apps to be downloaded, so this opens a step-by-step guide to Share › Add to Home Screen.
 */
export function IosInstallGuide({
  className,
  size = "lg",
  variant = "secondary",
  label,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const t = useMessages("pwa").ios;
  const close = useMessages("common").close;
  const [s1, s2, s3, s4] = t.steps;
  const steps: Array<{ icon: ReactNode; title: string; text: ReactNode }> = [
    { icon: STEP_ICONS[0], ...s1 },
    {
      icon: STEP_ICONS[1],
      title: s2.title,
      text: (
        <>
          {s2.before} <Share className="inline h-3.5 w-3.5 align-[-2px]" aria-label={t.share} />
          {s2.after}
        </>
      ),
    },
    { icon: STEP_ICONS[2], ...s3 },
    { icon: STEP_ICONS[3], ...s4 },
  ];
  const titleId = useId();

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} icon={<SquarePlus className="h-4 w-4" />} onClick={() => dialog.current?.showModal()}>
        {label ?? t.button}
      </Button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-3xl bg-carbon-900 p-0 text-chalk-100 ring-1 ring-granite-700 backdrop:bg-carbon-950/80 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close(); // click on the backdrop
        }}
      >
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="label-mono text-[10px] text-mineral-400">{t.eyebrow}</p>
              <h2 id={titleId} className="font-display text-xl font-semibold text-chalk-50">
                {t.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-granite-400 hover:bg-granite-800 hover:text-chalk-50"
              aria-label={close}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ol className="space-y-2.5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3 rounded-2xl bg-carbon-950/60 p-3 ring-1 ring-granite-800">
                <span
                  className={cn(
                    "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1",
                    i === steps.length - 1 ? "bg-mineral-400 text-carbon-950 ring-mineral-300" : "bg-granite-900 text-mineral-400 ring-granite-700",
                  )}
                >
                  {step.icon}
                  <span className="absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-carbon-950 font-mono text-[10px] text-granite-300 ring-1 ring-granite-700">
                    {i + 1}
                  </span>
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-chalk-50">{step.title}</p>
                  <p className="text-[13px] leading-snug text-granite-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-granite-500">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mineral-400" />
            {t.note}
          </p>
        </div>
      </dialog>
    </>
  );
}
