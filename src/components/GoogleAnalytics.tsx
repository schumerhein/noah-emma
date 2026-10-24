"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { leesCookieKeuze, opCookieKeuze } from "@/lib/cookieToestemming";
import { meetLinkKlik } from "@/lib/analytics";

const MEET_ID = "G-N04N5JQH0R";

/**
 * Google Analytics (GA4). Wordt pas geladen nadat de bezoeker analytische
 * cookies heeft toegestaan, zoals ons cookiebeleid belooft. Trekt iemand de
 * toestemming later in, dan zet de consent-update het meten direct uit.
 * Met toestemming meten we ook klikken op e-mail-, aanmeld- en inloglinks
 * (zie src/lib/analytics.ts).
 */
export function GoogleAnalytics() {
  const [toestemming, setToestemming] = useState(false);

  useEffect(() => {
    setToestemming(leesCookieKeuze() === "alle");
    return opCookieKeuze((k) => {
      const aan = k === "alle";
      setToestemming(aan);
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("consent", "update", { analytics_storage: aan ? "granted" : "denied" });
    });
  }, []);

  // Eén luisteraar voor de hele site, zodat ook links die later bijkomen
  // vanzelf meegeteld worden.
  useEffect(() => {
    if (!toestemming) return;
    const klik = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (a) meetLinkKlik(a);
    };
    document.addEventListener("click", klik, true);
    return () => document.removeEventListener("click", klik, true);
  }, [toestemming]);

  if (!toestemming) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEET_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${MEET_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
