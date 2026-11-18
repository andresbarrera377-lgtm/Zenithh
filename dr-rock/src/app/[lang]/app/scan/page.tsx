import type { Metadata } from "next";
import { ScanPanel } from "@/components/scan/ScanPanel";
import { PageHeader } from "@/components/ui/primitives";
import { getLocale, getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale()).app.meta.scan;
  return { title: t.title, description: t.description };
}

export default async function ScanPage() {
  const t = getMessages(await getLocale()).scan;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={t.pageEyebrow} title={t.pageTitle} description={t.pageLead} />
      <ScanPanel />
    </div>
  );
}
