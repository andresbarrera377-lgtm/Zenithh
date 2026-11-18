"use client";

import { Gem, HardDrive, ScanLine, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, Notice } from "@/components/ui/primitives";
import { useDiscoveries } from "@/lib/collection/store";
import type { Discovery } from "@/lib/collection/types";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { DiscoveryCard } from "./DiscoveryCard";

const FILTERS = [
  { id: "all" },
  { id: "favorites" },
  { id: "fossils" },
  { id: "igneous" },
  { id: "sedimentary" },
  { id: "metamorphic" },
  { id: "mineral" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

const SORTS = [
  { id: "newest" },
  { id: "oldest" },
  { id: "name" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

function matchesFilter(d: Discovery, f: FilterId): boolean {
  switch (f) {
    case "all":
      return true;
    case "favorites":
      return d.favorite;
    case "fossils":
      return d.analysis.verdict === "probable_fossil" || d.analysis.verdict === "inconclusive_fossil_like";
    default:
      return d.analysis.identification.classification === f;
  }
}

export function CollectionBrowser() {
  const t = useMessages("collection");
  const { data, loading, error } = useDiscoveries();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [sort, setSort] = useState<SortId>("newest");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((d) => d.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [data]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = data.filter((d) => {
      if (!matchesFilter(d, filter)) return false;
      if (tag && !d.tags.includes(tag)) return false;
      if (!q) return true;
      const haystack = [d.title, d.notes, d.analysis.identification.rockName, d.analysis.identification.rockType, ...d.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return filtered.sort((a, b) => {
      if (sort === "name") return a.title.localeCompare(b.title);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [data, query, filter, sort, tag]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="shimmer aspect-[4/5] rounded-[1.25rem]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Notice kind="error" title={t.openError}>
        {t.openErrorText}
      </Notice>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Gem className="h-6 w-6" />}
        title={t.emptyTitle}
        description={t.emptyText}
        action={
          <ButtonLink href="/app/scan" icon={<ScanLine className="h-4 w-4" />}>
            {t.scanFirst}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">{t.search}</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-granite-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-11 w-full rounded-xl border-0 bg-granite-900 pl-11 pr-4 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:outline-none focus:ring-2 focus:ring-mineral-400"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-granite-400">
          {t.sort}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="h-11 rounded-xl border-0 bg-granite-900 px-3 text-sm text-chalk-50 ring-1 ring-inset ring-granite-600/70 focus:outline-none focus:ring-2 focus:ring-mineral-400"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {t.sorts[s.id]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {t.filters[f.id]}
            </Chip>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono text-granite-500">{t.tags}</span>
          {allTags.map((tg) => (
            <Chip key={tg} small active={tag === tg} onClick={() => setTag(tag === tg ? null : tg)}>
              #{tg}
            </Chip>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title={t.noMatchTitle} description={t.noMatchText} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <DiscoveryCard key={d.id} discovery={d} />
          ))}
        </div>
      )}

      <p className="flex items-center gap-2 text-xs text-granite-500">
        <HardDrive className="h-3.5 w-3.5" />
        {t.storedNote(data.length)}
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "whitespace-nowrap rounded-full font-medium ring-1 ring-inset transition-colors",
        small ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        active
          ? "bg-mineral-400 text-carbon-950 ring-mineral-300"
          : "bg-granite-900 text-granite-200 ring-granite-600/70 hover:bg-granite-800 hover:text-chalk-50",
      )}
    >
      {children}
    </button>
  );
}
