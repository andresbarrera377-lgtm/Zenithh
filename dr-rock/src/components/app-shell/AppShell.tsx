"use client";

import { BookOpenText, Gem, History, House, Info, ScanLine, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useMessages } from "@/lib/i18n/client";
import type { Messages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import { AiStatusIndicator } from "./AiStatus";

type NavKey = keyof Messages["common"]["nav"];

interface NavItem {
  href: string;
  key: NavKey;
  icon: LucideIcon;
  /** Extra path prefixes that should highlight this item. */
  match?: string[];
  /** Hidden from the 5-slot mobile tab bar (still in the sidebar and linked from Home). */
  sidebarOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: "/app", key: "home", icon: House },
  { href: "/app/scan", key: "scan", icon: ScanLine, match: ["/app/analysis", "/app/results"] },
  { href: "/app/library", key: "library", icon: BookOpenText },
  { href: "/app/history", key: "history", icon: History },
  { href: "/app/collection", key: "collection", icon: Gem },
  { href: "/app/about", key: "about", icon: Info, sidebarOnly: true },
];

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/app") return pathname === "/app";
  return [item.href, ...(item.match ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function AppShell({ children }: { children: ReactNode }) {
  const t = useMessages("common");
  return (
    <div className="relative min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r hairline bg-carbon-900/80 backdrop-blur-xl lg:flex">
        <div className="flex h-20 items-center px-6">
          <Link href="/app" aria-label={t.home}>
            <Logo />
          </Link>
        </div>
        <Suspense fallback={<SidebarNav pathname="" />}>
          <ActiveSidebarNav />
        </Suspense>
        <div className="space-y-4 border-t hairline p-5">
          <AiStatusIndicator />
          <LanguageSwitch />
          <Link href="/" className="block text-xs text-granite-400 transition-colors hover:text-chalk-50">
            {t.backToWebsite}
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="safe-top sticky top-0 z-40 border-b hairline bg-carbon-950/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/app" aria-label={t.home}>
            <Logo markClassName="h-7 w-7" wordmarkClassName="text-lg" />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <AiStatusIndicator compact />
          </div>
        </div>
      </header>

      <main className="relative pb-[calc(7rem+var(--host-badge-h))] lg:pb-12 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label={t.mainNav}
        className="safe-bottom-tabbar fixed inset-x-0 bottom-0 z-40 border-t hairline bg-carbon-950/90 backdrop-blur-xl lg:hidden"
      >
        <Suspense fallback={<TabBarNav pathname="" />}>
          <ActiveTabBarNav />
        </Suspense>
      </nav>
    </div>
  );
}

function ActiveSidebarNav() {
  return <SidebarNav pathname={usePathname()} />;
}

function ActiveTabBarNav() {
  return <TabBarNav pathname={usePathname()} />;
}

function SidebarNav({ pathname }: { pathname: string }) {
  const t = useMessages("common");
  return (
    <nav aria-label={t.mainNav} className="flex-1 space-y-1 px-3 py-2">
      {NAV.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-mineral-500/10 text-mineral-300 ring-1 ring-inset ring-mineral-500/25"
                : "text-granite-300 hover:bg-granite-800/70 hover:text-chalk-50",
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-mineral-400" : "text-granite-400 group-hover:text-chalk-50")} />
            {t.nav[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}

function TabBarNav({ pathname }: { pathname: string }) {
  const t = useMessages("common");
  return (
    <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
      {NAV.filter((item) => !item.sidebarOnly).map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        const isScan = item.href === "/app/scan";
        return (
          <li key={item.href} className="flex justify-center">
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={t.nav[item.key]}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors",
                active ? "text-mineral-300" : "text-granite-400 hover:text-chalk-50",
              )}
            >
              {isScan ? (
                <span className="-mt-7 grid h-14 w-14 place-items-center rounded-2xl bg-mineral-400 text-carbon-950 shadow-[0_8px_30px_-6px_rgba(34,201,138,0.8)] ring-4 ring-carbon-950">
                  <ScanLine className="h-6 w-6" />
                </span>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              <span>{t.navShort[item.key]}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
