"use client";

import { Gem, History } from "lucide-react";
import Link from "next/link";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/** Segmented switch between My Collection (kept on purpose) and the automatic History. */
export function HistoryTabs({ active }: { active: "collection" | "history" }) {
  const t = useMessages("history").tabs;
  const tabs = [
    { key: "collection" as const, href: "/app/collection", label: t.collection, icon: Gem },
    { key: "history" as const, href: "/app/history", label: t.history, icon: History },
  ];
  return (
    <nav aria-label={t.label} className="inline-flex rounded-full bg-granite-900 p-1 ring-1 ring-granite-700">
      {tabs.map(({ key, href, label, icon: Icon }) => (
        <Link
          key={key}
          href={href}
          aria-current={active === key ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
            active === key ? "bg-mineral-400 text-carbon-950" : "text-granite-300 hover:text-chalk-50",
          )}
        >
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );
}
