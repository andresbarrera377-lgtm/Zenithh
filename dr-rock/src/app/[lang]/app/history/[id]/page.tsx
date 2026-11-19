import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryDetail } from "@/components/history/HistoryDetail";
import { getLocale, getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await getLocale()).history.meta.entry };
}

/** History entries live in the browser (IndexedDB), so this page loads them client-side. */
export default function HistoryEntryPage() {
  return (
    <Suspense fallback={<div className="shimmer h-[420px] rounded-[1.25rem]" aria-hidden />}>
      <HistoryDetail />
    </Suspense>
  );
}
