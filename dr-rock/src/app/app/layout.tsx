import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { ScanSessionProvider } from "@/lib/scan/session";

export const metadata: Metadata = {
  title: { default: "Dr.Rock", template: "%s · Dr.Rock" },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ScanSessionProvider>
      <AppShell>{children}</AppShell>
    </ScanSessionProvider>
  );
}
