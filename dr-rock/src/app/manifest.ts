import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { MESSAGES } from "@/lib/i18n/messages";
import { siteConfig } from "@/lib/site";

/** One manifest serves both languages, so it uses the default one (Spanish). */
export default function manifest(): MetadataRoute.Manifest {
  const t = MESSAGES[DEFAULT_LOCALE];
  return {
    id: "/app",
    name: `${siteConfig.name} — ${t.common.appTagline}`,
    short_name: siteConfig.name,
    description: t.common.description,
    lang: DEFAULT_LOCALE,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#060807",
    theme_color: "#0b0e0d",
    categories: ["education", "science", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: t.app.home.scan, url: "/app/scan", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: t.library.meta.title, url: "/app/library", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: t.app.home.myCollection, url: "/app/collection", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
