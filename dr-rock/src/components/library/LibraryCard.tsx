import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { MESSAGES } from "@/lib/i18n/messages";
import { libraryImage } from "@/lib/library";
import { CATEGORY_META, type LibraryEntry } from "@/lib/library/types";
import { cn } from "@/lib/utils";

/** Works in Server and Client Components: the caller passes the entry already in `lang`. */
export function LibraryCard({ entry, lang, className }: { entry: LibraryEntry; lang: Locale; className?: string }) {
  const t = MESSAGES[lang].library.card;
  return (
    <Link
      href={`/app/library/${entry.id}`}
      className={cn(
        "group panel flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:ring-1 hover:ring-mineral-500/40",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-900">
        {/* Pre-rendered procedural illustration (see scripts/generate-assets.tsx) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={libraryImage(entry, lang)}
          alt={t.illustration(entry.name)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="label-mono absolute left-3 top-3 rounded-full bg-carbon-950/75 px-2.5 py-1 text-[10px] text-mineral-300 backdrop-blur">
          {CATEGORY_META[lang][entry.category].label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-lg font-semibold text-chalk-50 group-hover:text-mineral-200">{entry.name}</h3>
        {entry.aka && <p className="font-mono text-[11px] text-granite-400">{entry.aka}</p>}
        <p className="line-clamp-2 text-sm leading-relaxed text-granite-300">{entry.summary}</p>
      </div>
    </Link>
  );
}
