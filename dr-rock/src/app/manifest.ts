import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: `${siteConfig.name} — AI rock & fossil identification`,
    short_name: siteConfig.name,
    description: siteConfig.description,
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
      { name: "Scan a rock", url: "/app/scan", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Rock Library", url: "/app/library", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "My Collection", url: "/app/collection", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
