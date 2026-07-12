
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Ontdekken", icon: "explore" },
  { href: "/search", label: "Zoeken", icon: "search", special: false },
  { href: "/sell", label: "Uploaden", icon: "add", special: true },
  { href: "/messages", label: "Berichten", icon: "chat_bubble" },
  { href: "/profile", label: "Profiel", icon: "person" },
];

export function Navigation() {
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
    pathname === "/landing"
  ) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[calc(5rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-md border-t border-border z-50 flex items-start justify-around px-2 pt-2 pb-safe-bottom">
      {navItems.map(({ href, label, icon, special }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        
        if (special) {
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 -mt-6"
            >
              <div className="w-14 h-14 bg-primary dark:bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-90 border-4 border-background">
                <span className="material-icons-round text-3xl">{icon}</span>
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest mt-1",
                isActive ? "text-primary" : "text-muted-foreground"
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
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-12 transition-all duration-300 relative",
              isActive ? "text-accent" : "text-muted-foreground hover:text-accent"
            )}
          >
            <div className="relative">
              <span className={cn(
                "material-symbols-outlined text-[24px] transition-transform",
                isActive ? "scale-110 font-bold" : "scale-100"
              )}>
                {icon}
              </span>
            </div>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {label}
            </span>
            {label === "Berichten" && (
              <div className="absolute top-1 right-1/4 w-2 h-2 bg-primary border border-background rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
