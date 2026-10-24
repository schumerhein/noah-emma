"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Cookie } from "lucide-react";
import { CookieInstellingenKnop } from "@/components/CookieMelding";

const SECTIES = [
  {
    titel: "Wat zijn cookies?",
    tekst: `Cookies zijn kleine tekstbestanden die een website op je apparaat plaatst. Vergelijkbare technieken, zoals lokale opslag in je browser (localStorage), vallen onder dezelfde regels. In dit beleid noemen we ze allemaal cookies.`,
  },
  {
    titel: "Noodzakelijke cookies (altijd aan)",
    tekst: `Deze zijn nodig om de website en app te laten werken. Hiervoor hoeven we geen toestemming te vragen.

• ne_ingelogd (cookie, 30 dagen): onthoudt dat je ingelogd bent, zodat je direct in de app terechtkomt.
• ne_gast (cookie, tot je de browser sluit): onthoudt dat je als gast het aanbod bekijkt.
• Inlogsessie van Supabase (lokale opslag): houdt je ingelogd. Verdwijnt als je uitlogt.
• noah-emma-cookievoorkeur (lokale opslag, 12 maanden): onthoudt je cookiekeuze, met datum.
• App-instellingen zoals donkere modus, filters en meldingen (lokale opslag): blijven tot je ze wist.`,
  },
  {
    titel: "Analytische cookies (alleen met jouw toestemming)",
    tekst: `Met Google Analytics zien we welke pagina's goed werken en waar het beter kan. Deze cookies plaatsen we pas nadat je op "Akkoord" hebt geklikt.

• _ga (cookie van Google, 2 jaar): onderscheidt bezoekers.
• _ga_N04N5JQH0R (cookie van Google, 2 jaar): onthoudt je bezoek.

Zo hebben we Google Analytics ingesteld:
• Google Signals en advertentiepersonalisatie staan uit. Je gegevens worden niet gebruikt voor advertenties.
• Google Analytics slaat geen IP-adressen op.
• Gegevens worden maximaal 14 maanden bewaard.

Google is de verwerker van deze gegevens. Meer informatie vind je op policies.google.com/privacy.`,
  },
  {
    titel: "Wat we niet doen",
    tekst: `We plaatsen geen advertentie- of trackingcookies, zoals die van Google Ads of de Facebook Pixel. We verkopen nooit gegevens aan derden.`,
  },
  {
    titel: "Je keuze wijzigen of intrekken",
    tekst: `Bij je eerste bezoek vragen we of je analytische cookies toestaat. Weigeren is net zo makkelijk als accepteren. Je keuze geldt 12 maanden, daarna vragen we het opnieuw.

Je kunt je keuze altijd wijzigen met de knop bovenaan deze pagina, via "Cookie-instellingen" onderaan de website, of in de app via Profiel → Mijn voorkeuren. Trek je je toestemming in, dan stopt het meten direct en verwijderen we de Google Analytics-cookies.

Je kunt cookies ook zelf wissen via de instellingen van je browser. Wis je de noodzakelijke cookies, dan word je uitgelogd.`,
  },
  {
    titel: "Wijzigingen",
    tekst: `Komt er een nieuw soort cookie bij, dan passen we dit beleid aan en vragen we opnieuw om je toestemming.`,
  },
  {
    titel: "Contact",
    tekst: `Vragen over ons cookiebeleid? Stuur een e-mail naar info@noah-emma.nl. Lees ook onze privacyverklaring op noah-emma.nl/privacy.`,
  },
];

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-20">
      <header className="px-5 pt-14 pb-5 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Cookiebeleid</h1>
        </div>
      </header>

      <main className="px-5 pt-6 pb-10 max-w-2xl mx-auto space-y-8">
        {/* Intro */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center shrink-0">
            <Cookie className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-emerald-800 dark:text-emerald-200">Wij houden het simpel</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Noah & Emma gebruikt standaard alleen noodzakelijke cookies. Analytische cookies staan uit tot jij ze aanzet. Geen advertenties, geen dataverkoop.
            </p>
            <CookieInstellingenKnop className="mt-3 min-h-[44px] px-4 rounded-full bg-[#241A2E] text-white text-sm font-bold" />
          </div>
        </div>

        <p className="text-xs text-slate-400">Laatste wijziging: 24 oktober 2026</p>

        {SECTIES.map(sectie => (
          <section key={sectie.titel} className="space-y-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white">{sectie.titel}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {sectie.tekst}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
}
