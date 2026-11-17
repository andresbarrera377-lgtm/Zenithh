import type { Metadata } from "next";
import { CollectionBrowser } from "@/components/collection/CollectionBrowser";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "My Collection",
  description: "Your saved rock analyses, photos and notes.",
};

export default function CollectionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Field journal"
        title="My Collection"
        description="Every specimen you've saved, with its photo, full report, your notes and tags."
      />
      <CollectionBrowser />
    </div>
  );
}
