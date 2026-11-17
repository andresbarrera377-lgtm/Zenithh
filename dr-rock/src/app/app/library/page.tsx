import type { Metadata } from "next";
import { Suspense } from "react";
import { LibraryBrowser, LibraryBrowserSkeleton } from "@/components/library/LibraryBrowser";
import { PageHeader } from "@/components/ui/primitives";
import { LIBRARY } from "@/lib/library";

export const metadata: Metadata = {
  title: "Rock Library",
  description: "An interactive encyclopedia of rocks, fossils, minerals and geological time.",
};

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Encyclopedia"
        title="Rock Library"
        description={`Explore ${LIBRARY.length} illustrated entries: igneous, sedimentary and metamorphic rocks, marine and terrestrial fossils, minerals, and the periods and eras of deep time.`}
      />
      <Suspense fallback={<LibraryBrowserSkeleton />}>
        <LibraryBrowser />
      </Suspense>
    </div>
  );
}
