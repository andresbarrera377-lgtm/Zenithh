import { notFound } from "next/navigation";

/** Any path that matches no page renders app/[lang]/not-found.tsx in the visitor's language. */
export default function UnknownPage() {
  notFound();
}
