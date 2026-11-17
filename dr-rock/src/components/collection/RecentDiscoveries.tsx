"use client";

import { ArrowRight, Gem } from "lucide-react";
import Link from "next/link";
import { useDiscoveries } from "@/lib/collection/store";
import { DiscoveryCard } from "./DiscoveryCard";

export function RecentDiscoveries() {
  const { data, loading } = useDiscoveries();
  if (loading) return <div className="shimmer h-40 rounded-[1.25rem]" aria-hidden />;
  if (data.length === 0) {
    return (
      <div className="flex items-center gap-4 rounded-[1.25rem] border border-dashed border-granite-600/60 p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-granite-800 text-mineral-400">
          <Gem className="h-5 w-5" />
        </span>
        <p className="text-sm text-granite-300">
          No saved discoveries yet. Analyze a rock and save the report to start your collection.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.slice(0, 3).map((d) => (
          <DiscoveryCard key={d.id} discovery={d} />
        ))}
      </div>
      {data.length > 3 && (
        <Link href="/app/collection" className="inline-flex items-center gap-1 text-sm text-mineral-300 hover:underline">
          View all {data.length} discoveries <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
