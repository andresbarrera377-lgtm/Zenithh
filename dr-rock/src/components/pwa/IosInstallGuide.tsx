"use client";

import { Check, Compass, Plus, Share, SquarePlus, X } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS: Array<{ icon: ReactNode; title: string; text: ReactNode }> = [
  {
    icon: <Compass className="h-5 w-5" />,
    title: "Open Dr.Rock in Safari",
    text: "Go to dr-rock.netlify.app in Safari (recent iOS versions also allow Chrome).",
  },
  {
    icon: <Share className="h-5 w-5" />,
    title: "Tap the Share button",
    text: (
      <>
        The square with an arrow pointing up <Share className="inline h-3.5 w-3.5 align-[-2px]" aria-label="Share" />, at the bottom of
        the screen (top on iPad).
      </>
    ),
  },
  {
    icon: <SquarePlus className="h-5 w-5" />,
    title: "Choose “Add to Home Screen”",
    text: "Scroll down the list if you don't see it. Keep “Open as Web App” on.",
  },
  {
    icon: <Plus className="h-5 w-5" />,
    title: "Tap “Add”",
    text: "Dr.Rock appears on your Home Screen and opens full screen, like any app.",
  },
];

/**
 * "Install on iPhone": iOS has no install prompt for web apps and Apple only allows App Store
 * apps to be downloaded, so this opens a step-by-step guide to Share › Add to Home Screen.
 */
export function IosInstallGuide({
  className,
  size = "lg",
  variant = "secondary",
  label = "Install on iPhone",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <Button type="button" size={size} variant={variant} className={className} icon={<SquarePlus className="h-4 w-4" />} onClick={() => dialog.current?.showModal()}>
        {label}
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
              <p className="label-mono text-[10px] text-mineral-400">iPhone &amp; iPad</p>
              <h2 id={titleId} className="font-display text-xl font-semibold text-chalk-50">
                Install Dr.Rock in 4 steps
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-granite-400 hover:bg-granite-800 hover:text-chalk-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ol className="space-y-2.5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3 rounded-2xl bg-carbon-950/60 p-3 ring-1 ring-granite-800">
                <span
                  className={cn(
                    "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1",
                    i === STEPS.length - 1 ? "bg-mineral-400 text-carbon-950 ring-mineral-300" : "bg-granite-900 text-mineral-400 ring-granite-700",
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
            No App Store needed. Your collection stays on your device; analyzing a rock needs an internet connection.
          </p>
        </div>
      </dialog>
    </>
  );
}
