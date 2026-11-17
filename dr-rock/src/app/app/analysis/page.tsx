import type { Metadata } from "next";
import { AnalysisScreen } from "@/components/scan/AnalysisScreen";

export const metadata: Metadata = { title: "Analyzing" };

export default function AnalysisPage() {
  return <AnalysisScreen />;
}
