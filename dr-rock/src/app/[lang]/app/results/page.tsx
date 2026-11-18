import type { Metadata } from "next";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { SessionResults } from "@/components/results/SessionResults";

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await getLocale()).app.meta.results };
}

export default function ResultsPage() {
  return <SessionResults />;
}
