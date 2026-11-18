import type { Metadata } from "next";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { AnalysisScreen } from "@/components/scan/AnalysisScreen";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await getLocale()).app.meta.analysis };
}

export default function AnalysisPage() {
  return <AnalysisScreen />;
}
