"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Cookie } from "lucide-react";

const SECTIES = [
  {
    titel: "Wat zijn cookies?",
    tekst: `Cookies zijn kleine tekstbestanden die door een website op je apparaat worden geplaatst wanneer je de website bezoekt. Ze worden gebruikt om de website goed te laten functioneren en om informatie te onthouden over jou als gebruiker.`,
  },
  {
    titel: "Welke cookies gebruiken wij?",
    tekst: `Noah & Emma gebruikt standaard alleen functionele cookies. Dit zijn cookies die strikt noodzakelijk zijn voor het werken van de applicatie.

**Functionele cookies (noodzakelijk)**
• Sessiecookie: Houdt bij dat je bent ingelogd, zodat je niet bij elke pagina opnieuw hoeft in te loggen. Vervalt wanneer je de browser afsluit of na 30 dagen.
• Voorkeurscookie: Onthoudt jouw instellingen zoals donkere modus. Vervalt na 1 jaar.

**Optionele cookies (alleen met jouw toestemming)**
• Analytische cookies: Helpen ons begrijpen hoe de app gebruikt wordt, zodat we hem kunnen verbeteren. Gegevens zijn geanonimiseerd.
• Personalisatiecookies: Maken een gepersonaliseerde feed en relevante aanbevelingen mogelijk.

Optionele cookies staan standaard UIT. Je beheert ze via Profiel → Mijn voorkeuren. Wij plaatsen nooit advertentiecookies en verkopen nooit gegevens aan derden.`,
  },
  {
    titel: "Third-party diensten",
    tekst: `Noah & Emma maakt gebruik van de volgende diensten die mogelijk eigen cookies plaatsen:

• **Supabase**: onze database- en authenticatieprovider. Supabase plaatst technische cookies voor sessiebeheer. Zie supabase.com/privacy voor hun beleid.
• **DiceBear**: voor het genereren van avatars. DiceBear is een statische API en plaatst geen cookies.

Er worden geen advertentie- of trackingcookies van Google Ads, Facebook Pixel of vergelijkbare diensten gebruikt.`,
  },
  {
    titel: "Cookies beheren",
    tekst: `Functionele cookies zijn noodzakelijk voor het werken van de app en kunnen niet worden uitgeschakeld zonder de werking te beïnvloeden.

Je kunt cookies verwijderen via de instellingen van je browser. Let op: als je de sessiescookie verwijdert, word je uitgelogd en moet je opnieuw inloggen.

Instructies per browser:
• Chrome: Instellingen → Privacy en beveiliging → Cookies
• Safari: Instellingen → Safari → Geavanceerd
• Firefox: Instellingen → Privacy en beveiliging`,
  },
  {
    titel: "Wijzigingen",
    tekst: `Dit cookiebeleid kan worden aangepast als wij nieuwe diensten toevoegen. We informeren je hierover via de app.`,
  },
  {
    titel: "Contact",
    tekst: `Vragen over ons cookiebeleid? Stuur een e-mail naar privacy@noahemma.nl.`,
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
              Noah & Emma gebruikt standaard alleen noodzakelijke cookies. Optionele cookies staan uit tot jij ze aanzet. Geen advertenties, geen dataverkoop.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">Laatste wijziging: 1 juni 2025</p>

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
