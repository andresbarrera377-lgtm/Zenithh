"use client";

import { BookmarkCheck, BookmarkPlus, History, ScanLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/primitives";
import { saveDiscovery } from "@/lib/collection/store";
import { markHistorySaved } from "@/lib/history/store";
import { useScanSession } from "@/lib/scan/session";
import { ResultsView } from "./ResultsView";
import { useMessages } from "@/lib/i18n/client";

export function SessionResults() {
  const router = useRouter();
  const session = useScanSession();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const t = useMessages("report").session;
  const h = useMessages("history").session;

  if (!session.result || !session.image) {
    return (
      <EmptyState
        icon={<ScanLine className="h-6 w-6" />}
        title={t.emptyTitle}
        description={t.emptyText}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/app/scan">{t.scan}</ButtonLink>
            <ButtonLink href="/app/collection" variant="secondary">
              {t.collection}
            </ButtonLink>
          </div>
        }
      />
    );
  }

  const { analysis, meta } = session.result;

  async function save() {
    if (!session.image || !session.result) return;
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await saveDiscovery({
        image: session.image.blob,
        photos: session.photos.map((p) => p.image.blob),
        thumbnail: session.image.thumbnail,
        analysis: session.result.analysis,
        meta: session.result.meta,
        context: session.context,
      });
      session.markSaved(saved.id);
      if (session.historyId) markHistorySaved(session.historyId, saved.id).catch(() => undefined);
    } catch {
      setSaveError(t.saveError);
    } finally {
      setSaving(false);
    }
  }

  function analyzeAnother() {
    session.reset();
    router.push("/app/scan");
  }

  return (
    <ResultsView
      analysis={analysis}
      meta={meta}
      imageSrc={session.imageUrl}
      photoUrls={session.photos.map((p) => p.url)}
      context={session.context}
      onImprove={() => router.push("/app/scan")}
      actions={
        <>
          {session.savedId ? (
            <ButtonLink href={`/app/collection/${session.savedId}`} variant="outline" icon={<BookmarkCheck className="h-4 w-4" />}>
              {t.saved}
            </ButtonLink>
          ) : (
            <Button variant="secondary" onClick={save} loading={saving} icon={<BookmarkPlus className="h-4 w-4" />}>
              {t.save}
            </Button>
          )}
          <Button variant="ghost" onClick={analyzeAnother} icon={<ScanLine className="h-4 w-4" />}>
            {t.another}
          </Button>
        </>
      }
      footer={
        <>
          {saveError && <Notice kind="error" title={t.couldNotSave}>{saveError}</Notice>}
          {session.historyId && (
            <p className="flex items-center gap-1.5 text-xs text-granite-400">
              <History className="h-3.5 w-3.5" /> {h.saved}{" "}
              <Link href={`/app/history/${session.historyId}`} className="text-mineral-300 hover:underline">
                {h.view}
              </Link>
            </p>
          )}
          {session.savedId && (
            <p className="text-xs text-granite-400">
              {t.savedNoteBefore}
              <Link href={`/app/collection/${session.savedId}`} className="text-mineral-300 hover:underline">
                {t.savedNoteLink}
              </Link>
              .
            </p>
          )}
        </>
      }
    />
  );
}
