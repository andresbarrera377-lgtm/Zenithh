import { Compass } from "lucide-react";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getLocale, getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await getLocale()).pages.notFound.meta, robots: { index: false } };
}

export default async function NotFound() {
  const t = getMessages(await getLocale()).pages.notFound;
  return (
    <main className="grid min-h-dvh place-items-center bg-grid px-6">
      <div className="max-w-md space-y-6 text-center">
        <Logo className="justify-center" />
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-granite-800 text-mineral-300 ring-1 ring-granite-600/60">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="label-mono text-mineral-400">{t.code}</p>
          <h1 className="font-display text-2xl font-semibold text-chalk-50">{t.title}</h1>
          <p className="text-granite-300">{t.text}</p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <ButtonLink href="/app">{t.openApp}</ButtonLink>
          <ButtonLink href="/app/library" variant="secondary">
            {t.library}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
