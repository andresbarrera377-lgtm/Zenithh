"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMessages } from "@/lib/i18n/client";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Shows a real "Install app" button when the browser offers PWA installation
 * (Chromium on Android, Windows, macOS, ChromeOS). Renders `fallback` otherwise —
 * e.g. on iOS Safari, where installation is done from the Share menu.
 */
export function InstallButton({
  fallback = null,
  className,
  size = "lg",
}: {
  fallback?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const t = useMessages("pwa");

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) {
    return <p className="text-sm text-mineral-300">{t.installed}</p>;
  }
  if (!promptEvent) return <>{fallback}</>;

  return (
    <Button
      size={size}
      className={className}
      icon={<Download className="h-4 w-4" />}
      onClick={async () => {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") setInstalled(true);
        setPromptEvent(null);
      }}
    >
      {t.install}
    </Button>
  );
}
