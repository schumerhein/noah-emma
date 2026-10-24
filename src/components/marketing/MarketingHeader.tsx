"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { NoahFace, EmmaFace } from "@/components/ai-models/NoahEmmaFaces";
import { HOOFDMENU, SIGNUP_URL, type MenuItem } from "@/components/marketing/links";

const LINK = "px-3.5 py-2.5 rounded-full text-[15px] font-semibold text-[#241A2E] hover:bg-[#241A2E]/5 transition-colors";
const ACTIEF = "aria-[current=page]:bg-[#FFEAF1] aria-[current=page]:text-[#D63D74] aria-[current=page]:font-bold";

/** Desktop-menuknop met een uitklaplijst (bv. Over ons → Veelgestelde vragen). */
function Uitklapmenu({ item, pathname }: { item: MenuItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const actief = item.sub!.some((s) => s.href === pathname);

  useEffect(() => {
    if (!open) return;
    const sluit = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", sluit);
    document.addEventListener("keydown", sluit);
    return () => {
      document.removeEventListener("mousedown", sluit);
      document.removeEventListener("keydown", sluit);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`${LINK} inline-flex items-center gap-1 ${actief ? "bg-[#FFEAF1] text-[#D63D74] font-bold" : ""}`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <ul className="min-w-[220px] bg-white rounded-2xl p-2 border border-[#241A2E]/[0.08] shadow-[0_20px_40px_-18px_rgba(36,26,46,0.35)]">
            {item.sub!.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === s.href ? "page" : undefined}
                  className="flex items-center min-h-[44px] px-3.5 rounded-xl text-[15px] font-semibold text-[#241A2E] hover:bg-[#241A2E]/5 aria-[current=page]:text-[#D63D74]"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
          {menu.map((item) =>
            item.sub ? (
              <Uitklapmenu key={item.label} item={item} pathname={pathname} />
            ) : (
              <Link key={item.label} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`${LINK} ${ACTIEF}`}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
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
            <div key={item.label}>
              {item.sub ? (
                <>
                  <span className="flex items-center min-h-[52px] text-base font-semibold text-[#241A2E]">{item.label}</span>
                  {item.sub.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === s.href ? "page" : undefined}
                      className="flex items-center min-h-[48px] pl-4 border-l-2 border-[#FFEAF1] text-[15px] font-semibold text-[#5B4F63] aria-[current=page]:text-[#D63D74]"
                    >
                      {s.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center min-h-[52px] border-b border-[#241A2E]/[0.06] text-base font-semibold text-[#241A2E] aria-[current=page]:text-[#D63D74]"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
