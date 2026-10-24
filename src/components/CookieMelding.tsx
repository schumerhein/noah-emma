"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MARKETING_PATHS } from "@/components/marketing/links";
import { bewaarCookieKeuze, leesCookieKeuze, openCookieMelding, opOpenCookieMelding, type CookieKeuze } from "@/lib/cookieToestemming";

/**
 * Vraagt of we analytische cookies mogen plaatsen. Verschijnt bij het eerste
 * bezoek, na 12 maanden opnieuw, en via de link "Cookie-instellingen".
 */
export function CookieMelding() {
  const [tonen, setTonen] = useState(false);
  // In de app blijf je in de app; op de website (en de homepage, die voor
  // bezoekers de website is) ga je naar de websiteversie.
  const pathname = usePathname();
  const cookieLink = pathname === "/" || MARKETING_PATHS.includes(pathname) ? "/cookies" : "/instellingen/juridisch/cookies";

  useEffect(() => {
    setTonen(leesCookieKeuze() === null);
    return opOpenCookieMelding(() => setTonen(true));
  }, []);

  if (!tonen) return null;

  const kies = (k: CookieKeuze) => {
    bewaarCookieKeuze(k);
    setTonen(false);
  };

  return (
    <div role="region" aria-label="Cookiemelding" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[560px] rounded-3xl bg-white dark:bg-slate-900 border border-[#241A2E]/[0.08] dark:border-slate-700 shadow-[0_20px_50px_-20px_rgba(36,26,46,0.45)] p-5">
        <p className="font-headline font-extrabold text-[17px] text-[#241A2E] dark:text-white">Mogen we meten hoe je de site gebruikt?</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#5B4F63] dark:text-slate-300">
          Met analytische cookies van Google Analytics zien we welke pagina&apos;s goed werken. We gebruiken nooit advertentiecookies.{" "}
          <Link href={cookieLink} className="font-semibold text-[#1C7FA8] underline underline-offset-2">Cookiebeleid</Link>
        </p>
        <div className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button type="button" onClick={() => kies("essentieel")} className="min-h-[44px] px-5 rounded-full border border-[#241A2E]/15 dark:border-slate-600 text-sm font-bold text-[#241A2E] dark:text-white">
            Alleen noodzakelijk
          </button>
          <button type="button" onClick={() => kies("alle")} className="min-h-[44px] px-5 rounded-full bg-[#241A2E] text-white text-sm font-bold">
            Akkoord
          </button>
        </div>
      </div>
    </div>
  );
}

/** Link-knop die de cookiemelding opnieuw opent, zodat je je keuze altijd kunt wijzigen. */
export function CookieInstellingenKnop({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieMelding} className={className}>
      Cookie-instellingen
    </button>
  );
}
