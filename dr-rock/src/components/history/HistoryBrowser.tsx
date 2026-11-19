"use client";

import { Camera, Gem, History, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OriginBadge } from "@/components/results/OriginPanel";
import { VerdictBadge } from "@/components/results/ResultSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/primitives";
import { useObjectUrl } from "@/lib/collection/store";
import { clearHistory, HISTORY_LIMIT, useHistory, useStorageEstimate } from "@/lib/history/store";
import type { HistoryEntry } from "@/lib/history/types";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { formatBytes, formatDate, formatTime } from "@/lib/utils";

/** Every finished scan on this device, newest first, grouped by day. */
export function HistoryBrowser() {
  const { data, loading, error } = useHistory();
  const estimate = useStorageEstimate();
  const [confirmClear, setConfirmClear] = useState(false);
  const t = useMessages("history");
  const locale = useLocale();

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="shimmer h-28 rounded-2xl" />
        ))}
      </div>
    );
  }
  if (error) return <Notice kind="error" title={t.error.title}>{t.error.text}</Notice>;
  if (data.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-6 w-6" />}
        title={t.empty.title}
        description={t.empty.text}
        action={
          <ButtonLink href="/app/scan" icon={<Camera className="h-4 w-4" />}>
            {t.empty.cta}
          </ButtonLink>
        }
      />
    );
  }

  const groups: Array<{ day: string; items: HistoryEntry[] }> = [];
  for (const entry of data) {
    const day = formatDate(entry.createdAt, locale);
    const last = groups.at(-1);
    if (last && last.day === day) last.items.push(entry);
    else groups.push({ day, items: [entry] });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-granite-400">
        <span>
          {data.length} / {HISTORY_LIMIT}
          {estimate && ` · ${t.storage(formatBytes(estimate.usage, locale))}`}
        </span>
        {confirmClear ? (
          <span className="flex items-center gap-2">
            <span className="text-granite-200">{t.actions.clearConfirm}</span>
            <Button size="sm" variant="danger" onClick={() => clearHistory().finally(() => setConfirmClear(false))}>
              {t.actions.confirm}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
              {t.actions.cancel}
            </Button>
          </span>
        ) : (
          <Button size="sm" variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmClear(true)}>
            {t.actions.clear}
          </Button>
        )}
      </div>

      {groups.map((group) => (
        <section key={group.day} className="space-y-3" aria-label={group.day}>
          <h2 className="label-mono text-granite-400">{group.day}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((entry) => (
              <li key={entry.id}>
                <HistoryCard entry={entry} time={formatTime(entry.createdAt, locale)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function HistoryCard({ entry, time }: { entry: HistoryEntry; time: string }) {
  const url = useObjectUrl(entry.thumbnail);
  const t = useMessages("history");
  const { analysis } = entry;
  return (
    <Link
      href={`/app/history/${entry.id}`}
      className="group panel flex gap-4 p-3 transition-all hover:ring-1 hover:ring-mineral-500/40"
      aria-label={`${analysis.identification.rockName} · ${t.item.open}`}
    >
      <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-carbon-900">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        {entry.photos.length > 1 && (
          <span className="absolute bottom-1 right-1 rounded bg-carbon-950/80 px-1.5 font-mono text-[10px] text-chalk-50">
            {t.item.photos(entry.photos.length)}
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1 space-y-1.5">
        <span className="block truncate font-display text-base font-semibold text-chalk-50 group-hover:text-mineral-200">
          {analysis.identification.rockName}
        </span>
        <span className="block font-mono text-[11px] text-granite-400">
          {time} · {analysis.confidence.identification}%
        </span>
        <span className="flex flex-wrap gap-1.5">
          <VerdictBadge verdict={analysis.verdict} className="text-[11px]" />
          {analysis.origin && analysis.origin.verdict !== "natural" && <OriginBadge origin={analysis.origin.verdict} className="text-[11px]" />}
          {entry.savedDiscoveryId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ochre-500/10 px-2 py-0.5 text-[11px] text-ochre-300 ring-1 ring-ochre-500/30">
              <Gem className="h-3 w-3" /> {t.item.inCollection}
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}
