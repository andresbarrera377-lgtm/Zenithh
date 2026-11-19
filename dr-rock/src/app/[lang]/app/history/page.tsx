import type { Metadata } from "next";
import { HistoryBrowser } from "@/components/history/HistoryBrowser";
import { HistoryTabs } from "@/components/history/HistoryTabs";
import { PageHeader } from "@/components/ui/primitives";
import { HISTORY_LIMIT } from "@/lib/history/limits";
import { getLocale, getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale()).history.meta;
  return { title: t.title, description: t.description };
}

/** Scans live in the browser (IndexedDB), so the list loads client-side. */
export default async function HistoryPage() {
  const t = getMessages(await getLocale()).history.page;
  return (
    <div className="space-y-8">
      <HistoryTabs active="history" />
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.lead(HISTORY_LIMIT)} />
      <HistoryBrowser />
    </div>
  );
}
