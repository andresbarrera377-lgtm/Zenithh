import { Globe, Laptop, Monitor, Smartphone, TabletSmartphone } from "lucide-react";
import { InstallButton } from "@/components/pwa/InstallButton";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Panel } from "@/components/ui/primitives";

const PLATFORMS = [
  {
    name: "Android",
    icon: Smartphone,
    install: "Open Dr.Rock in Chrome, tap the ⋮ menu and choose “Install app”.",
  },
  {
    name: "iPhone & iPad",
    icon: TabletSmartphone,
    install: "Open Dr.Rock in Safari, tap Share and choose “Add to Home Screen”.",
  },
  {
    name: "Windows",
    icon: Monitor,
    install: "In Chrome or Edge, click the install icon in the address bar.",
  },
  {
    name: "macOS",
    icon: Laptop,
    install: "In Chrome or Edge use the install icon; in Safari choose File › Add to Dock.",
  },
];

/**
 * Honest download options: the web app is live and installable as a PWA today.
 * Native store builds are announced as "coming soon" — no links to files that don't exist.
 */
export function DownloadSection() {
  return (
    <div className="space-y-8">
      <Panel className="relative overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mineral-500/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="space-y-4">
            <Badge tone="mineral" icon={<Globe className="h-3.5 w-3.5" />}>
              Available now
            </Badge>
            <h3 className="font-display text-3xl font-semibold tracking-tight text-chalk-50">Dr.Rock web app</h3>
            <p className="max-w-lg leading-relaxed text-granite-300">
              Runs in any modern browser on phones, tablets and computers — no store needed. Install it to your home screen or
              desktop and it opens like a native app, with your library and collection available offline.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/app" size="lg">
                Open the web app
              </ButtonLink>
              <InstallButton />
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PLATFORMS.map(({ name, icon: Icon, install }) => (
              <li key={name} className="rounded-2xl bg-carbon-900/70 p-4 ring-1 ring-granite-700/70">
                <p className="mb-1.5 flex items-center gap-2 font-medium text-chalk-50">
                  <Icon className="h-4 w-4 text-mineral-400" /> {name}
                </p>
                <p className="text-xs leading-relaxed text-granite-400">{install}</p>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <div className="space-y-4">
        <p className="label-mono text-center text-granite-500">Native apps</p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PLATFORMS.map(({ name, icon: Icon }) => (
            <li
              key={name}
              aria-label={`${name} app — coming soon`}
              className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-granite-600/60 px-4 py-6 text-center"
            >
              <Icon className="h-7 w-7 text-granite-400" />
              <span className="font-display font-semibold text-granite-200">{name === "iPhone & iPad" ? "iOS" : name}</span>
              <Badge tone="granite">Coming soon</Badge>
            </li>
          ))}
        </ul>
        <p className="text-center text-xs text-granite-500">
          Native store versions are planned. Until then, the installable web app offers the full experience on every platform.
        </p>
      </div>
    </div>
  );
}
