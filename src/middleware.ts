import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// noah-emma.nl toont de marketing-pagina op de homepage; de app zelf
// (swipen, kopen, verkopen) blijft gewoon bereikbaar via alle andere
// paden en via het .vercel.app-adres.
const MARKETING_HOSTS = ["noah-emma.nl", "www.noah-emma.nl"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const isMarketingHost = MARKETING_HOSTS.some((h) => host === h || host.startsWith(`${h}:`));

  if (isMarketingHost && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
