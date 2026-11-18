import type { Metadata } from "next";
import { Suspense } from "react";
import { LibraryBrowser, LibraryBrowserSkeleton } from "@/components/library/LibraryBrowser";
import { PageHeader } from "@/components/ui/primitives";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { LIBRARY } from "@/lib/library";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale()).library.meta;
  return { title: t.title, description: t.description };
}

export default async function LibraryPage() {
  const t = getMessages(await getLocale()).library.page;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.lead(LIBRARY.length)} />
      <Suspense fallback={<LibraryBrowserSkeleton />}>
        <LibraryBrowser />
      </Suspense>
    </div>
  );
}
