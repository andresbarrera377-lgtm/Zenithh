import type { Metadata } from "next";
import { ScanPanel } from "@/components/scan/ScanPanel";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Scan rock",
  description: "Take or upload a photo of a rock for AI-powered identification.",
};

export default function ScanPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 1 · Capture"
        title="Scan a rock"
        description="Photograph a rock, mineral or possible fossil — or upload an existing photo. Dr.Rock will examine its visible features and build a scientific report."
      />
      <ScanPanel />
    </div>
  );
}
