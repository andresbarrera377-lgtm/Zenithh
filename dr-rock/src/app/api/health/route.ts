import { connection } from "next/server";
import { getAiConfig } from "@/lib/ai/config";

/**
 * Reports whether the AI engine is configured on this server.
 * "configured" means an API key is present — it does not guarantee the provider is reachable.
 * The key itself is never exposed.
 */
export async function GET(): Promise<Response> {
  await connection(); // evaluate at request time so deployments pick up env changes
  const config = getAiConfig();
  return Response.json(
    {
      status: "ok",
      ai: {
        configured: config.apiKeyConfigured,
        model: config.apiKeyConfigured ? config.model : null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
