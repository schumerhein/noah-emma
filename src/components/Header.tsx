
"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/search" ||
    pathname.startsWith("/product/") || 
    pathname === "/profile" || 
    pathname === "/profile/favorites" ||
    pathname === "/profile/seller-view" ||
    pathname === "/profile/edit" ||
    pathname.startsWith("/promote/") ||
    pathname === "/messages" ||
    pathname.startsWith("/messages/") ||
    pathname === "/sell" ||
    pathname === "/checkout" ||
    pathname === "/premium" ||
    pathname === "/support" ||
    pathname === "/support/faq" ||
    pathname === "/support/ai-chat" ||
    pathname === "/request-sent" ||
    pathname === "/about" ||
    pathname.startsWith("/sales-request/") ||
    pathname.startsWith("/search/results") ||
    pathname.startsWith("/orders/")
  ) return null;

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-[calc(4rem+env(safe-area-inset-top))] bg-background/80 backdrop-blur-md border-b border-border/50 z-50 flex items-end justify-between px-6 pb-4 pt-safe-top">
      <div className="flex flex-col">
        <h1 className="font-headline text-2xl font-extrabold text-foreground tracking-tight leading-none">
          Noah & Emma
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-secondary dark:bg-muted/20 flex items-center justify-center text-foreground/80 hover:bg-primary/20 transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
