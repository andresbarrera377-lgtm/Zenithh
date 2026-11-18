import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "../globals.css";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";
import { IOS_SPLASH_SCREENS, splashFile, splashMedia } from "@/lib/brand/ios-splash";
import { LOCALES } from "@/lib/i18n/config";
import { LocaleProvider } from "@/lib/i18n/client";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { siteConfig } from "@/lib/site";

/** Both languages are prerendered; proxy.ts picks one per visitor without changing URLs. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale).common;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.name} — ${t.slogan}`, template: `%s · ${siteConfig.name}` },
    description: t.description,
    applicationName: siteConfig.name,
    keywords:
      locale === "es"
        ? ["identificar rocas", "fósiles", "geología", "paleontología", "minerales", "IA"]
        : ["rock identification", "fossil", "geology", "paleontology", "mineral", "AI"],
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "black-translucent",
      // Launch screens for the home-screen app on iPhone/iPad (one per screen size).
      startupImage: IOS_SPLASH_SCREENS.map((screen) => ({ url: splashFile(screen), media: splashMedia(screen) })),
    },
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_ES" : "en_GB",
      title: `${siteConfig.name} — ${t.slogan}`,
      description: t.description,
    },
    twitter: { card: "summary_large_image", title: `${siteConfig.name} — ${t.slogan}`, description: t.description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0e0d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full bg-carbon-950 text-chalk-100">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
