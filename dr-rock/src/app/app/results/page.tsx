import type { Metadata } from "next";
import { SessionResults } from "@/components/results/SessionResults";

export const metadata: Metadata = { title: "Results" };

export default function ResultsPage() {
  return <SessionResults />;
}
