"use client";

import { createContext, useContext, useEffect } from "react";

/**
 * Vertelt AppFrame dat de huidige pagina een marketingpagina is.
 *
 * Nodig voor "/": de middleware herschrijft die voor bezoekers zonder account
 * naar /landing, terwijl de URL "/" blijft. Een vlag uit de root-layout volstaat
 * daarvoor niet, want de layout wordt bij client-navigatie niet opnieuw
 * gerenderd: na inloggen bleef de app dan zonder header en menu staan.
 */
export const MarketingModusContext = createContext<(actief: boolean) => void>(() => {});

/** Zet de marketingweergave aan zolang deze pagina getoond wordt. */
export function MarketingPaginaMarker() {
  const zetMarketing = useContext(MarketingModusContext);
  useEffect(() => {
    zetMarketing(true);
    return () => zetMarketing(false);
  }, [zetMarketing]);
  return null;
}
