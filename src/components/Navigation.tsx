"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, MessageCircle, Plus, Search, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems: { href: string; label: string; icon: LucideIcon; special?: boolean }[] = [
  { href: "/", label: "Ontdekken", icon: Compass },
  { href: "/search", label: "Zoeken", icon: Search },
  { href: "/sell", label: "Verkopen", icon: Plus, special: true },
  { href: "/messages", label: "Berichten", icon: MessageCircle },
  { href: "/profile", label: "Profiel", icon: User },
];

export function Navigation({ ongelezen = 0 }: { ongelezen?: number }) {
  const pathname = usePathname();

  // Hide navigation on login and full-screen edit pages
  if (
    pathname === "/login" ||
    pathname.startsWith("/kind/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/onboarding/") ||
    pathname === "/sell" ||
    pathname === "/premium" ||
    pathname.startsWith("/promote/") ||
    pathname.startsWith("/instellingen") ||
    pathname === "/landing"
  ) return null;

  // Zelfde stijl als het websitemenu: crème balk, het actieve item als
  // roze "pil" en de verkoopknop in het donkere aubergine van de websiteknoppen.
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[calc(5rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-md border-t border-slate-900/[0.08] z-50 flex items-start justify-around px-2 pt-2 pb-safe-bottom">
      {navItems.map(({ href, label, icon: Icoon, special }) => {
        // Met "/" erachter: anders telt /seller/… als /sell en licht "Verkopen" op.
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

        if (special) {
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="flex flex-col items-center gap-1 flex-1 -mt-5"
            >
              <div className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-[0_12px_30px_-12px_rgba(36,26,46,0.6)] flex items-center justify-center transition-transform active:scale-90 border-4 border-background">
                <Icoon className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <span className={cn(
                "text-[10px] font-bold",
                isActive ? "text-primary" : "text-slate-500"
              )}>
                {label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-14 relative group"
          >
            <div className={cn(
              "relative flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-200",
              isActive ? "bg-secondary text-primary" : "text-slate-500 group-active:bg-slate-900/5"
            )}>
              <Icoon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
              {label === "Berichten" && ongelezen > 0 && (
                <span className="absolute top-0.5 right-3 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
              )}
            </div>
            <span className={cn(
              "text-[10px]",
              isActive ? "font-bold text-primary" : "font-semibold text-slate-500"
            )}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
