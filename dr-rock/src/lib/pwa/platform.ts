/**
 * Which install path fits the current browser. Pure, so it can be unit-tested.
 * - "installed": already running as an installed app (home-screen app or the Android APK).
 * - "ios": iPhone/iPad browser — install with Share › Add to Home Screen.
 * - "android": Android browser — the APK can be downloaded.
 * - "other": computers and everything else.
 */
export type InstallPlatform = "installed" | "ios" | "android" | "other";

export function detectInstallPlatform(userAgent: string, opts: { standalone: boolean; maxTouchPoints: number }): InstallPlatform {
  if (opts.standalone || /DrRockAndroid\//.test(userAgent)) return "installed";
  // iPadOS reports itself as a Mac; touch support tells them apart.
  const isIos = /iPhone|iPad|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && opts.maxTouchPoints > 1);
  if (isIos) return "ios";
  if (/Android/.test(userAgent)) return "android";
  return "other";
}

/** Reads the current browser (client only). */
export function currentInstallPlatform(): InstallPlatform {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return detectInstallPlatform(navigator.userAgent, { standalone, maxTouchPoints: navigator.maxTouchPoints ?? 0 });
}
