import type { Metadata } from "next";
import { Suspense } from "react";
import { DiscoveryDetail } from "@/components/collection/DiscoveryDetail";

export const metadata: Metadata = { title: "Discovery" };

/** Saved discoveries live in the browser (IndexedDB), so this page loads them client-side. */
export default function DiscoveryPage() {
  return (
    <Suspense fallback={<div className="shimmer h-[420px] rounded-[1.25rem]" aria-hidden />}>
      <DiscoveryDetail />
    </Suspense>
  );
}
