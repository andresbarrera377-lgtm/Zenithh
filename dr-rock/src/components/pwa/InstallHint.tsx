"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { IosInstallGuide } from "@/components/pwa/IosInstallGuide";
import { buttonClasses } from "@/components/ui/Button";
import { useMessages } from "@/lib/i18n/client";
import { currentInstallPlatform, type InstallPlatform } from "@/lib/pwa/platform";
import { siteConfig } from "@/lib/site";

const DISMISS_KEY = "dr-rock:install-hint-dismissed";

/**
 * Small card for people using Dr.Rock in a phone browser: on iPhone it opens the Add to Home
 * Screen guide, on Android it offers the APK. Hidden once installed, on computers, and after
 * the user dismisses it.
 */
export function InstallHint() {
  const [platform, setPlatform] = useState<InstallPlatform | null>(null);
  const t = useMessages("pwa").hint;

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // Storage unavailable (private mode): just show the hint.
    }
    const detected = currentInstallPlatform();
    // Deferred so the first client render matches the server render (no hint), avoiding a hydration mismatch.
    queueMicrotask(() => setPlatform(dismissed ? null : detected));
  }, []);

  if (platform !== "ios" && platform !== "android") return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setPlatform(null);
  };

  return (
    <div className="panel relative flex flex-col gap-3 p-4 pr-12 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-granite-500 hover:bg-granite-800 hover:text-chalk-50"
        aria-label={t.hide}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="space-y-0.5">
        <p className="font-display font-semibold text-chalk-50">
          {platform === "ios" ? t.iosTitle : t.androidTitle}
        </p>
        <p className="text-sm text-granite-400">
          {platform === "ios" ? t.iosText : t.androidText(siteConfig.androidApk.size)}
        </p>
      </div>
      {platform === "ios" ? (
        <IosInstallGuide size="md" variant="primary" label={t.iosAction} className="shrink-0" />
      ) : (
        <a href={siteConfig.androidApk.href} download="Dr.Rock.apk" className={buttonClasses({ size: "md", className: "shrink-0" })}>
          <Download className="h-4 w-4" /> {t.downloadApk}
        </a>
      )}
    </div>
  );
}
