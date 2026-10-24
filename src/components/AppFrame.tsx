"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { useInboxMeldingen } from "@/hooks/use-inbox-meldingen";
import { FeedbackProvider } from "@/components/FeedbackProvider";
import { MARKETING_PATHS } from "@/components/marketing/links";
import { MarketingModusContext } from "@/components/marketing/MarketingModus";

/**
 * De app zelf is ontworpen als mobiele swipe-app en wordt daarom altijd
 * in een "telefoonframe" (max-w-md, rand, schaduw) getoond, ook op desktop.
 * De marketingpagina's (zie MARKETING_PATHS) zijn volwaardige websites en
 * moeten dat frame — en de app-header/onderbalk — niet erven.
 */

export function AppFrame({ children, forceMarketing = false }: { children: React.ReactNode; forceMarketing?: boolean }) {
  const pathname = usePathname();
  // forceMarketing (de herschreven "/") geldt alleen voor de eerste render;
  // daarna houdt de landingspagina dit zelf bij via MarketingPaginaMarker.
  const [marketingPagina, setMarketingPagina] = useState(forceMarketing);
  const isMarketing = marketingPagina || MARKETING_PATHS.includes(pathname);
  // Altijd aanroepen (Rules of Hooks) — AppFrame blijft over navigaties heen
  // gemonteerd, ook wanneer isMarketing wisselt.
  const { ongelezen } = useInboxMeldingen();

  // De provider staat om beide takken heen, zodat elke knop in de app (ook op
  // de marketingpagina) het feedbackvenster kan openen; het zwevende tabje
  // zelf is alleen in de app zichtbaar.
  return (
    <MarketingModusContext.Provider value={setMarketingPagina}>
      <FeedbackProvider tabTonen={!isMarketing}>
        {isMarketing ? (
          children
        ) : (
          <div className="app-frame max-w-md mx-auto relative bg-background border-x border-border/60 shadow-2xl min-h-screen flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto pb-safe-bottom pt-safe-top">
              {children}
            </main>
            <Navigation ongelezen={ongelezen} />
          </div>
        )}
      </FeedbackProvider>
    </MarketingModusContext.Provider>
  );
}
