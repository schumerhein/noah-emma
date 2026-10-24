"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SIGNUP_URL, LOGIN_URL } from "@/components/marketing/links";

/**
 * Vaste aanmeldbalk onderin het scherm, alleen op mobiel. Verschijnt pas
 * zodra de bezoeker voorbij de knoppen in de header is gescrold.
 */
export function StickyCta({ afterId = "hero-cta" }: { afterId?: string }) {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const anker = document.getElementById(afterId);
    if (!anker) return;
    const check = () => setZichtbaar(anker.getBoundingClientRect().bottom < 0);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [afterId]);

  return (
    <div
      aria-hidden={!zichtbaar}
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 flex gap-2.5 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] bg-[#FFF9FA]/95 backdrop-blur-md border-t border-[#241A2E]/10 transition-all duration-300 ${
        zichtbaar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href={SIGNUP_URL}
        tabIndex={zichtbaar ? 0 : -1}
        className="flex-[2] flex items-center justify-center min-h-[48px] rounded-full bg-[#241A2E] text-white font-bold text-[15px]"
      >
        Maak gratis een account
      </Link>
      <Link
        href={LOGIN_URL}
        tabIndex={zichtbaar ? 0 : -1}
        className="flex-1 flex items-center justify-center min-h-[48px] rounded-full border border-[#241A2E]/20 bg-white text-[#241A2E] font-bold text-[15px]"
      >
        Inloggen
      </Link>
    </div>
  );
}
