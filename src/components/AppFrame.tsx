"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";

/**
 * De app zelf is ontworpen als mobiele swipe-app en wordt daarom altijd
 * in een "telefoonframe" (max-w-md, rand, schaduw) getoond, ook op desktop.
 * De marketingpagina (/landing) is een volwaardige desktop-website en
 * moet dat frame — en de app-header/onderbalk — niet erven.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = pathname === "/landing";

  if (isMarketing) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto relative border-x border-border/50 shadow-2xl min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-safe-bottom pt-safe-top">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
