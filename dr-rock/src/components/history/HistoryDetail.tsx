"use client";

import { ArrowLeft, BookmarkCheck, BookmarkPlus, History, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ResultsView } from "@/components/results/ResultsView";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/primitives";
import { saveDiscovery } from "@/lib/collection/store";
import { markHistorySaved, removeFromHistory, useHistoryEntry } from "@/lib/history/store";
import type { HistoryEntry } from "@/lib/history/types";
import { useLocale, useMessages } from "@/lib/i18n/client";
import { useScanSession } from "@/lib/scan/session";
import { formatDateTime } from "@/lib/utils";

/** Object URLs for a list of Blobs, revoked when the list changes or the component unmounts. */
function useObjectUrls(blobs: Blob[] | undefined): string[] {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    if (!blobs || blobs.length === 0) return;
    const created = blobs.map((b) => URL.createObjectURL(b));
    let active = true;
    queueMicrotask(() => active && setUrls(created));
    return () => {
      active = false;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [blobs]);
  return blobs && blobs.length > 0 ? urls : [];
}

export function HistoryDetail() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : null;
  const { data, loading, error } = useHistoryEntry(id);
  const t = useMessages("history");

  if (loading) {
    return (
      <div className="space-y-6" aria-hidden>
        <div className="shimmer h-6 w-40 rounded" />
        <div className="shimmer h-[420px] rounded-[1.25rem]" />
      </div>
    );
  }
  if (error) return <Notice kind="error" title={t.error.title}>{t.error.text}</Notice>;
  if (!data) {
    return (
      <EmptyState
        icon={<History className="h-6 w-6" />}
        title={t.detail.notFoundTitle}
        description={t.detail.notFoundText}
        action={<ButtonLink href="/app/history">{t.detail.back}</ButtonLink>}
      />
    );
  }
  return <Entry entry={data} />;
}

function Entry({ entry }: { entry: HistoryEntry }) {
  const router = useRouter();
  const session = useScanSession();
  const t = useMessages("history");
  const locale = useLocale();
  const [blobs] = useState(() => entry.photos.map((p) => p.blob));
  const urls = useObjectUrls(blobs);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function reanalyze() {
    session.loadFromHistory(entry);
    router.push("/app/scan");
  }

  async function save() {
    setSaving(true);
    setSaveError(false);
    try {
      const saved = await saveDiscovery({
        image: entry.photos[0].blob,
        photos: entry.photos.map((p) => p.blob),
        thumbnail: entry.thumbnail,
        analysis: entry.analysis,
        meta: entry.meta,
        context: entry.context,
      });
      await markHistorySaved(entry.id, saved.id);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    await removeFromHistory(entry.id);
    router.replace("/app/history");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/app/history" className="inline-flex items-center gap-2 text-sm text-granite-400 transition-colors hover:text-chalk-50">
          <ArrowLeft className="h-4 w-4" /> {t.detail.back}
        </Link>
        <p className="font-mono text-xs text-granite-500">{t.detail.analyzed(formatDateTime(entry.createdAt, locale))}</p>
      </div>

      <ResultsView
        analysis={entry.analysis}
        meta={entry.meta}
        imageSrc={urls[0] ?? null}
        photoUrls={urls}
        context={entry.context}
        onImprove={reanalyze}
        actions={
          <>
            {entry.savedDiscoveryId ? (
              <ButtonLink href={`/app/collection/${entry.savedDiscoveryId}`} variant="outline" icon={<BookmarkCheck className="h-4 w-4" />}>
                {t.actions.saved}
              </ButtonLink>
            ) : (
              <Button variant="secondary" onClick={save} loading={saving} icon={<BookmarkPlus className="h-4 w-4" />}>
                {t.actions.save}
              </Button>
            )}
            <Button variant="ghost" onClick={reanalyze} icon={<RefreshCw className="h-4 w-4" />}>
              {t.actions.reanalyze}
            </Button>
          </>
        }
        footer={
          <div className="space-y-3">
            {saveError && <Notice kind="error" title={t.actions.saveError} />}
            {confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-granite-200">{t.actions.removeConfirm}</span>
                <Button size="sm" variant="danger" onClick={remove}>
                  {t.actions.confirm}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  {t.actions.cancel}
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>
                {t.actions.remove}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
