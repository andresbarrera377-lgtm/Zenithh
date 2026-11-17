"use client";

import { ArrowLeft, Check, Gem, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ResultsView } from "@/components/results/ResultsView";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice, Panel } from "@/components/ui/primitives";
import { normalizeTags } from "@/lib/collection/indexeddb-repository";
import { deleteDiscovery, updateDiscovery, useDiscovery, useObjectUrl } from "@/lib/collection/store";
import type { Discovery } from "@/lib/collection/types";
import { cn, formatDateTime } from "@/lib/utils";

export function DiscoveryDetail() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : null;
  const { data, loading, error } = useDiscovery(id);
  const imageUrl = useObjectUrl(data?.image);

  if (loading) {
    return (
      <div className="space-y-6" aria-hidden>
        <div className="shimmer h-6 w-40 rounded" />
        <div className="shimmer h-[420px] rounded-[1.25rem]" />
      </div>
    );
  }
  if (error) return <Notice kind="error" title="Could not open this discovery">{error}</Notice>;
  if (!data) {
    return (
      <EmptyState
        icon={<Gem className="h-6 w-6" />}
        title="Discovery not found"
        description="It may have been deleted, or it was saved in a different browser or device."
        action={<ButtonLink href="/app/collection">Back to collection</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-8">
      <Link href="/app/collection" className="inline-flex items-center gap-2 text-sm text-granite-400 transition-colors hover:text-chalk-50">
        <ArrowLeft className="h-4 w-4" /> My Collection
      </Link>
      <JournalEditor discovery={data} />
      <ResultsView analysis={data.analysis} meta={data.meta} imageSrc={imageUrl} context={data.context} />
    </div>
  );
}

function JournalEditor({ discovery }: { discovery: Discovery }) {
  const router = useRouter();
  const [title, setTitle] = useState(discovery.title);
  const [notes, setNotes] = useState(discovery.notes);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  async function persist(patch: Parameters<typeof updateDiscovery>[1]) {
    setStatus("saving");
    try {
      await updateDiscovery(discovery.id, patch);
      setStatus("saved");
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("error");
    }
  }

  function addTags(raw: string) {
    const next = normalizeTags([...discovery.tags, ...raw.split(",")]);
    setTagInput("");
    if (next.length !== discovery.tags.length) persist({ tags: next });
  }

  async function remove() {
    await deleteDiscovery(discovery.id);
    router.replace("/app/collection");
  }

  return (
    <Panel className="space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label-mono text-mineral-400">Field journal</p>
          <p className="text-xs text-granite-500">Saved {formatDateTime(discovery.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("flex items-center gap-1 text-xs transition-opacity", status === "idle" ? "opacity-0" : "opacity-100", status === "error" ? "text-jasper-300" : "text-mineral-300")} aria-live="polite">
            {status === "saving" && "Saving…"}
            {status === "saved" && (
              <>
                <Check className="h-3.5 w-3.5" /> Saved
              </>
            )}
            {status === "error" && "Could not save"}
          </span>
          <button
            type="button"
            onClick={() => persist({ favorite: !discovery.favorite })}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm ring-1 ring-inset transition-colors",
              discovery.favorite ? "bg-ochre-500/10 text-ochre-300 ring-ochre-500/40" : "text-granite-300 ring-granite-600/70 hover:text-chalk-50",
            )}
            aria-pressed={discovery.favorite}
          >
            <Star className="h-4 w-4" fill={discovery.favorite ? "currentColor" : "none"} />
            {discovery.favorite ? "Favourite" : "Add to favourites"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-granite-200">Name</span>
          <input
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              const t = title.trim() || discovery.analysis.identification.rockName;
              setTitle(t);
              if (t !== discovery.title) persist({ title: t });
            }}
            className="h-11 w-full rounded-xl border-0 bg-carbon-900 px-4 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 focus:outline-none focus:ring-2 focus:ring-mineral-400"
          />
        </label>
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-granite-200" id="tags-label">
            Tags
          </span>
          <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl bg-carbon-900 px-2 py-1.5 ring-1 ring-inset ring-granite-600/70 focus-within:ring-2 focus-within:ring-mineral-400">
            {discovery.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full bg-granite-800 px-2.5 py-1 text-xs text-granite-100">
                #{t}
                <button
                  type="button"
                  onClick={() => persist({ tags: discovery.tags.filter((x) => x !== t) })}
                  className="text-granite-400 hover:text-chalk-50"
                  aria-label={`Remove tag ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              aria-labelledby="tags-label"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                  e.preventDefault();
                  addTags(tagInput);
                }
              }}
              onBlur={() => tagInput.trim() && addTags(tagInput)}
              placeholder={discovery.tags.length ? "Add tag" : "e.g. beach, 2026 trip, ammonites"}
              className="min-w-24 flex-1 bg-transparent px-2 text-sm text-chalk-50 placeholder:text-granite-500 focus:outline-none"
            />
          </div>
        </div>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-granite-200">Personal notes</span>
          <textarea
            rows={4}
            maxLength={4000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => notes !== discovery.notes && persist({ notes })}
            placeholder="Where you found it, who you were with, tests you tried…"
            className="w-full resize-y rounded-xl border-0 bg-carbon-900 px-4 py-3 text-sm leading-relaxed text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:outline-none focus:ring-2 focus:ring-mineral-400"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t hairline pt-4">
        {confirmDelete ? (
          <>
            <span className="text-sm text-granite-300">Delete this discovery permanently?</span>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={remove} icon={<Trash2 className="h-4 w-4" />}>
              Delete
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} icon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
        )}
      </div>
    </Panel>
  );
}
