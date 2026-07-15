import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// noah-emma.nl toont de marketing-pagina op de homepage; de app zelf
// (swipen, kopen, verkopen) blijft gewoon bereikbaar via alle andere
// paden en via het .vercel.app-adres.
const MARKETING_HOSTS = ["noah-emma.nl", "www.noah-emma.nl"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isMarketingHost = MARKETING_HOSTS.some((h) => host === h || host.startsWith(`${h}:`));
  // De Supabase-sessie zelf staat alleen in localStorage (niet leesbaar door
  // middleware); deze cookie is puur een boolean marker die ThemeProvider
  // bijhoudt zodat ingelogde bezoekers niet steeds op de marketingpagina
  // terugvallen.
  const isIngelogd = request.cookies.get("ne_ingelogd")?.value === "1";

  if (isMarketingHost && request.nextUrl.pathname === "/" && !isIngelogd) {
    // Bij een rewrite blijft de URL in de browser "/", waardoor client-side
    // pathname-checks (usePathname() === "/landing") niet kloppen. Geef daarom
    // een marker-header mee die de server-layout wél kan lezen.
    const headers = new Headers(request.headers);
    headers.set("x-noah-emma-marketing", "1");
    return NextResponse.rewrite(new URL("/landing", request.url), { request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
