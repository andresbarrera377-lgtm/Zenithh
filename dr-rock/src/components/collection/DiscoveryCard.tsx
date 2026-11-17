"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VerdictBadge } from "@/components/results/ResultSummary";
import { CLASSIFICATION_META } from "@/lib/analysis/presentation";
import { updateDiscovery, useObjectUrl } from "@/lib/collection/store";
import type { Discovery } from "@/lib/collection/types";
import { cn, formatDate } from "@/lib/utils";

export function DiscoveryCard({ discovery }: { discovery: Discovery }) {
  const thumb = useObjectUrl(discovery.thumbnail);
  const { analysis } = discovery;
  return (
    <div className="group panel relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:ring-1 hover:ring-mineral-500/40">
      <Link href={`/app/collection/${discovery.id}`} className="absolute inset-0 z-10" aria-label={`Open ${discovery.title}`} />
      <div className="relative aspect-[4/3] bg-carbon-900">
        {thumb ? (
          <Image src={thumb} alt="" fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : (
          <div className="shimmer absolute inset-0" />
        )}
        <div className="absolute bottom-3 left-3">
          <VerdictBadge verdict={analysis.verdict} className="bg-carbon-950/75 backdrop-blur" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold text-chalk-50">{discovery.title}</h3>
            <p className="truncate text-xs text-granite-400">
              {discovery.title !== analysis.identification.rockName && `${analysis.identification.rockName} · `}
              {CLASSIFICATION_META[analysis.identification.classification].label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateDiscovery(discovery.id, { favorite: !discovery.favorite })}
            className={cn(
              "relative z-20 grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
              discovery.favorite ? "text-ochre-400" : "text-granite-500 hover:text-chalk-50",
            )}
            aria-pressed={discovery.favorite}
            aria-label={discovery.favorite ? "Remove from favourites" : "Add to favourites"}
          >
            <Star className="h-5 w-5" fill={discovery.favorite ? "currentColor" : "none"} />
          </button>
        </div>
        {discovery.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {discovery.tags.slice(0, 4).map((t) => (
              <li key={t} className="rounded-full bg-granite-800 px-2 py-0.5 text-[11px] text-granite-200">
                #{t}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-auto pt-1 font-mono text-[11px] text-granite-500">{formatDate(discovery.createdAt)}</p>
      </div>
    </div>
  );
}
