"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/primitives";
import { countByCategory, searchLibrary } from "@/lib/library";
import { CATEGORY_META, LIBRARY_CATEGORIES, type LibraryCategory } from "@/lib/library/types";
import { cn } from "@/lib/utils";
import { LibraryCard } from "./LibraryCard";

type Filter = LibraryCategory | "all";

function isCategory(value: string | null): value is LibraryCategory {
  return !!value && (LIBRARY_CATEGORIES as readonly string[]).includes(value);
}

export function LibraryBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initialCategory = params.get("category");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<Filter>(isCategory(initialCategory) ? initialCategory : "all");
  const deferredQuery = useDeferredValue(query);
  const counts = useMemo(() => countByCategory(), []);
  const results = useMemo(() => searchLibrary(deferredQuery, category), [deferredQuery, category]);

  function syncUrl(nextCategory: Filter, nextQuery: string) {
    const sp = new URLSearchParams();
    if (nextCategory !== "all") sp.set("category", nextCategory);
    if (nextQuery.trim()) sp.set("q", nextQuery.trim());
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function selectCategory(next: Filter) {
    setCategory(next);
    syncUrl(next, query);
    if (next !== "all") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const grouped = category === "all" && !deferredQuery.trim();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">Search the Rock Library</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-granite-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => syncUrl(category, query)}
            placeholder="Search rocks, fossils, minerals, periods…"
            className="h-14 w-full rounded-2xl border-0 bg-granite-900 pl-12 pr-12 text-[15px] text-chalk-50 ring-1 ring-inset ring-granite-600/70 placeholder:text-granite-500 focus:outline-none focus:ring-2 focus:ring-mineral-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                syncUrl(category, "");
              }}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-granite-400 hover:bg-granite-800 hover:text-chalk-50"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by category">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            <FilterChip active={category === "all"} onClick={() => selectCategory("all")} label="All" count={total} />
            {LIBRARY_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => selectCategory(c)}
                label={CATEGORY_META[c].plural}
                count={counts[c]}
              />
            ))}
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="No matches"
          description={`Nothing in the library matches “${deferredQuery}”. Try another word, like “volcanic”, “Jurassic” or “shell”.`}
        />
      ) : grouped ? (
        <div className="space-y-12">
          {LIBRARY_CATEGORIES.map((c) => {
            const items = results.filter((e) => e.category === c);
            return (
              <section key={c} aria-labelledby={`cat-${c}`} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-2 border-b hairline pb-3">
                  <div>
                    <p className="label-mono text-granite-500">{CATEGORY_META[c].group}</p>
                    <h2 id={`cat-${c}`} className="font-display text-2xl font-semibold text-chalk-50">
                      {CATEGORY_META[c].plural}
                    </h2>
                    <p className="mt-1 text-sm text-granite-400">{CATEGORY_META[c].description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectCategory(c)}
                    className="text-sm text-mineral-300 underline-offset-4 hover:underline"
                  >
                    View {items.length}
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((entry) => (
                    <LibraryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-granite-400" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
            {category !== "all" && ` in ${CATEGORY_META[category].plural.toLowerCase()}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((entry) => (
              <LibraryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-medium ring-1 ring-inset transition-colors",
        active
          ? "bg-mineral-400 text-carbon-950 ring-mineral-300"
          : "bg-granite-900 text-granite-200 ring-granite-600/70 hover:bg-granite-800 hover:text-chalk-50",
      )}
    >
      {label}
      <span className={cn("font-mono text-xs", active ? "text-carbon-900/70" : "text-granite-500")}>{count}</span>
    </button>
  );
}

export function LibraryBrowserSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      <div className="shimmer h-14 rounded-2xl" />
      <div className="flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="shimmer h-10 w-28 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="shimmer aspect-[4/5] rounded-[1.25rem]" />
        ))}
      </div>
    </div>
  );
}
