"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NoahFace, EmmaFace } from "@/components/ai-models/NoahEmmaFaces";
import { HOOFDMENU, LOGIN_URL, SIGNUP_URL, type MenuItem } from "@/components/marketing/links";

export function MarketingHeader({ menu = HOOFDMENU }: { menu?: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#FFF9FA]/95 backdrop-blur-md border-b border-[#241A2E]/[0.08]">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
        <Link href="/" aria-label="Noah & Emma, naar de homepage" className="flex items-center gap-2.5 shrink-0">
          <span className="flex">
            <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md"><NoahFace size={40} /></span>
            <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md -ml-2.5"><EmmaFace size={40} /></span>
          </span>
          <span className="font-headline font-extrabold text-[17px] sm:text-[19px] tracking-tight text-[#241A2E] whitespace-nowrap">
            <span className="text-[#1C7FA8]">Noah</span> &amp; <span className="text-[#D63D74]">Emma</span>
          </span>
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden lg:flex items-center gap-1">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="px-3.5 py-2.5 rounded-full text-[15px] font-semibold text-[#241A2E] hover:bg-[#241A2E]/5 transition-colors aria-[current=page]:bg-[#FFEAF1] aria-[current=page]:text-[#D63D74] aria-[current=page]:font-bold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={LOGIN_URL} className="hidden sm:inline-flex px-3.5 py-2.5 text-[15px] font-bold text-[#241A2E]">
            Inloggen
          </Link>
          <Link
            href={SIGNUP_URL}
            className="inline-flex items-center min-h-[44px] bg-[#241A2E] text-white text-sm font-bold px-4 sm:px-5 rounded-full shadow-[0_12px_30px_-14px_rgba(36,26,46,0.5)] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Gratis aanmelden</span>
            <span className="sm:hidden">Aanmelden</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobiel-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            className="lg:hidden w-11 h-11 rounded-full border border-[#241A2E]/15 bg-white flex items-center justify-center"
          >
            {open ? <X className="w-5 h-5 text-[#241A2E]" /> : <Menu className="w-5 h-5 text-[#241A2E]" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobiel-menu" aria-label="Hoofdmenu" className="lg:hidden border-t border-[#241A2E]/[0.08] bg-[#FFF9FA] px-4 pb-4">
          {menu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className="aria-[current=page]:text-[#D63D74] flex items-center min-h-[52px] border-b border-[#241A2E]/[0.06] text-base font-semibold text-[#241A2E]"
            >
              {item.label}
            </Link>
          ))}
          <Link href={LOGIN_URL} onClick={() => setOpen(false)} className="flex items-center min-h-[52px] text-base font-bold text-[#241A2E]">
            Inloggen
          </Link>
        </nav>
      )}
    </header>
  );
}
