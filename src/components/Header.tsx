"use client";

import { usePathname } from "next/navigation";
import { NoahFace, EmmaFace } from "./ai-models/NoahEmmaFaces";

// Noah & Emma duo-logo: echte geïllustreerde gezichten
export function NoahEmmaLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center">
      {/* Noah */}
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-md"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <NoahFace size={size} />
      </div>
      {/* Emma — iets overlappend */}
      <div
        className="rounded-full overflow-hidden border-2 border-white shadow-md"
        style={{ width: size, height: size, marginLeft: -(size * 0.2), flexShrink: 0 }}
      >
        <EmmaFace size={size} />
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/search" ||
    pathname.startsWith("/product/") ||
    pathname === "/profile" ||
    pathname.startsWith("/promote/") ||
    pathname === "/messages" ||
    pathname.startsWith("/messages/") ||
    pathname === "/sell" ||
    pathname === "/premium" ||
    pathname === "/support" ||
    pathname === "/support/faq" ||
    pathname === "/support/ai-chat" ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/seller/") ||
    pathname.startsWith("/reviews/") ||
    pathname.startsWith("/instellingen") ||
    pathname === "/notificaties" ||
    pathname.startsWith("/notificaties") ||
    pathname === "/privacy" ||
    pathname === "/voorwaarden" ||
    pathname === "/over" ||
    pathname === "/cookies" ||
    pathname === "/faq" ||
    pathname === "/helpdesk" ||
    pathname === "/feed-voorkeuren" ||
    pathname === "/wettelijk" ||
    pathname === "/voorkeuren" ||
    pathname === "/community" ||
    pathname === "/wachtwoord-reset" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/kind/") ||
    pathname === "/landing"
  ) return null;

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-[calc(4rem+env(safe-area-inset-top))] bg-background/90 backdrop-blur-md border-b border-slate-900/[0.08] z-50 flex items-end px-6 pb-3 pt-safe-top">
      <div className="flex items-center gap-2.5">
        <NoahEmmaLogo size={36} />
        <span className="font-headline text-[19px] font-extrabold tracking-tight leading-none">
          <span className="text-blauw-600">Noah</span> <span className="text-slate-900">&amp;</span> <span className="text-roze-600">Emma</span>
        </span>
      </div>
    </header>
  );
}
