"use client";

import { BookmarkCheck, BookmarkPlus, ScanLine } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/primitives";
import { saveDiscovery } from "@/lib/collection/store";
import { useScanSession } from "@/lib/scan/session";
import { ResultsView } from "./ResultsView";

export function SessionResults() {
  const router = useRouter();
  const session = useScanSession();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!session.result || !session.image) {
    return (
      <EmptyState
        icon={<ScanLine className="h-6 w-6" />}
        title="No results yet"
        description="Analyze a rock to see its scientific report here. Saved analyses live in My Collection."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/app/scan">Scan a rock</ButtonLink>
            <ButtonLink href="/app/collection" variant="secondary">
              My Collection
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
        thumbnail: session.image.thumbnail,
        analysis: session.result.analysis,
        meta: session.result.meta,
        context: session.context,
      });
      session.markSaved(saved.id);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "The analysis could not be saved on this device.");
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
      context={session.context}
      actions={
        <>
          {session.savedId ? (
            <ButtonLink href={`/app/collection/${session.savedId}`} variant="outline" icon={<BookmarkCheck className="h-4 w-4" />}>
              Saved · open in collection
            </ButtonLink>
          ) : (
            <Button variant="secondary" onClick={save} loading={saving} icon={<BookmarkPlus className="h-4 w-4" />}>
              Save analysis
            </Button>
          )}
          <Button variant="ghost" onClick={analyzeAnother} icon={<ScanLine className="h-4 w-4" />}>
            Analyze another rock
          </Button>
        </>
      }
      footer={
        <>
          {saveError && <Notice kind="error" title="Could not save">{saveError}</Notice>}
          {session.savedId && (
            <p className="text-xs text-granite-400">
              Saved on this device. Add notes and tags in{" "}
              <Link href={`/app/collection/${session.savedId}`} className="text-mineral-300 hover:underline">
                My Collection
              </Link>
              .
            </p>
          )}
        </>
      }
    />
  );
}
