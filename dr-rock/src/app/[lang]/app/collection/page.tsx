import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { PageHeader } from "@/components/ui/primitives";
import { getLocale, getMessages } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(await getLocale()).app.meta.collection;
  return { title: t.title, description: t.description };
}

export default async function CollectionPage() {
  const t = getMessages(await getLocale()).collection.page;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.lead} />
      <CollectionBrowser />
    </div>
  );
}
