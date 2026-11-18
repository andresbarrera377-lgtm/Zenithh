"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { fetchAiStatus } from "@/lib/analysis/client";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type Status = "checking" | "ready" | "not-configured" | "unreachable";

let statusPromise: Promise<Status> | null = null;

function loadStatus(): Promise<Status> {
  statusPromise ??= fetchAiStatus().then((s) => {
    if (!s) {
      statusPromise = null; // allow a retry later
      return "unreachable" as const;
    }
    return s.configured ? "ready" : "not-configured";
  });
  return statusPromise;
}

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
}

export function useAiStatus(): Status | "offline" {
  const online = useOnline();
  const [status, setStatus] = useState<Status>("checking");
  useEffect(() => {
    if (!online) return;
    let cancelled = false;
    loadStatus().then((s) => !cancelled && setStatus(s));
    return () => {
      cancelled = true;
    };
  }, [online]);
  return online ? status : "offline";
}

const META = {
  checking: { key: "checking", dot: "bg-granite-400", text: "text-granite-300" },
  ready: { key: "ready", dot: "bg-mineral-400", text: "text-mineral-300" },
  "not-configured": { key: "notConfigured", dot: "bg-jasper-400", text: "text-jasper-300" },
  unreachable: { key: "unreachable", dot: "bg-ochre-400", text: "text-ochre-300" },
  offline: { key: "offline", dot: "bg-ochre-400", text: "text-ochre-300" },
} as const;

export function AiStatusIndicator({ className, compact = false }: { className?: string; compact?: boolean }) {
  const status = useAiStatus();
  const meta = META[status];
  const label = useMessages("common").ai[meta.key];
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]", meta.text, className)}
      title={label}
    >
      <span className="relative flex h-2 w-2">
        {status === "ready" && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", meta.dot)} />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", meta.dot)} />
      </span>
      <span className={compact ? "sr-only" : undefined}>{label}</span>
    </span>
  );
}
