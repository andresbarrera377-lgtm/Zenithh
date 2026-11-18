import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, LOCALE_COOKIE, pickLocale } from "@/lib/i18n/config";

/**
 * Serves every page in the visitor's language without changing URLs: /app/scan is rewritten
 * internally to /es/app/scan or /en/app/scan (app/[lang]/...), based on the saved choice
 * or the browser's language. API routes, build assets and public files are not touched.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return NextResponse.next();
  const locale = pickLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next.js internals, Netlify internals and files with an extension.
  matcher: ["/((?!api/|_next/|\\.netlify/|.*\\.[a-zA-Z0-9]+$).*)"],
};
