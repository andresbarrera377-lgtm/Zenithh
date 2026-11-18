"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { ButtonLink } from "@/components/ui/Button";
import { useMessages } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#about", key: "about" },
  { href: "#how-it-works", key: "how" },
  { href: "#features", key: "features" },
  { href: "#preview", key: "preview" },
  { href: "#download", key: "download" },
] as const;

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useMessages("landing").nav;
  const common = useMessages("common");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "safe-top fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b hairline bg-carbon-950/85 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={common.home}>
          <Logo />
        </Link>
        <nav aria-label={common.mainNav} className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-granite-300 transition-colors hover:text-chalk-50">
              {t[l.key]}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <ButtonLink href="/app" size="sm" className="hidden sm:inline-flex">
            {t.openApp}
          </ButtonLink>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-chalk-50 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label={common.mainNav} className="border-t hairline px-4 pb-6 pt-2 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-granite-200 hover:bg-granite-800">
                  {t[l.key]}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitch className="mt-4" />
          <ButtonLink href="/app" className="mt-4 w-full">
            {t.openWebApp}
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
