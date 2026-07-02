"use client";

import { SlidersHorizontal } from "lucide-react";
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
    pathname === "/profile/favorites" ||
    pathname === "/profile/edit" ||
    pathname.startsWith("/promote/") ||
    pathname === "/messages" ||
    pathname.startsWith("/messages/") ||
    pathname === "/sell" ||
    pathname === "/premium" ||
    pathname === "/support" ||
    pathname === "/support/faq" ||
    pathname === "/support/ai-chat" ||
    pathname.startsWith("/search/results") ||
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
    pathname === "/donaties" ||
    pathname === "/feed-voorkeuren" ||
    pathname === "/wettelijk" ||
    pathname === "/voorkeuren" ||
    pathname === "/community" ||
    pathname.startsWith("/kind/")
  ) return null;

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-[calc(4rem+env(safe-area-inset-top))] bg-background/80 backdrop-blur-md border-b border-border/50 z-50 flex items-end justify-between px-6 pb-4 pt-safe-top">
      <div className="flex items-center gap-3">
        <NoahEmmaLogo size={36} />
        <div className="flex flex-col">
          <h1 className="font-headline text-xl font-extrabold text-foreground tracking-tight leading-none">
            Noah & Emma
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kindermode</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-secondary dark:bg-muted/20 flex items-center justify-center text-foreground/80 hover:bg-primary/20 transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
