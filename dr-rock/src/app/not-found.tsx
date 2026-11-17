import { Compass } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-grid px-6">
      <div className="max-w-md space-y-6 text-center">
        <Logo className="justify-center" />
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-granite-800 text-mineral-300 ring-1 ring-granite-600/60">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="label-mono text-mineral-400">Error 404</p>
          <h1 className="font-display text-2xl font-semibold text-chalk-50">This page is off the map</h1>
          <p className="text-granite-300">The page you were looking for doesn&apos;t exist or has moved.</p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink href="/app">Open the app</ButtonLink>
          <ButtonLink href="/app/library" variant="secondary">
            Rock Library
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
