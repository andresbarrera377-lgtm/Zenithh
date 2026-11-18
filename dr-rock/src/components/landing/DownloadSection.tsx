import { Download, Globe, Laptop, Smartphone, TabletSmartphone } from "lucide-react";
import type { ReactNode } from "react";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Badge, Panel } from "@/components/ui/primitives";
import { siteConfig } from "@/lib/site";

function PlatformCard({
  icon,
  name,
  children,
  action,
  footnote,
  highlight = false,
}: {
  icon: ReactNode;
  name: string;
  children: ReactNode;
  action: ReactNode;
  footnote: ReactNode;
  highlight?: boolean;
}) {
  return (
    <Panel className={highlight ? "relative overflow-hidden p-6 ring-1 ring-mineral-500/40" : "relative overflow-hidden p-6"}>
      {highlight && (
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mineral-500/20 blur-3xl" aria-hidden />
      )}
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2.5 font-display text-xl font-semibold text-chalk-50">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-carbon-900 text-mineral-400 ring-1 ring-granite-700">{icon}</span>
            {name}
          </p>
          <Badge tone="mineral">Available</Badge>
        </div>
        <p className="text-sm leading-relaxed text-granite-300">{children}</p>
        <div className="mt-auto space-y-3 pt-2">
          {action}
          {/* Equal footnote height keeps the three buttons aligned on wide screens. */}
          <p className="text-xs leading-relaxed text-granite-500 lg:min-h-[3.75rem]">{footnote}</p>
        </div>
      </div>
    </Panel>
  );
}

/**
 * Download options. Every button leads to something real: the Android APK hosted on this site,
 * the browser install prompt (PWA) on computers, and Add to Home Screen on iPhone.
 */
export function DownloadSection() {
  const apk = siteConfig.androidApk;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <PlatformCard
          highlight
          icon={<Smartphone className="h-5 w-5" />}
          name="Android"
          action={
            <a href={apk.href} download="Dr.Rock.apk" className={buttonClasses({ size: "lg", className: "w-full" })}>
              <Download className="h-4 w-4" /> Download APK
            </a>
          }
          footnote={
            <>
              Version {apk.version} · {apk.size} · Android {apk.minAndroid} or later. The first time, Android asks you to allow
              installing apps from your browser or file manager.
            </>
          }
        >
          Download the Dr.Rock app and install it on your phone: home-screen icon, full screen and direct access to the camera.
        </PlatformCard>

        <PlatformCard
          icon={<Laptop className="h-5 w-5" />}
          name="Windows & Mac"
          action={
            <InstallButton
              className="w-full"
              fallback={
                <ButtonLink href="/app" size="lg" variant="secondary" className="w-full" icon={<Globe className="h-4 w-4" />}>
                  Open the web app
                </ButtonLink>
              }
            />
          }
          footnote="In Chrome or Edge, click the install icon in the address bar. In Safari on Mac, choose File › Add to Dock."
        >
          Install Dr.Rock as a desktop app straight from your browser: its own window and an icon in the Start menu or Dock.
        </PlatformCard>

        <PlatformCard
          icon={<TabletSmartphone className="h-5 w-5" />}
          name="iPhone & iPad"
          action={
            <ButtonLink href="/app" size="lg" variant="secondary" className="w-full" icon={<Globe className="h-4 w-4" />}>
              Open in Safari
            </ButtonLink>
          }
          footnote="An App Store version is not available yet."
        >
          Open Dr.Rock in Safari, tap Share and choose “Add to Home Screen”. It then opens full screen, like an app.
        </PlatformCard>
      </div>
      <p className="text-center text-xs text-granite-500">
        Every version uses the same AI analysis, which needs an internet connection. Your collection is saved on each device.
      </p>
    </div>
  );
}
