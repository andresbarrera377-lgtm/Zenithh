"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Preview" },
  { href: "#download", label: "Download" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <Link href="/" aria-label="Dr.Rock home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-granite-300 transition-colors hover:text-chalk-50">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/app" size="sm" className="hidden sm:inline-flex">
            Open app
          </ButtonLink>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-chalk-50 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Primary" className="border-t hairline px-4 pb-6 pt-2 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-granite-200 hover:bg-granite-800">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="/app" className="mt-4 w-full">
            Open the web app
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
